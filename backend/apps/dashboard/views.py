import json
from invitations.views import AcceptInvite

from django.conf import settings
from django.contrib import auth, messages
from django.shortcuts import redirect, reverse
from django.http import JsonResponse
import stripe

from django.conf import settings
from django.contrib import auth, messages
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, reverse
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django.views.generic.base import ContextMixin, RedirectView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, DeleteView, FormView, UpdateView
from django.views.generic.list import ListView
from django.views.decorators.csrf import csrf_exempt
from apps.root import pricing_service

from apps.root.model_field_schemas import REQUIREMENTS_SCHEMA
from apps.root.models import Membership, Team, Ticket, TicketGate, TokenGateStripePayment
from .forms import TeamForm, TicketGateForm, TicketGateUpdateForm, CustomInviteForm
from .permissions import team_has_permissions

User = auth.get_user_model()


class WebsiteCommonMixin(ContextMixin):
    """
    Common context used site-wide
    Used to set current_team from team_pk
    """

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(dict(current_team=Team.objects.get(pk=self.kwargs["team_pk"])))
        return context


class UserDetailView(TemplateView):
    """
    Returns the details of the logged in user.
    """

    template_name = "account/detail.html"


class UserDeleteView(DeleteView):
    """
    Returns the details of the logged in user.
    """

    model = User
    template_name = "account/delete.html"

    def get_object(self):
        return self.request.user

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "User was deleted successfully."
        )
        return reverse("account_login")


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
                return reverse("dashboard", args=(membership.team.pk,))
        else:
            return reverse("account_login")


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
        except Exception as e:
            return super().post(self, *args, **kwargs)


@method_decorator(team_has_permissions(software_type=""), name="dispatch")
class DashboardView(WebsiteCommonMixin, TemplateView):
    """
    Main dashboard page.
    """

    template_name = "dashboard/dashboard.html"


@method_decorator(team_has_permissions(software_type=""), name="dispatch")
class TeamDetailView(WebsiteCommonMixin, TemplateView):
    """
    Returns the details of the logged in user's team.
    """

    template_name = "dashboard/team_detail.html"


@method_decorator(team_has_permissions(software_type=""), name="dispatch")
class TeamMemberManageView(WebsiteCommonMixin, FormView):
    """
    Manage a team's members.
    """
    form_class = CustomInviteForm
    template_name = "dashboard/member_form.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['memberships'] = Membership.objects.filter(team=context["current_team"])
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


@method_decorator(team_has_permissions(software_type=""), name="dispatch")
class TeamMemberDeleteView(WebsiteCommonMixin, DeleteView):
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


@method_decorator(team_has_permissions(software_type=""), name="dispatch")
class TeamUpdateView(WebsiteCommonMixin, UpdateView):
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


@method_decorator(team_has_permissions(software_type="TICKET"), name="dispatch")
class TicketGateListView(WebsiteCommonMixin, ListView):
    """
    Returns a list of Ticket token gates.
    """

    model = TicketGate
    paginate_by = 15
    context_object_name = "tokengates"
    template_name = "dashboard/ticketgate_list.html"

    def get_queryset(self):
        qs = TicketGate.objects.filter(team__id=self.kwargs["team_pk"])
        qs = qs.order_by("-modified")

        query_title = self.request.GET.get("title", "")
        if query_title:
            qs = qs.filter(title__icontains=query_title)

        return qs


@method_decorator(team_has_permissions(software_type="TICKET"), name="dispatch")
class TicketGateDetailView(WebsiteCommonMixin, DetailView):
    """
    Returns the details of an Ticket token gate.
    """

    model = TicketGate
    context_object_name = "tokengate"
    template_name = "dashboard/ticketgate_detail.html"

    def get_queryset(self):
        qs = TicketGate.objects.filter(
            pk=self.kwargs["pk"], team__id=self.kwargs["team_pk"]
        )
        return qs


@method_decorator(team_has_permissions(software_type="TICKET"), name="dispatch")
class TicketGateCreateView(WebsiteCommonMixin, CreateView):
    """
    Creates a new Ticket token gate.
    """

    model = TicketGate
    form_class = TicketGateForm
    template_name = "dashboard/ticketgate_form.html"

    def get_context_data(self, **kwargs):
        """
        overrode to set json_schema
        """
        context = super().get_context_data(**kwargs)
        context["json_schema"] = json.dumps(REQUIREMENTS_SCHEMA)
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


