from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import reverse, redirect
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView, ContextMixin
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, UpdateView, DeleteView, FormView
from django.views.generic.list import ListView

from .forms import TeamForm, CustomInviteForm
from .models import AirdropGate, Team, TicketGate, Membership, Invite
from .site_permissions import team_has_permissions


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


class RedirectToTeamView(RedirectView):
    """
    Root URL View
    Redirects user to first found membership / team.

    If no membership / team found, redirect to socialpass landing page
    """

    permanent = False

    def get_redirect_url(self, *args, **kwargs):
        if self.request.user.is_authenticated:
            membership = Membership.objects.filter(user=self.request.user).first()
            if membership:
                return reverse("dashboard", args=(membership.team.pk,))
            else:
                return 'https://socialpass.io'
        else:
            return reverse("account_login")


@method_decorator(team_has_permissions(""), name="dispatch")
class DashboardView(WebsiteCommonMixin, TemplateView):
    """
    Main dashboard page.
    """

    template_name = "dashboard/dashboard.html"


@method_decorator(team_has_permissions(""), name="dispatch")
class TeamDetailView(WebsiteCommonMixin, TemplateView):
    """
    Returns the details of the logged in user's team.
    """

    template_name = "dashboard/team_detail.html"


@method_decorator(team_has_permissions(""), name="dispatch")
class TeamMemberManageView(WebsiteCommonMixin, FormView):
    """
    Manage a team's members.
    """
    form_class = CustomInviteForm
    template_name = "dashboard/member_form.html"

    def form_valid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)
        instance = form.save(email=form.cleaned_data.get('email'))
        instance.team = context['current_team']
        instance.inviter = self.request.user
        instance.save()
        instance.send_invitation(self.request)
        return super().form_valid(form)

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Team information updated successfully."
        )
        return reverse("team_members", args=(self.kwargs["team_pk"],))

@method_decorator(team_has_permissions(""), name="dispatch")
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

@method_decorator(team_has_permissions(""), name="dispatch")
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


@method_decorator(team_has_permissions("AIRDROP"), name="dispatch")
class AirdropGateListView(WebsiteCommonMixin, ListView):
    """
    Returns a list of Airdrop token gates.
    """

    model = AirdropGate
    paginate_by = 15
    context_object_name = "tokengates"
    template_name = "dashboard/airdropgate_list.html"

    def get_queryset(self):
        qs = AirdropGate.objects.filter(team__id=self.kwargs["team_pk"])
        qs = qs.order_by("-modified")

        query_title = self.request.GET.get("title", "")
        if query_title:
            qs = qs.filter(title__icontains=query_title)

        return qs


@method_decorator(team_has_permissions("AIRDROP"), name="dispatch")
class AirdropGateDetailView(WebsiteCommonMixin, DetailView):
    """
    Returns the details of an Airdrop token gate.
    """

    model = AirdropGate
    context_object_name = "tokengate"
    template_name = "dashboard/airdropgate_detail.html"

    def get_queryset(self):
        qs = AirdropGate.objects.filter(team__id=self.kwargs["team_pk"])
        return qs


@method_decorator(team_has_permissions("AIRDROP"), name="dispatch")
class AirdropGateCreateView(WebsiteCommonMixin, CreateView):
    """
    Creates a new Airdrop token gate.
    """

    model = AirdropGate
    fields = [
        "title",
        "description",
        "chain",
        "asset_type",
        "asset_address",
        "amount_per_person",
        "total_amount",
        "start_date",
        "end_date",
        "requirements",
    ]
    template_name = "dashboard/airdropgate_form.html"

    def form_valid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)
        form.instance.team = context["current_team"]
        form.instance.user = self.request.user
        form.instance.general_type = "AIRDROP"
        return super().form_valid(form)

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Token gate created successfully."
        )
        return reverse("airdropgate_list", args=(self.kwargs["team_pk"],))


@method_decorator(team_has_permissions("AIRDROP"), name="dispatch")
class AirdropGateUpdateView(WebsiteCommonMixin, UpdateView):
    """
    Updates an Airdrop token gate.
    """

    model = AirdropGate
    fields = [
        "title",
        "description",
        "chain",
        "asset_type",
        "asset_address",
        "amount_per_person",
        "total_amount",
        "start_date",
        "end_date",
        "requirements",
    ]
    template_name = "dashboard/airdropgate_form.html"

    def get_queryset(self):
        qs = AirdropGate.objects.filter(team__id=self.kwargs["team_pk"])
        return qs

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Token gate updated successfully."
        )
        return reverse(
            "airdropgate_detail",
            args=(
                self.kwargs["team_pk"],
                self.object.pk,
            ),
        )


@method_decorator(team_has_permissions("TICKET"), name="dispatch")
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


@method_decorator(team_has_permissions("TICKET"), name="dispatch")
class TicketGateDetailView(WebsiteCommonMixin, DetailView):
    """
    Returns the details of an Ticket token gate.
    """

    model = TicketGate
    context_object_name = "tokengate"
    template_name = "dashboard/ticketgate_detail.html"

    def get_queryset(self):
        qs = TicketGate.objects.filter(team__id=self.kwargs["team_pk"])
        return qs


@method_decorator(team_has_permissions("TICKET"), name="dispatch")
class TicketGateCreateView(WebsiteCommonMixin, CreateView):
    """
    Creates a new Ticket token gate.
    """

    model = TicketGate
    fields = [
        "title",
        "description",
        "date",
        "location",
        "capacity",
        "deadline",
        "requirements",
    ]
    template_name = "dashboard/ticketgate_form.html"

    def form_valid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)
        form.instance.team = context["current_team"]
        form.instance.user = self.request.user
        form.instance.general_type = "TICKET"
        return super().form_valid(form)

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Token gate created successfully."
        )
        return reverse("ticketgate_list", args=(self.kwargs["team_pk"],))


@method_decorator(team_has_permissions("TICKET"), name="dispatch")
class TicketGateUpdateView(WebsiteCommonMixin, UpdateView):
    """
    Updates an Ticket token gate.
    """

    model = TicketGate
    fields = [
        "title",
        "description",
        "date",
        "location",
        "capacity",
        "deadline",
        "requirements",
    ]
    template_name = "dashboard/ticketgate_form.html"

    def get_queryset(self):
        qs = TicketGate.objects.filter(team__id=self.kwargs["team_pk"])
        return qs

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
