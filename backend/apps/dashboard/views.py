import json
import secrets
from functools import lru_cache

import stripe
from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.core import exceptions
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render, reverse
from django.utils import dateparse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.views.generic.base import ContextMixin, RedirectView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, DeleteView, FormView, UpdateView
from django.views.generic.list import ListView
from invitations.adapters import get_invitations_adapter
from invitations.views import AcceptInvite

from apps.dashboard import services
from apps.dashboard.forms import CustomInviteForm, EventForm, TeamForm
from apps.dashboard.models import EventStripePayment, Membership, Team
from apps.root.model_field_choices import (
    ASSET_TYPES,
    BLOCKCHAINS,
    CHAIN_IDS,
    EventStatusEnum,
)
from apps.root.model_field_schemas import REQUIREMENT_SCHEMA
from apps.root.models import Event, Ticket

User = auth.get_user_model()


class TeamContextMixin(UserPassesTestMixin, ContextMixin):
    """
    Common context used site-wide
    Used to set current_team from team_pk
    """

    def test_func(self):
        try:
            user_membership = Membership.objects.select_related("team").get(
                team__public_id=self.kwargs["team_pk"], user__id=self.request.user.id
            )
            self.team = user_membership.team
        except Exception:
            user_membership = False

        return self.request.user.is_authenticated and user_membership

    def handle_no_permission(self):
        if not self.request.user.is_authenticated:
            return LoginRequiredMixin.handle_no_permission(self)
        else:
            # TODO: Should this be 403?
            # Unsure if that exposes security concern
            return HttpResponse(status=404)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(dict(current_team=self.team))
        return context


class RequireSuccesfulCheckoutMixin:
    """
    Mixin to require successful checkout for view.
    """

    def pending_checkout_behaviour(self):
        """
        Action to take when event has pending payment. Default is redirect to checkout with message.
        """
        messages.add_message(
            self.request, messages.INFO, "Checkout is pending for this event."
        )
        return redirect("event_checkout", **self.kwargs)

    def dispatch(self, request, *args, **kwargs):
        event = self.get_object()
        if not isinstance(event, Event):
            raise RuntimeError(
                "get_object must return an Event when using RequireSuccesfulCheckoutMixin"
            )

        if event.state == EventStatusEnum.PENDING_CHECKOUT.value:
            return self.pending_checkout_behaviour()

        return super().dispatch(request, *args, **kwargs)


class UserDetailView(TemplateView):
    """
    Returns the details of the logged in user.
    """

    template_name = "account/detail.html"


class TeamCreateView(LoginRequiredMixin, CreateView):
    """
    Creates a new team.
    """

    model = Team
    form_class = TeamForm
    template_name = "account/team_create.html"

    def get_success_url(self):
        self.object.members.add(self.request.user)
        messages.add_message(
            self.request, messages.SUCCESS, "Your team has been created successfully."
        )
        return reverse(
            "event_list",
            args=(self.object.public_id,),
        )


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

                return reverse("event_list", args=(membership.team.public_id,))
            else:
                return reverse("team_create")
        else:
            return reverse("account_login")


class TeamAcceptInviteView(AcceptInvite):
    """
    Inherited AcceptInvite from beekeeper-invitations
    """

    def accept_invite(self, invitation, request):
        """
        Class method for accepting invite
        """
        invitation.accepted = True
        invitation.archived_email = invitation.email
        invitation.email = f"{secrets.token_urlsafe(12)}{invitation.archived_email}"
        invitation.save()
        get_invitations_adapter().stash_verified_email(
            self.request, invitation.archived_email
        )
        # If team, add success message
        if invitation.team:
            messages.add_message(
                self.request,
                messages.SUCCESS,
                f"Invitation to '{invitation.team.name}' accepted",
            )

    def get(self, *args, **kwargs):
        """
        Override post view for more general-specific accept invite view
        """
        # Get object
        self.object = invitation = self.get_object()

        # Error checks
        # Error conditions are: no key, expired key or already accepted
        if not invitation or (invitation and (invitation.key_expired())):
            return render(self.request, "invitations/invalid.html")
        if invitation.accepted:
            return render(self.request, "invitations/already_accepted.html")

        return render(
            self.request, "invitations/accept.html", {"invitation": invitation}
        )

    def post(self, *args, **kwargs):
        """
        Override post view for more general-specific accept invite view
        """
        # Get object
        self.object = invitation = self.get_object()

        # Error checks
        # Error conditions are: no key, expired key or already accepted
        if not invitation or (invitation and (invitation.key_expired())):
            return render(self.request, "invitations/invalid.html")
        if invitation.accepted:
            return render(self.request, "invitations/already_accepted.html")

        # The invitation is valid.
        # Mark it as accepted now if ACCEPT_INVITE_AFTER_SIGNUP is False.
        self.accept_invite(
            invitation=invitation,
            request=self.request,
        )

        # The invitation has been accepted.
        # Check if user exists for redirect url and membership creation purposes
        try:
            user = User.objects.get(email__iexact=invitation.archived_email)
            self.redirect_url = reverse("account_login")
        except User.DoesNotExist:
            user = None
            self.redirect_url = reverse("account_signup")

        # Everything finalized
        # Try to create a membership if possible
        if user and invitation.team:
            membership, created = Membership.objects.get_or_create(
                team=invitation.team, user=user
            )
            if created:
                invitation.membership = membership
                invitation.save()

        return redirect(self.redirect_url)


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

    def get_object(self):
        return self.team

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Team members updated successfully."
        )
        return reverse("team_detail", args=(self.kwargs["team_pk"],))


