import json
from functools import lru_cache

import stripe
from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, reverse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.views.generic.base import ContextMixin, RedirectView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, DeleteView, FormView, UpdateView
from django.views.generic.list import ListView
from invitations.views import AcceptInvite

from apps.services import pricing_service
from apps.root.forms import CustomInviteForm, TeamForm, TicketedEventForm
from apps.root.model_field_schemas import REQUIREMENT_SCHEMA
from apps.root.model_field_choices import BLOCKCHAINS, CHAIN_IDS, ASSET_TYPES
from apps.root.models import Membership, Team, Ticket, TicketedEvent, TicketedEventStripePayment

User = auth.get_user_model()

class UserDetailView(TemplateView):
    """
    Returns the details of the logged in user.
    """

    template_name = "account/detail.html"


class AcceptInviteView(AcceptInvite):
    """
    Inherited AcceptInvite from beekeeper-invitations
    """

    def post(self, *args, **kwargs):
        """
        Override invite view to either redirect to login or signup,
        depending on if user has account or not
        """
        try:
            self.object = self.get_object()
            user = User.objects.get(email__iexact=self.object.email)
            if user:
                super().post(self, *args, **kwargs)
                return redirect(reverse(settings.LOGIN_URL))
        except Exception:
            return super().post(self, *args, **kwargs)


class TeamContextMixin(UserPassesTestMixin, ContextMixin):
    """
    Common context used site-wide
    Used to set current_team from team_pk
    """

    def test_func(self):
        # check user authenticated and membership to team PK
        user_logged_in = self.request.user.is_authenticated
        try:
            user_membership = Membership.objects.select_related("team").get(
                team__id=self.kwargs["team_pk"], user__id=self.request.user.id
            )
            self.team = user_membership.team
        except Exception:
            user_membership = False

        return user_logged_in and user_membership

    def handle_no_permission(self):
        return LoginRequiredMixin.handle_no_permission(self)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(dict(current_team=self.team))
        return context


class RedirectToTeamView(RedirectView):
    """
    Root URL View
    Redirects user to first found membership / team.

    If no membership / team found, redirect to socialpass landing page
    """

    permanent = False

    def get_redirect_url(self, *args, **kwargs):
        if self.request.user.is_authenticated:
            membership = Membership.objects.filter(user=self.request.user).last()
            if membership:
                return reverse("ticketgate_list", args=(membership.team.pk,))
        else:
            return reverse("account_login")


class TeamDetailView(TeamContextMixin, TemplateView):
    """
    Returns the details of the logged in user's team.
    """

    template_name = "dashboard/team_detail.html"


class TeamMemberManageView(TeamContextMixin, FormView):
    """
    Manage a team's members.
    """

    form_class = CustomInviteForm
    template_name = "dashboard/member_form.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["memberships"] = Membership.objects.filter(team=context["current_team"])
        return context

    def form_valid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)
        instance = form.save(email=form.cleaned_data.get("email"))
        instance.team = context["current_team"]
        instance.inviter = self.request.user
        instance.save()
        instance.send_invitation(self.request)
        return super().form_valid(form)

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Team information updated successfully."
        )
        return reverse("team_members", args=(self.kwargs["team_pk"],))


class TeamMemberDeleteView(TeamContextMixin, DeleteView):
    """
    Manage a team's members.
    """

    model = Membership
    pk_url_kwarg = "member_pk"
    template_name = "dashboard/member_delete.html"

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Team information updated successfully."
        )
        return reverse("team_members", args=(self.kwargs["team_pk"],))


class TeamUpdateView(TeamContextMixin, UpdateView):
    """
    Updates the user's team.
    """

    form_class = TeamForm
    model = Team
    pk_url_kwarg = "team_pk"
    template_name = "dashboard/team_form.html"

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Team members updated successfully."
        )
        return reverse("team_detail", args=(self.kwargs["team_pk"],))


class TicketedEventListView(TeamContextMixin, ListView):
    """
    Returns a list of Ticket token gates.
    """

    model = TicketedEvent
    paginate_by = 15
    context_object_name = "tokengates"
    template_name = "dashboard/ticketgate_list.html"

    def get_queryset(self):
        qs = TicketedEvent.objects.filter(team__id=self.kwargs["team_pk"])
        qs = qs.order_by("-modified")

        query_title = self.request.GET.get("title", "")
        if query_title:
            qs = qs.filter(title__icontains=query_title)

        return qs


class TicketedEventDetailView(TeamContextMixin, DetailView):
    """
    Returns the details of an Ticket token gate.
    """

    model = TicketedEvent
    context_object_name = "tokengate"
    template_name = "dashboard/ticketgate_detail.html"

    def get_queryset(self):
        qs = TicketedEvent.objects.filter(
            pk=self.kwargs["pk"], team__id=self.kwargs["team_pk"]
        )
        return qs


