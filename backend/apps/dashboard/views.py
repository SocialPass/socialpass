import json
import stripe

from django.conf import settings
from django.contrib import auth, messages
from django.http import JsonResponse
from django.shortcuts import redirect, reverse
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django.views.generic.base import ContextMixin, RedirectView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from django.views.generic.list import ListView
from apps.root import pricing_service

from apps.root.model_field_schemas import REQUIREMENTS_SCHEMA
from apps.root.models import Membership, Team, Ticket, TicketGate, TokenGateStripePayment

from .forms import TeamForm, TicketGateForm, TicketGateUpdateForm
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
                return "https://socialpass.io"
        else:
            return reverse("account_login")


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
class TeamMemberManageView(WebsiteCommonMixin, TemplateView):
    """
    Manage a team's members.
    """

    template_name = "dashboard/member_form.html"


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
        form.save()
        
        # create checkout session
        stripe.api_key = settings.STRIPE_SECRET_KEY
        success_callback = self.request.build_absolute_uri(
            reverse("stripe_success_callback", args=(self.kwargs["team_pk"], '{CHECKOUT_SESSION_ID}'))
        )
        failure_callback = self.request.build_absolute_uri(
            reverse("stripe_failure_callback", args=(self.kwargs["team_pk"], '{CHECKOUT_SESSION_ID}'))
        )
        print(success_callback)
        self.checkout_session = stripe.checkout.Session.create(
            success_url=success_callback,
            cancel_url=failure_callback,
            payment_method_types=['card'],
            mode='payment',
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': form.instance.title,
                    },
                    'unit_amount': int(form.instance.price * 100), # amount unit is in cent of dollars
                },
                'quantity': 1,
            }]
        )
        TokenGateStripePayment.objects.create(
            token_gate=form.instance,
            value=form.instance.price,
            stripe_checkout_session_id=self.checkout_session['id'],            
        )

        return super().form_valid(form)

    def get_success_url(self):
        return self.checkout_session['url']


class TicketCreateStripeCallbackView:

    @method_decorator(team_has_permissions(software_type="TICKET"), name="dispatch")
    @staticmethod
    def success(request, **kwargs):
        # update payment status
        payment = TokenGateStripePayment.objects.get(stripe_checkout_session_id=kwargs['session_id'])
        payment.status = "PROCESSING"
        payment.save()

        messages.add_message(
            request, messages.SUCCESS, "Token gate created and payment is being processed."
        )
        return redirect(
            reverse("ticketgate_list", args=(kwargs["team_pk"],))
        )

    @method_decorator(team_has_permissions(software_type="TICKET"), name="dispatch")
    @staticmethod
    def failure(request, **kwargs):
        # update payment status
        payment = TokenGateStripePayment.objects.get(stripe_checkout_session_id=kwargs['session_id'])
        payment.status = "CANCELLED"
        payment.save()

        # TODO: we won't handle failures gracefully since a payment will be submitted only on ticket creation
        # TODO: add sentry event so that administrator can contact user.
        messages.add_message(
            request, messages.ERROR, "Token gate created but could not process payment."
        )
        return redirect(
            reverse("ticketgate_list", args=(kwargs["team_pk"],))
        )


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
