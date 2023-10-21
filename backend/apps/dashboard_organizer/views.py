import secrets
import uuid

import rollbar
import stripe
from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.core.validators import validate_email
from django.db import transaction
from django.http import Http404
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.generic import TemplateView, View
from django.views.generic.base import ContextMixin, RedirectView
from django.views.generic.detail import DetailView, SingleObjectMixin
from django.views.generic.edit import CreateView, DeleteView, FormView, UpdateView
from django.views.generic.list import ListView

from apps.dashboard_organizer.forms import (
    CustomInviteForm,
    EventCreateForm,
    EventForm,
    TeamForm,
    TicketTierForm,
    TierAssetOwnershipForm,
    TierFiatForm,
    RSVPCreateTicketsForm,
)
from apps.root.models import (
    Event,
    Invite,
    Membership,
    Team,
    Ticket,
    TicketTier,
    TierFree,
    CheckoutSession,
    CheckoutItem,
    RSVPBatch,
)
from apps.root import exceptions

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
        if event.state != Event.StateStatus.LIVE:
            messages.add_message(
                self.request,
                messages.INFO,
                "This event is not live yet. \
                Please complete the creation process.",
            )
            return redirect("dashboard_organizer:event_update", **self.kwargs)

        return super().dispatch(request, *args, **kwargs)


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
            "dashboard_organizer:event_list",
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
                return reverse(
                    "dashboard_organizer:event_list", args=(membership.team.public_id,)
                )
            else:
                return reverse("dashboard_organizer:team_create")
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

    template_name = "redesign/dashboard_organizer/team_details.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["memberships"] = Membership.objects.filter(team=context["current_team"])
        return context


class TeamMemberManageView(TeamContextMixin, FormView):
    """
    Manage a team's members.
    """

    form_class = CustomInviteForm
    template_name = "redesign/dashboard_organizer/manage_members.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["memberships"] = Membership.objects.filter(team=context["current_team"])
        return context

    def form_valid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)

        # Check if already member
        if Membership.objects.filter(
            user__email=form.cleaned_data.get("email"),
            team=context["current_team"],
        ).exists():
            messages.add_message(self.request, messages.ERROR, "Already a member.")
            return super().form_invalid(form)

        # Delete existing invites (if they exist)
        invites = Invite.objects.filter(
            email=form.cleaned_data.get("email"),
            team=context["current_team"],
        )
        for invite in invites:
            invite.delete()

        # Create new invite
        instance = form.save(email=form.cleaned_data.get("email"))
        instance.team = context["current_team"]
        instance.inviter = self.request.user
        instance.save()
        instance.send_invitation(self.request)
        return super().form_valid(form)

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Team members updated successfully."
        )
        return reverse(
            "dashboard_organizer:team_members", args=(self.kwargs["team_public_id"],)
        )


class TeamMemberDeleteView(TeamContextMixin, DeleteView):
    """
    Manage a team's members.
    """

    object: Membership  # Mypy typing
    model = Membership
    pk_url_kwarg = "member_pk"
    template_name = "redesign/dashboard_organizer/member_delete.html"

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Team members updated successfully."
        )
        return reverse(
            "dashboard_organizer:team_members", args=(self.kwargs["team_public_id"],)
        )


class TeamUpdateView(TeamContextMixin, UpdateView):
    """
    Updates the user's team.
    """

    form_class = TeamForm
    model = Team
    pk_url_kwarg = "team_public_id"
    template_name = "redesign/dashboard_organizer/team_update.html"

    def get_object(self):
        return self.team

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Team information updated successfully."
        )
        return reverse(
            "dashboard_organizer:team_detail", args=(self.kwargs["team_public_id"],)
        )


class EventListView(TeamContextMixin, ListView):
    """
    Returns a list of Ticket token gates.
    """

    model = Event
    paginate_by = 15
    ordering = ["-modified"]
    context_object_name = "events"
    template_name = "redesign/dashboard_organizer/event_list.html"

    def get(self, *args, **kwargs):
        qs = self.get_queryset()
        if qs.count() < 1:
            messages.add_message(
                self.request, messages.INFO, "Let's create an event to get started!"
            )
            return redirect(
                "dashboard_organizer:event_create",
                self.kwargs["team_public_id"],
            )
        return super(EventListView, self).get(*args, **kwargs)

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(team__public_id=self.kwargs["team_public_id"])

        query_title = self.request.GET.get("title", "")
        if query_title:
            qs = qs.filter(title__icontains=query_title)

        query_state = self.request.GET.get("state", "")
        if query_state:
            qs = qs.filter(state=query_state)

        return qs