class TicketGateCheckout:
    """TODO: transform TicketGateCheckout into a TemplateView with its own checkout template"""

    @team_has_permissions(software_type="TICKET")
    def checkout(request, *, team_pk=None, pk=None):
        token_gate = TicketGate.objects.get(id=pk)

        if token_gate.payments.filter(status="SUCCESS").count() > 0:
            messages.add_message(
                request, messages.INFO, f"Cannot procceed to checkout since payment has already succeded."
            )
            return redirect(reverse("ticketgate_detail", args=(team_pk, pk)))

        if token_gate.payments.filter(status="PROCESSING").count() > 0:
            messages.add_message(
                request, messages.INFO, f"Cannot procceed to checkout since there is a payment being processed."
            )
            return redirect(reverse("ticketgate_detail", args=(team_pk, pk)))

        pending_payments = token_gate.payments.filter(status="PENDING")
        if pending_payments.count() != 1:
            # TODO: add sentry
            print("This should go to sentry because it is probably a bug")
        if pending_payments.count() == 1:
            stripe_session = stripe.checkout.Session.retrieve(
                pending_payments.last().stripe_checkout_session_id
            )
            return redirect(stripe_session['url'])

        # There is no payment, or previous payments failed. Create new payment

        # TODO: move payment creation to CreateView
        # TODO: retries (payment failure) should be handled elsewhere
        # TODO: move this into a service

        # build callback urls
        success_callback = request.build_absolute_uri(
            reverse("ticketgate_checkout_success_callback", args=(team_pk, pk))
        ) + "?session_id={CHECKOUT_SESSION_ID}"
        failure_callback = request.build_absolute_uri(
            reverse("ticketgate_checkout_failure_callback", args=(team_pk, pk))
        ) + "?session_id={CHECKOUT_SESSION_ID}"

        # create checkout session
        stripe.api_key = settings.STRIPE_SECRET_KEY
        checkout_session = stripe.checkout.Session.create(
            client_reference_id=request.user.id,
            success_url=success_callback,
            cancel_url=failure_callback,
            payment_method_types=['card'],
            mode='payment',
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': token_gate.title,
                    },
                    'unit_amount': int(token_gate.price * 100), # amount unit is in cent of dollars
                },
                'quantity': 1,
            }]
        )

        # create payment intent
        TokenGateStripePayment.objects.create(
            token_gate=token_gate,
            value=token_gate.price,
            stripe_checkout_session_id=checkout_session['id'],
        )

        return redirect(checkout_session['url'])

    @team_has_permissions(software_type="TICKET")
    def success(request, **kwargs):
        # update payment status
        stripe_session_id = request.GET['session_id']

        stripe_session = stripe.checkout.Session.retrieve(stripe_session_id)
        payment = TokenGateStripePayment.objects.get(stripe_checkout_session_id=stripe_session_id)

        if stripe_session.payment_status == "paid":
            payment.status = "SUCCESS"
        else:
            payment.status = "PROCESSING"

        payment.save()

        messages.add_message(
            request, messages.SUCCESS, f"Ticket gate created and payment is being processed."
        )
        return redirect(
            redirect(reverse("ticketgate_detail", args=(kwargs["team_pk"], payment.token_gate.id)))
        )

    @team_has_permissions(software_type="TICKET")
    def failure(request, **kwargs):
        # update payment status
        payment = TokenGateStripePayment.objects.get(stripe_checkout_session_id=request.GET['session_id'])
        payment.status = "CANCELLED"
        payment.save()

        # TODO: add sentry event so that administrator can contact user.
        messages.add_message(
            request, messages.ERROR, f"Ticket gate created but could not process payment."
        )
        return redirect((reverse("ticketgate_update", args=(kwargs["team_pk"], payment.token_gate.id))))

    @csrf_exempt
    @staticmethod
    def stripe_webhook(request):
        """
        TODO:
        Webhook should only be required for asynchronous payment processing

        https://stripe.com/docs/payments/payment-methods/overview
        https://stripe.com/docs/sources

        What payment methods are we going to accept?
        """
        stripe.api_key = settings.STRIPE_SECRET_KEY
        endpoint_secret = settings.STRIPE_ENDPOINT_SECRET
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            # Invalid payload
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return HttpResponse(status=400)

        # Handle the checkout.session.completed event
        # if event['type'] == 'checkout.session.completed':
            # TODO handle payment status on this event instead of callback

        if event['type'] == 'checkout.session.async_payment_succeeded':
            session = event['data']['object']

            # Fulfill the purchase
            payment = TokenGateStripePayment.objects.get(stripe_checkout_session_id=session.id)
            payment.status = "SUCCESS"
            payment.save()

        elif event['type'] == 'checkout.session.async_payment_failed':
            session = event['data']['object']

            # Send an email to the customer asking them to retry their order
            payment = TokenGateStripePayment.objects.get(stripe_checkout_session_id=session.id)
            payment.status = "FAILURE"
            payment.save()

        return HttpResponse(status=200)

@method_decorator(team_has_permissions(software_type="TICKET"), name="dispatch")
class TicketGateUpdateView(WebsiteCommonMixin, UpdateView):
    """
    Updates a Ticket token gate.
    """

    model = TicketGate
    form_class = TicketGateUpdateForm
    slug_field = "pk"
    slug_url_kwarg = "pk"
    template_name = "dashboard/ticketgate_form.html"

    def get_context_data(self, **kwargs):
        """
        overrode to set json_schema
        """
        context = super().get_context_data(**kwargs)
        context["json_schema"] = json.dumps(REQUIREMENTS_SCHEMA)
        return context

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Token gate updated successfully."
        )
        return reverse(
            "ticketgate_detail",
            args=(
                self.kwargs["team_pk"],
                self.object.pk,
            ),
        )


@method_decorator(team_has_permissions(software_type="TICKET"), name="dispatch")
class TicketGateStatisticsView(WebsiteCommonMixin, ListView):
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
        context["current_gate"] = TicketGate.objects.get(
            pk=self.kwargs["pk"], team__id=self.kwargs["team_pk"]
        )
        return context

    def get_queryset(self):
        """
        get queryset of Ticket models from given TicketGate
        """
        gate = TicketGate.objects.get(
            pk=self.kwargs["pk"], team__id=self.kwargs["team_pk"]
        )
        qs = gate.tickets.all()
        qs = qs.order_by("-modified")

        query_address = self.request.GET.get("address", "")
        if query_address:
            qs = qs.filter(wallet_address__icontains=query_address)

        return qs


@team_has_permissions(software_type="TICKET")
def estimate_ticket_gate_price(request, team_pk):
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


    price_per_ticket = pricing_service.calculate_ticket_gate_price_per_ticket_for_team(team, capacity=capacity)
    return JsonResponse(
        {
            "price_per_ticket": price_per_ticket,
            "price": price_per_ticket * capacity
        }
    )