class TicketedEventCreateView(TeamContextMixin, CreateView):
    """
    Creates a new Ticket token gate.
    """

    model = TicketedEvent
    form_class = TicketedEventForm
    template_name = "dashboard/ticketgate_form.html"

    def get_context_data(self, **kwargs):
        """
        overrode to set json_schema
        """
        context = super().get_context_data(**kwargs)
        context["json_schema"] = json.dumps(REQUIREMENT_SCHEMA)
        context['BLOCKHAINS_CHOICES'] = json.dumps(dict(BLOCKCHAINS))
        context['CHAIN_IDS_CHOICES'] = json.dumps(dict(CHAIN_IDS))
        context['ASSET_TYPES_CHOICES'] = json.dumps(dict(ASSET_TYPES))

        return context

    def form_valid(self, form, **kwargs):
        # set rest of form
        context = self.get_context_data(**kwargs)
        form.instance.team = context["current_team"]
        form.instance.user = self.request.user
        form.instance.general_type = "TICKET"

        return super().form_valid(form)

    def get_success_url(self):
        return reverse(
            "ticketgate_checkout",
            args=(
                self.kwargs["team_pk"],
                self.object.pk,
            ),
        )


class TicketedEventUpdateView(TeamContextMixin, UpdateView):
    """
    Updates a Ticket token gate.
    """

    model = TicketedEvent
    form_class = TicketedEventForm
    slug_field = "pk"
    slug_url_kwarg = "pk"
    template_name = "dashboard/ticketgate_form.html"

    def get_context_data(self, **kwargs):
        """
        overrode to set json_schema
        """
        context = super().get_context_data(**kwargs)
        context["json_schema"] = json.dumps(REQUIREMENT_SCHEMA)
        context['BLOCKHAINS_CHOICES'] = json.dumps(dict(BLOCKCHAINS))
        context['CHAIN_IDS_CHOICES'] = json.dumps(dict(CHAIN_IDS))
        context['ASSET_TYPES_CHOICES'] = json.dumps(dict(ASSET_TYPES))
        return context

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Token gate updated successfully."
        )
        if pricing_service.get_ticketed_event_pending_payment_value(self.object):
            view = "ticketgate_checkout"
        else:
            view = "ticketgate_detail"

        return reverse(
            view,
            args=(
                self.kwargs["team_pk"],
                self.object.pk,
            ),
        )


