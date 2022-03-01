from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import reverse
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, UpdateView
from django.views.generic.list import ListView

from .forms import TeamForm
from .models import AirdropGate, Team, TicketGate
from .site_permissions import member_has_permissions


# Dashboard and user related
@method_decorator(login_required, name="dispatch")
class DashboardView(TemplateView):
    """
    Main dashboard page.
    """

    template_name = "dashboard/dashboard.html"


@method_decorator(login_required, name="dispatch")
class UserDetailView(TemplateView):
    """
    Returns the details of the logged in user.
    """

    template_name = "root/user_detail.html"


@method_decorator(member_has_permissions(""), name="dispatch")
class TeamDetailView(DetailView):
    """
    Returns the details of the logged in user's team.
    """

    model = Team
    pk_url_kwarg = "team_pk"


@method_decorator(member_has_permissions(""), name="dispatch")
class TeamUpdateView(UpdateView):
    """
    Updates the user's team.
    """

    form_class = TeamForm
    model = Team
    pk_url_kwarg = "team_pk"
    template_name = "root/team_form.html"

    def form_valid(self, form):
        form.save()
        return super(TeamUpdateView, self).form_valid(form)

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Team information updated successfully."
        )
        return reverse("team_detail", args=(self.kwargs["team_pk"],))


# Airdrop token gates


@method_decorator(member_has_permissions("AIRDROP"), name="dispatch")
class AirdropGateListView(ListView):
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


@method_decorator(member_has_permissions("AIRDROP"), name="dispatch")
class AirdropGateDetailView(DetailView):
    """
    Returns the details of an Airdrop token gate.
    """

    model = AirdropGate
    context_object_name = "tokengate"
    template_name = "dashboard/airdropgate_detail.html"

    def get_queryset(self):
        qs = AirdropGate.objects.filter(team__id=self.kwargs["team_pk"])
        return qs


@method_decorator(member_has_permissions("AIRDROP"), name="dispatch")
class AirdropGateCreateView(CreateView):
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

    def form_valid(self, form):
        form.instance.team = Team.objects.get(id=self.kwargs["team_pk"])
        form.instance.user = self.request.user
        form.instance.general_type = "AIRDROP"
        return super().form_valid(form)

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Token gate created successfully."
        )
        return reverse("airdropgate_list", args=(self.kwargs["team_pk"],))


@method_decorator(member_has_permissions("AIRDROP"), name="dispatch")
class AirdropGateUpdateView(UpdateView):
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


# Ticket token gates


@method_decorator(member_has_permissions("TICKET"), name="dispatch")
class TicketGateListView(ListView):
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


@method_decorator(member_has_permissions("TICKET"), name="dispatch")
class TicketGateDetailView(DetailView):
    """
    Returns the details of an Ticket token gate.
    """

    model = TicketGate
    context_object_name = "tokengate"
    template_name = "dashboard/ticketgate_detail.html"

    def get_queryset(self):
        qs = TicketGate.objects.filter(team__id=self.kwargs["team_pk"])
        return qs


@method_decorator(member_has_permissions("TICKET"), name="dispatch")
class TicketGateCreateView(CreateView):
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

    def form_valid(self, form):
        form.instance.team = Team.objects.get(id=self.kwargs["team_pk"])
        form.instance.user = self.request.user
        form.instance.general_type = "TICKET"
        return super().form_valid(form)

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Token gate created successfully."
        )
        return reverse("ticketgate_list", args=(self.kwargs["team_pk"],))


@method_decorator(member_has_permissions("TICKET"), name="dispatch")
class TicketGateUpdateView(UpdateView):
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