class EventCreateView(SuccessMessageMixin, TeamContextMixin, CreateView):
    """
    Creates an Event
    """

    model = Event
    form_class = EventCreateForm
    template_name = "redesign/dashboard_organizer/event_create.html"

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
        return "Your event has been created successfully!"

    def get_success_url(self, *args, **kwargs):
        return reverse(
            "dashboard_organizer:event_update",
            args=(self.kwargs["team_public_id"], self.object.pk),
        )


class EventUpdateView(SuccessMessageMixin, TeamContextMixin, UpdateView):
    """
    Updates an Event
    """

    model = Event
    slug_field = "pk"
    slug_url_kwarg = "pk"
    form_class = EventForm
    template_name = "redesign/dashboard_organizer/event_form.html"

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
        return "Your event has been updated successfully."


class EventTicketsView(TeamContextMixin, DetailView):
    """
    Show the tickets (and CTAs) for an event.
    """

    model = Event
    context_object_name = "event"
    template_name = "redesign/dashboard_organizer/event_ticket_tiers.html"

    def get_object(self):
        return (
            Event.objects.prefetch_related("tickettier_set__tier_asset_ownership")
            .prefetch_related("tickettier_set__tier_blockchain")
            .prefetch_related("tickettier_set__tier_fiat")
            .get(pk=self.kwargs["pk"], team__public_id=self.kwargs["team_public_id"])
        )


class EventGoLiveView(TeamContextMixin, DetailView):
    """
    Show controls to make a team's event go live
    """

    model = Event
    template_name = "redesign/dashboard_organizer/event_go_live.html"
    object = None

    def get_object(self):
        if not self.object:
            self.object = Event.objects.get(
                pk=self.kwargs["pk"], team__public_id=self.kwargs["team_public_id"]
            )
        return self.object

    def get(self, *args, **kwargs):
        event = self.get_object()
        has_fields, missing_fields = event.has_required_fields
        if not has_fields:
            messages.add_message(
                self.request,
                messages.WARNING,
                "Your event is missing some information.",
            )
            # TODO: Pass form field validation
            return redirect(
                "dashboard_organizer:event_update",
                self.kwargs["team_public_id"],
                event.pk,
            )
        if event.tickettier_set.count() < 1:
            messages.add_message(
                self.request,
                messages.WARNING,
                "Your event must have at least one ticket tier before going live.",
            )
            return redirect(
                "dashboard_organizer:ticket_tier_create",
                self.kwargs["team_public_id"],
                event.pk,
            )
        else:
            return super().get(*args, **kwargs)

    def post(self, *args, **kwargs):
        event = self.get_object()
        is_success = False
        if event.state != Event.StateStatus.LIVE:
            try:
                event.transition_live()
                is_success = True
            except Exception:
                rollbar.report_exc_info()
                messages.add_message(
                    self.request,
                    messages.ERROR,
                    "Something went wrong, please try again. Contact us if \
                    this error persists for longer than a few minutes.",
                )
            else:
                messages.add_message(
                    self.request, messages.SUCCESS, "Event has been made live!"
                )
        return redirect(
            reverse(
                "dashboard_organizer:event_go_live",
                kwargs={
                    "team_public_id": self.kwargs["team_public_id"],
                    "pk": event.pk,
                },
            )
            + f"?is_success={str(is_success)}"
        )


class EventDeleteView(TeamContextMixin, DeleteView):
    """
    Delete a team's event
    """

    object: Event  # Mypy typing
    model = Event
    template_name = "redesign/dashboard_organizer/event_delete.html"

    def get_object(self):
        return Event.objects.get(
            pk=self.kwargs["pk"], team__public_id=self.kwargs["team_public_id"]
        )

    def get_success_url(self):
        messages.add_message(self.request, messages.SUCCESS, "Event has been deleted.")
        return reverse(
            "dashboard_organizer:event_list", args=(self.kwargs["team_public_id"],)
        )