class EventListView(TeamContextMixin, ListView):
    """
    Returns a list of Ticket token gates.
    """

    model = Event
    paginate_by = 15
    ordering = ["-modified"]
    context_object_name = "events"
    template_name = "dashboard/event_list.html"

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(team__public_id=self.kwargs["team_pk"])

        query_title = self.request.GET.get("title", "")
        if query_title:
            qs = qs.filter(title__icontains=query_title)

        return qs


class PublishedEventsListView(EventListView):
    def get_queryset(self):
        return super().get_queryset().filter_active()


class WIPEventsListView(EventListView):
    def get_queryset(self):
        return super().get_queryset().filter_inactive()


class EventDetailView(TeamContextMixin, RequireSuccesfulCheckoutMixin, DetailView):
    """
    Returns the details of an Ticket token gate.
    """

    model = Event
    context_object_name = "event"
    template_name = "dashboard/event_detail.html"

    def get_queryset(self):
        qs = Event.objects.filter(
            pk=self.kwargs["pk"], team__public_id=self.kwargs["team_pk"]
        )
        return qs


class EventCreateView(TeamContextMixin, CreateView):
    """
    Creates an Event
    """

    model = Event
    form_class = EventForm
    template_name = "dashboard/event_form.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["json_schema"] = json.dumps(REQUIREMENT_SCHEMA)
        context["BLOCKHAINS_CHOICES"] = json.dumps(dict(BLOCKCHAINS))
        context["CHAIN_IDS_CHOICES"] = json.dumps(dict(CHAIN_IDS))
        context["ASSET_TYPES_CHOICES"] = json.dumps(dict(ASSET_TYPES))
        context["GMAPS_API_KEY"] = settings.GMAPS_API_KEY
        return context

    def form_valid(self, form, **kwargs):
        # set user & team
        context = self.get_context_data(**kwargs)
        form.instance.team = context["current_team"]
        form.instance.user = self.request.user

        # set success url based on checkout requested
        if form.cleaned_data["checkout_requested"] is True:
            self._success_url = "event_checkout"
        else:
            messages.add_message(
                self.request, messages.INFO, "Your draft has been saved"
            )
            self._success_url = "event_update"
        return super().form_valid(form)

    def get_success_url(self):
        return reverse(
            self._success_url,
            args=(
                self.kwargs["team_pk"],
                self.object.pk,
            ),
        )


class EventUpdateView(TeamContextMixin, UpdateView):
    """
    Updates an Event
    """

    model = Event
    form_class = EventForm
    slug_field = "pk"
    slug_url_kwarg = "pk"
    template_name = "dashboard/event_form.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["json_schema"] = json.dumps(REQUIREMENT_SCHEMA)
        context["BLOCKHAINS_CHOICES"] = json.dumps(dict(BLOCKCHAINS))
        context["CHAIN_IDS_CHOICES"] = json.dumps(dict(CHAIN_IDS))
        context["ASSET_TYPES_CHOICES"] = json.dumps(dict(ASSET_TYPES))
        context["event"] = self.object
        context["GMAPS_API_KEY"] = settings.GMAPS_API_KEY
        return context

    def form_valid(self, form, **kwargs):
        # set user & team
        context = self.get_context_data(**kwargs)
        form.instance.team = context["current_team"]
        form.instance.user = self.request.user

        # set success url based on checkout requested
        if form.cleaned_data["checkout_requested"] is True:
            self._success_url = "event_checkout"
        else:
            messages.add_message(
                self.request, messages.INFO, "Your draft has been saved"
            )
            self._success_url = "event_update"
        return super().form_valid(form)

    def get_success_url(self):
        return reverse(
            self._success_url,
            args=(
                self.kwargs["team_pk"],
                self.object.pk,
            ),
        )


