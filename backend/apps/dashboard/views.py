import json
import secrets

from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.http import Http404
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.generic import TemplateView, View
from django.views.generic.base import ContextMixin, RedirectView
from django.views.generic.detail import DetailView, SingleObjectMixin
from django.views.generic.edit import CreateView, DeleteView, FormView, UpdateView
from django.views.generic.list import ListView

from apps.dashboard.forms import (
    CustomInviteForm,
    EventDraftForm,
    EventLiveForm,
    TeamForm,
)
from apps.root.models import Event, Invite, Membership, Team, Ticket

User = auth.get_user_model()


class TeamContextMixin(UserPassesTestMixin, ContextMixin):
    """
    Common context used site-wide
    Used to set current_team from team_public_id
    """

    def test_func(self):
        try:
            user_membership = Membership.objects.select_related("team").get(
                team__public_id=self.kwargs["team_public_id"],
                user__id=self.request.user.id,
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
            raise Http404

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(dict(current_team=self.team))
        return context


class RequireLiveEventMixin:
    """
    Mixin to require successful 'LIVE' event
    """

    def dispatch(self, request, *args, **kwargs):
        event = self.get_object()
        if not isinstance(event, Event):
            raise RuntimeError(
                "get_object must return an Event when using RequireLiveEventMixin"
            )
        if event.state != Event.StateEnum.LIVE.value:
            messages.add_message(
                self.request,
                messages.INFO,
                "This event is not live yet. \
                Please complete the creation process.",
            )
            return redirect("dashboard:event_update", **self.kwargs)

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
            "dashboard:event_list",
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

                return reverse("dashboard:event_list", args=(membership.team.public_id,))
            else:
                return reverse("dashboard:team_create")
        else:
            return reverse("account_login")


class TeamAcceptInviteView(SingleObjectMixin, View):
    """
    Inherited AcceptInvite from beekeeper-invitations
    """

    def get_queryset(self):
        return Invite.objects.all()

    def get_signup_redirect(self):
        return "account_signup"

    def get_object(self, queryset=None):
        if queryset is None:
            queryset = self.get_queryset()
        try:
            return queryset.get(key=self.kwargs["key"].lower())
        except Invite.DoesNotExist:
            return None

    def accept_invite(self, invitation, request):
        """
        Class method for accepting invite
        """
        invitation.accepted = True
        invitation.archived_email = invitation.email
        invitation.email = f"{secrets.token_urlsafe(12)}{invitation.archived_email}"
        invitation.save()
        DefaultAccountAdapter().stash_verified_email(
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
        return reverse("dashboard:team_members", args=(self.kwargs["team_public_id"],))


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
        return reverse("dashboard:team_members", args=(self.kwargs["team_public_id"],))


class TeamUpdateView(TeamContextMixin, UpdateView):
    """
    Updates the user's team.
    """

    form_class = TeamForm
    model = Team
    pk_url_kwarg = "team_public_id"
    template_name = "dashboard/team_form.html"

    def get_object(self):
        return self.team

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Team members updated successfully."
        )
        return reverse("dashboard:team_detail", args=(self.kwargs["team_public_id"],))


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
        qs = qs.filter(team__public_id=self.kwargs["team_public_id"])

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


class EventDetailView(TeamContextMixin, RequireLiveEventMixin, DetailView):
    """
    Returns the details of an Ticket token gate.
    """

    model = Event
    context_object_name = "event"
    template_name = "dashboard/event_detail.html"

    def get_queryset(self):
        qs = Event.objects.filter(
            pk=self.kwargs["pk"], team__public_id=self.kwargs["team_public_id"]
        )
        return qs


class EventCreateView(SuccessMessageMixin, TeamContextMixin, CreateView):
    """
    Creates an Event
    """

    model = Event
    form_class = EventDraftForm
    template_name = "dashboard/event_form.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["GMAPS_API_KEY"] = settings.GMAPS_API_KEY
        return context

    def form_valid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)
        form.instance.team = context["current_team"]
        form.instance.user = self.request.user
        return super().form_valid(form)

    def get_success_message(self, *args, **kwargs):
        if self.object.state == Event.StateEnum.DRAFT.value:
            return "Your draft has been saved"
        elif self.object.state == Event.StateEnum.LIVE.value:
            return "Your changes have been saved"


class EventUpdateView(SuccessMessageMixin, TeamContextMixin, UpdateView):
    """
    Updates an Event
    """

    model = Event
    slug_field = "pk"
    slug_url_kwarg = "pk"
    template_name = "dashboard/event_form.html"

    def get_form_class(self):
        """get form class based on event state"""
        if self.object.state == Event.StateEnum.DRAFT.value:
            return EventDraftForm
        elif self.object.state == Event.StateEnum.LIVE.value:
            return EventLiveForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = self.object
        context["GMAPS_API_KEY"] = settings.GMAPS_API_KEY
        return context

    def form_valid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)
        form.instance.team = context["current_team"]
        form.instance.user = self.request.user
        return super().form_valid(form)

    def get_success_message(self, *args, **kwargs):
        if self.object.state == Event.StateEnum.DRAFT.value:
            return "Your draft has been saved"
        elif self.object.state == Event.StateEnum.LIVE.value:
            return "Your changes have been saved"


class EventDeleteView(TeamContextMixin, DeleteView):
    """
    Delete a team's event
    """

    model = Event
    template_name = "dashboard/event_delete.html"

    def get_object(self):
        return Event.objects.get(
            pk=self.kwargs["pk"], team__public_id=self.kwargs["team_public_id"]
        )

    def get_success_url(self):
        messages.add_message(self.request, messages.SUCCESS, "Event has been deleted")
        if self.object.state == Event.StateEnum.LIVE.value:
            return reverse("dashboard:event_list", args=(self.kwargs["team_public_id"],))
        else:
            return reverse(
                "dashboard:event_drafts", args=(self.kwargs["team_public_id"],)
            )


class EventStatisticsView(TeamContextMixin, RequireLiveEventMixin, ListView):
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
            pk=self.kwargs["pk"], team__public_id=self.kwargs["team_public_id"]
        )
        return context

    def get_object(self):
        return Event.objects.get(
            pk=self.kwargs["pk"], team__public_id=self.kwargs["team_public_id"]
        )

    def get_queryset(self):
        """
        get queryset of Ticket models from given Event
        """
        gate = self.get_object()
        qs = Ticket.objects.filter(checkout_item__ticket_tier__event=gate)
        qs = qs.order_by("-modified")

        query_address = self.request.GET.get("address", "")
        if query_address:
            qs = qs.filter(wallet_address__icontains=query_address)

        return qs