class EventStatsView(TeamContextMixin, DetailView):
    """
    Show stats, sales, orders, and check-in history of an event
    """

    model = Event
    template_name = "redesign/dashboard_organizer/event_stats.html"
    object = None

    def get_object(self):
        if not self.object:
            self.object = Event.objects.get(
                pk=self.kwargs["pk"], team__public_id=self.kwargs["team_public_id"]
            )
        return self.object

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        event = self.get_object()

        # Tickets
        tickets = Ticket.objects.select_related(
            "ticket_tier",
            "checkout_session",
            "checkout_session__tx_asset_ownership",
        ).filter(event=event)
        results = []
        for ticket in tickets:
            if ticket.checkout_session.tx_asset_ownership:
                wallet_address = (
                    ticket.checkout_session.tx_asset_ownership.wallet_address
                )
            else:
                wallet_address = None
            results.append(
                {
                    "ticket_id": str(ticket.public_id),
                    "ticket_tier": ticket.ticket_tier.ticket_type,
                    "created": ticket.created,
                    "redeemed_at": ticket.redeemed_at,
                    "checkout_session": str(ticket.checkout_session.public_id),
                    "customer_name": ticket.checkout_session.name,
                    "wallet_address": wallet_address,
                    "party_size": ticket.party_size,
                }
            )
        context["tickets"] = results

        # Tickets redeemed
        context["tickets_redeemed"] = event.tickets_redeemed
        return context


class TicketTierCreateView(TeamContextMixin, TemplateView):
    """
    Select the type of ticket tier to create.
    """

    template_name = "redesign/dashboard_organizer/ticket_tier_create.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__public_id=self.kwargs["team_public_id"]
        )
        return context


class TicketTierNFTCreateView(SuccessMessageMixin, TeamContextMixin, CreateView):
    """
    Create an NFT-based ticket tier.
    """

    model = TicketTier
    form_class = TicketTierForm
    template_name = "redesign/dashboard_organizer/ticket_tier_nft_create.html"
    form_data = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__public_id=self.kwargs["team_public_id"]
        )
        context["tier_asset_ownership_form"] = TierAssetOwnershipForm(
            prefix="tier_asset_ownership_form", data=self.form_data
        )
        return context

    def form_valid(self, form, **kwargs):
        # set form.data to self
        # this is reused in get_context_data to preserve entries / content
        self.form_data = form.data

        # validate tier_asset_ownership
        # if exists, save tier_asset_ownership to TicketTierForm instance
        tier_asset_ownership = TierAssetOwnershipForm(
            self.form_data, prefix="tier_asset_ownership_form"
        )
        if tier_asset_ownership.is_valid():
            tier_asset_ownership.save()
            form.instance.tier_asset_ownership = tier_asset_ownership.instance
        else:
            messages.add_message(
                self.request, messages.ERROR, "The Asset Ownership fields are not valid"
            )
            return super().form_invalid(form)

        # add event data to TicketTierForm from context
        # validate TicketTierForm
        context = self.get_context_data(**kwargs)
        form.instance.event = context["event"]
        return super().form_valid(form)

    def get_success_message(self, *args, **kwargs):
        return "Your ticket tier has been created successfully!"

    def get_success_url(self, *args, **kwargs):
        return reverse(
            "dashboard_organizer:event_tickets",
            args=(self.kwargs["team_public_id"], self.kwargs["event_pk"]),
        )