class TicketedEventCheckout(TeamContextMixin, TemplateView):
    """
    Checkout intermediate step for TicketedEvent.

    Handles stripe integration.
    """

    template_name: str = "dashboard/ticketgate_checkout.html"
    stripe.api_key = settings.STRIPE_SECRET_KEY

    def dispatch(self, request, *args, **kwargs):
        self.kwargs = kwargs
        return super().dispatch(request, *args, **kwargs)

    @lru_cache
    def get_object(self):
        return TicketedEvent.objects.get(
            pk=self.kwargs["pk"], team__pk=self.kwargs["team_pk"]
        )

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs, tokengate=self.get_object())

    def get(self, request, *args, **kwargs):
        """Renders checkout page if payment is still pending"""
        ticketed_event = self.get_object()

        if pricing_service.get_ticketed_event_pending_payment_value(ticketed_event) == 0:
            # Payment was already done.
            messages.add_message(
                request, messages.INFO, "The payment has already been processed."
            )
            return redirect("ticketgate_detail", **kwargs)

        return super().get(request, *args, **kwargs)

    def post(self, request, *, team_pk=None, pk=None):
        """Issue payment and redirect to stripe checkout"""
        ticketed_event = self.get_object()

        issued_payment = pricing_service.get_in_progress_payment(ticketed_event)
        if issued_payment:
            # There is already a payment in progress, redirect to it
            stripe_session = stripe.checkout.Session.retrieve(
                issued_payment.stripe_checkout_session_id
            )
            if stripe_session['status'] == 'expired' and stripe_session['payment_status'] == 'unpaid':
                issued_payment.status = 'FAILURE'
                issued_payment.save()
            else:
                return redirect(stripe_session['url'])

        # build callback urls
        success_callback = (
            request.build_absolute_uri(
                reverse("ticketgate_checkout_success_callback", args=(team_pk, pk))
            )
            + "?session_id={CHECKOUT_SESSION_ID}"
        )
        failure_callback = (
            request.build_absolute_uri(
                reverse("ticketgate_checkout_failure_callback", args=(team_pk, pk))
            )
            + "?session_id={CHECKOUT_SESSION_ID}"
        )

        # create checkout session
        checkout_session = stripe.checkout.Session.create(
            client_reference_id=request.user.id,
            success_url=success_callback,
            cancel_url=failure_callback,
            payment_method_types=["card"],
            mode="payment",
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": ticketed_event.title,
                        },
                        "unit_amount": int(
                            ticketed_event.price * 100
                        ),  # amount unit is in cent of dollars
                    },
                    "quantity": 1,
                }
            ],
        )

        # create payment intent
        pricing_service.issue_payment(ticketed_event, checkout_session["id"])

        return redirect(checkout_session["url"])

    def success_stripe_callback(request, **kwargs):
        # update payment status
        stripe_session_id = request.GET["session_id"]
        stripe_session = stripe.checkout.Session.retrieve(stripe_session_id)
        payment = TicketedEventStripePayment.objects.get(
            stripe_checkout_session_id=stripe_session_id
        )

        if stripe_session.payment_status == "paid":
            payment.status = "SUCCESS"
            message = "Ticket gate created and payment succeeded."
        else:
            payment.status = "PROCESSING"
            message = "Ticket gate created and payment is being processed."
        payment.save()

        messages.add_message(request, messages.SUCCESS, message)
        print(kwargs)
        return redirect("ticketgate_detail", **kwargs)

    def failure_stripe_callback(request, **kwargs):
        # update payment status
        payment = TicketedEventStripePayment.objects.get(
            stripe_checkout_session_id=request.GET["session_id"]
        )
        payment.status = "CANCELLED"
        payment.save()

        # TODO: add sentry event so that administrator can contact user.
        messages.add_message(
            request,
            messages.ERROR,
            "Ticket gate created but could not process payment.",
        )
        return redirect("ticketgate_checkout", **kwargs)

    @csrf_exempt
    def stripe_webhook(request):
        """
        !NOT IN USE AT THE MOMENT!

        TODO: Webhook is only required for asynchronous payment processing

        https://stripe.com/docs/payments/payment-methods/overview
        https://stripe.com/docs/sources

        What payment methods are we going to accept?
        """
        endpoint_secret = settings.STRIPE_ENDPOINT_SECRET
        payload = request.body
        sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
        event = None

        try:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        except ValueError:
            # Invalid payload
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError:
            # Invalid signature
            return HttpResponse(status=400)

        # Event is being handled at success/failure synchronous callback
        # if event['type'] == 'checkout.session.completed':

        if event["type"] == "checkout.session.async_payment_succeeded":
            session = event["data"]["object"]

            # Fulfill the purchase
            payment = TicketedEventStripePayment.objects.get(
                stripe_checkout_session_id=session.id
            )
            payment.status = "SUCCESS"
            payment.save()

        elif event["type"] == "checkout.session.async_payment_failed":
            session = event["data"]["object"]

            # Send an email to the customer asking them to retry their order
            payment = TicketedEventStripePayment.objects.get(
                stripe_checkout_session_id=session.id
            )
            payment.status = "FAILURE"
            payment.save()

        return HttpResponse(status=200)


class TicketedEventStatisticsView(TeamContextMixin, ListView):
    """
    Returns a list of ticket stats from ticket tokengates.
    """

    model = Ticket
    paginate_by = 15
    context_object_name = "tickets"
    template_name = "dashboard/ticketgate_stats.html"

    def get_context_data(self, **kwargs):
        """
        overrode to set json_schema as well as json data
        """
        context = super().get_context_data(**kwargs)
        context["current_gate"] = TicketedEvent.objects.get(
            pk=self.kwargs["pk"], team__id=self.kwargs["team_pk"]
        )
        return context

    def get_queryset(self):
        """
        get queryset of Ticket models from given TicketedEvent
        """
        gate = TicketedEvent.objects.get(
            pk=self.kwargs["pk"], team__id=self.kwargs["team_pk"]
        )
        qs = gate.tickets.all()
        qs = qs.order_by("-modified")

        query_address = self.request.GET.get("address", "")
        if query_address:
            qs = qs.filter(wallet_address__icontains=query_address)

        return qs


def estimate_ticketed_event_price(request, team_pk):
    """
    Returns a list of ticket stats from ticket tokengates.
    """
    team = Team.objects.get(pk=team_pk)
    try:
        capacity = int(request.GET.get("capacity"))
    except KeyError:
        return JsonResponse({"detail": "capacity is required"}, status=400)
    except TypeError:
        return JsonResponse({"detail": "capacity must be an integer"}, status=400)

    price_per_ticket = pricing_service.calculate_ticketed_event_price_per_ticket_for_team(
        team, capacity=capacity
    )
    return JsonResponse(
        {"price_per_ticket": price_per_ticket, "price": price_per_ticket * capacity}
    )
