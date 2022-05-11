import json
from invitations.views import AcceptInvite

from django.conf import settings
from django.contrib import auth, messages
from django.shortcuts import redirect, reverse
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django.views.generic.base import ContextMixin, RedirectView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, DeleteView, FormView, UpdateView
from django.views.generic.list import ListView

from apps.root.model_field_schemas import REQUIREMENTS_SCHEMA
from apps.root.models import Membership, Team, Ticket, TicketGate
from apps.root.forms import TeamForm, TicketGateForm, CustomInviteForm
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
        form.save()
        return super().form_valid(form)

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Token gate created successfully."
        )
        return reverse("ticketgate_list", args=(self.kwargs["team_pk"],))


@method_decorator(team_has_permissions(software_type="TICKET"), name="dispatch")
class TicketGateUpdateView(WebsiteCommonMixin, UpdateView):
    """
    Updates a Ticket token gate.
    """

    model = TicketGate
    form_class = TicketGateForm
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