class TicketTierFiatCreateView(SuccessMessageMixin, TeamContextMixin, CreateView):
    """
    Create a Fiat-based ticket tier.
    """

    model = TicketTier
    form_class = TicketTierForm
    template_name = "redesign/dashboard_organizer/ticket_tier_paid_create.html"
    form_data = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__public_id=self.kwargs["team_public_id"]
        )
        context["tier_fiat_form"] = TierFiatForm(
            prefix="tier_fiat_form", data=self.form_data
        )
        return context

    def dispatch(self, request, *args, **kwargs):
        team = Team.objects.get(public_id=self.kwargs["team_public_id"])
        stripe_status = team.stripe_account_payouts_enabled
        if not (
            stripe_status["details_submitted"] and stripe_status["payouts_enabled"]
        ):
            messages.add_message(
                self.request,
                messages.ERROR,
                "Please connect your Stripe account first and make sure you "
                "can accept payouts.",
            )
            return redirect(
                "dashboard_organizer:payment_detail",
                self.kwargs["team_public_id"],
            )
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form, **kwargs):
        # set form.data to self
        # this is reused in get_context_data to preserve entries / content
        self.form_data = form.data

        # validate tier_asset_ownership
        # if exists, save tier_fiat to TicketTierForm instance
        tier_fiat = TierFiatForm(self.form_data, prefix="tier_fiat_form")
        if tier_fiat.is_valid():
            tier_fiat.save()
            form.instance.tier_fiat = tier_fiat.instance
        else:
            messages.add_message(
                self.request, messages.ERROR, "The Fiat fields are not valid"
            )
            return super().form_invalid(form)

        # add event data to TicketTierForm from context
        # validate TicketTierForm
        context = self.get_context_data(**kwargs)
        form.instance.event = context["event"]
        return super().form_valid(form)

    def get_success_message(self, *args, **kwargs):
        return "Your ticket tier has been created successfully!"

    def get_success_url(self, *args, **kwargs):
        return reverse(
            "dashboard_organizer:event_tickets",
            args=(self.kwargs["team_public_id"], self.kwargs["event_pk"]),
        )


class TicketTierFreeCreateView(SuccessMessageMixin, TeamContextMixin, CreateView):
    """
    Create a free ticket tier.
    """

    model = TicketTier
    form_class = TicketTierForm
    template_name = "redesign/dashboard_organizer/ticket_tier_free_create.html"
    form_data = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__public_id=self.kwargs["team_public_id"]
        )
        return context

    def form_valid(self, form, **kwargs):
        self.form_data = form.data
        form.instance.tier_free = TierFree.objects.create()
        context = self.get_context_data(**kwargs)
        form.instance.event = context["event"]
        return super().form_valid(form)

    def get_success_message(self, *args, **kwargs):
        return "Your ticket tier has been created successfully!"

    def get_success_url(self, *args, **kwargs):
        return reverse(
            "dashboard_organizer:event_tickets",
            args=(self.kwargs["team_public_id"], self.kwargs["event_pk"]),
        )


class TicketTierUpdateView(TeamContextMixin, UpdateView):
    """
    Update an event's ticket tier.
    """

    form_class = TicketTierForm
    model = TicketTier
    pk_url_kwarg = "pk"
    template_name = "redesign/dashboard_organizer/ticket_tier_update.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__public_id=self.kwargs["team_public_id"]
        )
        return context

    def form_valid(self, form):
        tickets_count = self.object.quantity_sold_without_party
        if form.cleaned_data["capacity"] < tickets_count:
            form.add_error(
                "capacity",
                f"Capacity can't be less than the number of issued tickets "
                f"(currently {str(tickets_count)}).",
            )
            return self.form_invalid(form)
        return super().form_valid(form)

    def get_success_url(self):
        messages.add_message(self.request, messages.SUCCESS, "Ticket has been edited.")
        return reverse(
            "dashboard_organizer:event_tickets",
            args=(self.kwargs["team_public_id"], self.kwargs["event_pk"]),
        )


class TicketTierDeleteView(TeamContextMixin, DeleteView):
    """
    Delete an event's ticket tier.
    """

    object: TicketTier  # Mypy typing
    model = TicketTier
    template_name = "redesign/dashboard_organizer/ticket_tier_delete.html"

    def get_object(self):
        return TicketTier.objects.get(
            pk=self.kwargs["pk"], event__team__public_id=self.kwargs["team_public_id"]
        )

    def get_success_url(self):
        messages.add_message(self.request, messages.SUCCESS, "Ticket has been deleted.")
        return reverse(
            "dashboard_organizer:event_tickets",
            args=(self.kwargs["team_public_id"], self.kwargs["event_pk"]),
        )