class EventCheckout(TeamContextMixin, TemplateView):
    """
    Checkout intermediate step for Event.

    Handles stripe integration.
    """

    template_name: str = "dashboard/event_checkout.html"
    stripe.api_key = settings.STRIPE_SECRET_KEY

    def dispatch(self, request, *args, **kwargs):
        self.kwargs = kwargs
        return super().dispatch(request, *args, **kwargs)

    @lru_cache
    def get_object(self):
        return Event.objects.get(
            pk=self.kwargs["pk"], team__public_id=self.kwargs["team_pk"]
        )

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs, event=self.get_object())

    def get(self, request, *args, **kwargs):
        """Renders checkout page if payment is still pending"""
        event = self.get_object()
        if event.state == EventStatusEnum.PENDING_CHECKOUT.value:
            messages.add_message(request, messages.INFO, "Event is ready for checkout")

        if event.state == EventStatusEnum.LIVE:
            messages.add_message(
                request, messages.INFO, "The payment has already been processed."
            )
            return redirect("event_detail", **kwargs)

        return super().get(request, *args, **kwargs)

    def post(self, request, *, team_pk=None, pk=None):
        """Issue payment and redirect to stripe checkout"""
        event = self.get_object()

        issued_payment = services.get_in_progress_payment(event)
        if issued_payment:
            # There is already a payment in progress, redirect to it
            stripe_session = stripe.checkout.Session.retrieve(
                issued_payment.stripe_checkout_session_id
            )
            if (
                stripe_session["status"] == "expired"
                and stripe_session["payment_status"] == "unpaid"
            ):
                issued_payment.status = "FAILURE"
                issued_payment.save()
            else:
                return redirect(stripe_session["url"])

        # build callback urls
        success_callback = (
            request.build_absolute_uri(
                reverse("event_checkout_success_callback", args=(team_pk, pk))
            )
            + "?session_id={CHECKOUT_SESSION_ID}"
        )
        failure_callback = (
            request.build_absolute_uri(
                reverse("event_checkout_failure_callback", args=(team_pk, pk))
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
                        "currency": event.price.currency,
                        "product_data": {
                            "name": event.title,
                        },
                        # TODO: support multiple currencies
                        "unit_amount": int(event.price.amount * 100),
                    },
                    "quantity": 1,
                }
            ],
        )

        # create payment intent
        services.issue_payment(event, checkout_session["id"])

        return redirect(checkout_session["url"])

    def success_stripe_callback(request, **kwargs):
        # update payment status
        stripe_session_id = request.GET["session_id"]
        stripe_session = stripe.checkout.Session.retrieve(stripe_session_id)
        payment = EventStripePayment.objects.get(
            stripe_checkout_session_id=stripe_session_id
        )

        if stripe_session.payment_status == "paid":
            payment.status = "SUCCESS"
            payment.event.transition_live()
            payment.event.save()
            message = "Event created and payment succeeded."
        else:
            payment.status = "PROCESSING"
            message = "Event created and payment is being processed."
        payment.save()

        messages.add_message(request, messages.SUCCESS, message)
        return redirect("event_detail", **kwargs)

    def failure_stripe_callback(request, **kwargs):
        # update payment status
        payment = EventStripePayment.objects.get(
            stripe_checkout_session_id=request.GET["session_id"]
        )
        payment.status = "CANCELLED"
        payment.save()

        # TODO: add sentry event so that administrator can contact user.
        messages.add_message(
            request,
            messages.ERROR,
            "Event created but could not process payment.",
        )
        return redirect("event_checkout", **kwargs)

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
            payment = EventStripePayment.objects.get(
                stripe_checkout_session_id=session.id
            )
            payment.status = "SUCCESS"
            payment.save()

        elif event["type"] == "checkout.session.async_payment_failed":
            session = event["data"]["object"]

            # Send an email to the customer asking them to retry their order
            payment = EventStripePayment.objects.get(
                stripe_checkout_session_id=session.id
            )
            payment.status = "FAILURE"
            payment.save()

        return HttpResponse(status=200)


class EventStatisticsView(TeamContextMixin, RequireSuccesfulCheckoutMixin, ListView):
    """
    Returns a list of ticket stats from ticket tokengates.
    """

    model = Ticket
    paginate_by = 15
    context_object_name = "tickets"
    template_name = "dashboard/event_stats.html"

    def get_context_data(self, **kwargs):
        """
        overrode to set json_schema as well as json data
        """
        context = super().get_context_data(**kwargs)
        context["current_gate"] = Event.objects.get(
            pk=self.kwargs["pk"], team__public_id=self.kwargs["team_pk"]
        )
        return context

    def get_object(self):
        return Event.objects.get(
            pk=self.kwargs["pk"], team__public_id=self.kwargs["team_pk"]
        )

    def get_queryset(self):
        """
        get queryset of Ticket models from given Event
        """
        gate = self.get_object()
        qs = gate.tickets.all()
        qs = qs.order_by("-modified")

        query_address = self.request.GET.get("address", "")
        if query_address:
            qs = qs.filter(wallet_address__icontains=query_address)

        return qs


class PricingCalculator(TeamContextMixin, View):
    def get(self, request, **kwargs):
        """
        Return pricing calculator form
        """
        try:
            capacity = int(request.GET.get("capacity"))
        except KeyError:
            return JsonResponse({"detail": "capacity is required"}, status=400)
        except TypeError:
            return JsonResponse({"detail": "capacity must be an integer"}, status=400)

        try:
            price_per_ticket = services.calculate_event_price_per_ticket_for_team(
                self.team, capacity=capacity
            )
        except ValueError:
            return JsonResponse(
                {"detail": "capacity not recognized as as valid value"}, status=400
            )

        return JsonResponse(
            {
                "price_per_ticket": price_per_ticket.amount,
                "price": price_per_ticket.amount * capacity,
            }
        )