class PaymentDetailView(TeamContextMixin, TemplateView):
    """
    Connect and manage Stripe account.
    """

    template_name = "redesign/dashboard_organizer/payment_details.html"

    def post(self, *args, **kwargs):
        """
        Override POST view to handle Stripe flow
        """

        context = self.get_context_data(**kwargs)
        current_team = context["current_team"]
        stripe.api_key = settings.STRIPE_API_KEY

        # Stripe account already connected
        if current_team.is_stripe_connected:
            return redirect(
                "dashboard_organizer:payment_detail",
                self.kwargs["team_public_id"],
            )

        # Temporary Stripe account ID does not exist
        # Start connection flow for the first time by creating account
        if not current_team.tmp_stripe_account_id:
            try:
                stripe_account = stripe.Account.create(
                    type="express",  # Express Account
                    settings={
                        "payouts": {"schedule": {"interval": "manual"}}
                    },  # Manual Payouts
                )
            except Exception:
                rollbar.report_exc_info()
                messages.add_message(
                    self.request,
                    messages.ERROR,
                    "Something went wrong. Please try again.",
                )
                return redirect(
                    "dashboard_organizer:payment_detail",
                    self.kwargs["team_public_id"],
                )
            current_team.tmp_stripe_account_id = stripe_account["id"]
            current_team.save()

        # Create account link
        try:
            stripe_account_link = stripe.AccountLink.create(
                account=current_team.tmp_stripe_account_id,
                refresh_url=current_team.stripe_refresh_link,
                return_url=current_team.stripe_return_link,
                type="account_onboarding",
            )
        except Exception:
            rollbar.report_exc_info()
            messages.add_message(
                self.request,
                messages.ERROR,
                "Something went wrong. Please try again.",
            )
            return redirect(
                "dashboard_organizer:payment_detail",
                self.kwargs["team_public_id"],
            )

        # Redirect user to Stripe so that they can fill out the form
        return redirect(stripe_account_link["url"])


class StripeRefresh(TeamContextMixin, RedirectView):
    """
    Redirect to Stripe connect page.
    """

    def get_redirect_url(self, *args, **kwargs):
        messages.add_message(
            self.request,
            messages.ERROR,
            "Something went wrong. Please try again.",
        )
        return reverse(
            "dashboard_organizer:payment_detail", args=(self.kwargs["team_public_id"],)
        )


class StripeReturn(TeamContextMixin, RedirectView):
    """
    Check if Stripe account has been properly created, redirect accordingly.
    """

    def get_redirect_url(self, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        current_team = context["current_team"]
        stripe.api_key = settings.STRIPE_API_KEY

        # Stripe account already connected
        if current_team.is_stripe_connected:
            return reverse(
                "dashboard_organizer:payment_detail",
                args=(self.kwargs["team_public_id"],),
            )

        # Get Stripe account
        try:
            stripe_account = stripe.Account.retrieve(current_team.tmp_stripe_account_id)
        except Exception:
            rollbar.report_exc_info()
            messages.add_message(
                self.request,
                messages.ERROR,
                "Something went wrong. Please try again.",
            )
            return reverse(
                "dashboard_organizer:payment_detail",
                args=(self.kwargs["team_public_id"],),
            )

        # Make sure details have been submitted
        if stripe_account["details_submitted"]:
            current_team.stripe_account_id = current_team.tmp_stripe_account_id
            current_team.stripe_account_country = stripe_account["country"]
            current_team.save()
            messages.add_message(
                self.request,
                messages.SUCCESS,
                "Stripe account connected successfully!",
            )
        else:
            messages.add_message(
                self.request,
                messages.ERROR,
                "Something went wrong. Please try again.",
            )

        # Return redirect URL
        return reverse(
            "dashboard_organizer:payment_detail", args=(self.kwargs["team_public_id"],)
        )


class StripeDelete(TeamContextMixin, TemplateView):
    """
    Delete a connected Stripe account
    """

    template_name = "redesign/dashboard_organizer/stripe_delete.html"

    def post(self, *args, **kwargs):
        """
        Override POST view to handle Stripe deletion flow
        """

        context = self.get_context_data(**kwargs)
        current_team = context["current_team"]
        current_team.tmp_stripe_account_id = ""
        current_team.stripe_account_id = ""
        current_team.stripe_account_country = ""
        current_team.save()
        messages.add_message(
            self.request,
            messages.SUCCESS,
            "Stripe account has been removed.",
        )
        return redirect(
            "dashboard_organizer:payment_detail",
            self.kwargs["team_public_id"],
        )


class EventScanner(DetailView):
    model = Event
    slug_field = "scanner_id"
    slug_url_kwarg = "scanner_id"
    template_name = "redesign/scanner/scanner.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(dict(current_team=self.object.team))
        return context


class EventScannerStats(DetailView):
    model = Event
    slug_field = "scanner_id"
    slug_url_kwarg = "scanner_id"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(dict(current_team=self.object.team))
        return context

    def get(self, *args, **kwargs):
        self.object = self.get_object()
        context = super().get_context_data(**kwargs)
        return render(
            self.request,
            template_name="redesign/scanner/scanner_stats.html",
            context=context,
        )


class EventScanner2(DetailView):
    model = Event
    slug_field = "scanner_id"
    slug_url_kwarg = "scanner_id"
    template_name = "redesign/scanner/scanner2.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(dict(current_team=self.object.team))
        return context

    def post(self, *args, **kwargs):
        # Set event object
        self.object = self.get_object()
        context = super().get_context_data(**kwargs)

        # Get embed code & Check for valid UUID
        embed_code = self.request.POST.get("embed_code")
        if not embed_code:
            return render(
                self.request, template_name="redesign/scanner/scanner_error.html"
            )
        try:
            embed_code = uuid.UUID(str(embed_code))
        except ValueError:
            return render(
                self.request, template_name="redesign/scanner/scanner_error.html"
            )

        # Retrieve ticket
        try:
            ticket = Ticket.objects.get(embed_code=embed_code, event=self.object)
        except Ticket.DoesNotExist:
            return render(
                self.request, template_name="redesign/scanner/scanner_error.html"
            )

        # Redeem ticket
        try:
            ticket.redeem_ticket(self.object.scanner_id)
        except exceptions.ForbiddenRedemptionError:
            context["message"] = "Not an authorized scanner!"
            return render(
                self.request,
                template_name="redesign/scanner/scanner_error.html",
                context=context,
            )
        except exceptions.AlreadyRedeemedError:
            context["ticket"] = ticket
            context["message"] = "Ticket already scanned!"
            return render(
                self.request,
                template_name="redesign/scanner/scanner_warning.html",
                context=context,
            )

        # OK
        context["ticket"] = ticket
        return render(
            self.request,
            template_name="redesign/scanner/scanner_success.html",
            context=context,
        )


class RSVPTicketsView(TeamContextMixin, TemplateView):
    """
    Show the RSVP tickets (and CTAs) for an event.
    """

    template_name = "redesign/dashboard_organizer/rsvp_tickets.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__public_id=self.kwargs["team_public_id"]
        )
        context["rsvp_batches"] = RSVPBatch.objects.prefetch_related(
            "checkoutsession_set"
        ).filter(
            event=context["event"]
        ).order_by("-created")
        return context


class RSVPCreateTicketsView(TeamContextMixin, FormView):
    """
    Bulk create tickets using the RSVP system.
    """

    template_name = "redesign/dashboard_organizer/rsvp_create_tickets.html"
    form_class = RSVPCreateTicketsForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__public_id=self.kwargs["team_public_id"]
        )
        return context

    def get_form(self, form_class=None):
        form = super().get_form()
        form.fields["ticket_tier"].queryset = TicketTier.objects.filter(
            event__pk=self.kwargs["event_pk"]
        )
        return form

    def form_valid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)

        # Create RSVPBatch object
        rsvp_batch = RSVPBatch.objects.create(
            event=context["event"],
        )

        emails = form.cleaned_data["customer_emails"].split(",")
        for email in emails:
            try:
                # Validate Email
                validate_email(email.strip())

                # Create checkout session, items, and fulfill session
                with transaction.atomic():
                    checkout_session = CheckoutSession.objects.create(
                        event=context["event"],
                        rsvp_batch=rsvp_batch,
                        email=email.strip(),
                    )
                    checkout_item = CheckoutItem.objects.create(
                        ticket_tier=form.cleaned_data["ticket_tier"],
                        checkout_session=checkout_session,
                        quantity=1,
                    )
                    checkout_session.fulfill()
            except Exception as e:
                print(e)
                messages.add_message(
                    self.request,
                    messages.ERROR,
                    "Please make sure each email address is valid."
                )
                return super().form_invalid(form)

        return super().form_valid(form)

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "RSVP tickets created successfully."
        )
        return reverse(
            "dashboard_organizer:rsvp_tickets",
            args=(self.kwargs["team_public_id"], self.kwargs["event_pk"],)
        )
