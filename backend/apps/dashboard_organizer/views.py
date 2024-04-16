import uuid

import rollbar
import stripe
import zoneinfo
from allauth.account.adapter import DefaultAccountAdapter
from allauth.account.admin import EmailAddress
from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.sites.models import Site
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.db.models import Q
from django.http import Http404
from django.shortcuts import redirect, render
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils import timezone
from django.views.generic import TemplateView, View
from django.views.generic.base import ContextMixin, RedirectView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, DeleteView, FormView, UpdateView
from django.views.generic.list import ListView

from apps.dashboard_organizer.forms import (
    InvitationForm,
    EventForm,
    TicketingSetupForm,
    TeamForm,
    TicketTierForm,
    TierAssetOwnershipForm,
    TierFiatForm,
    RSVPCreateTicketsForm,
    MessageBatchForm,
)
from apps.root.models import (
    Event,
    Invitation,
    Membership,
    MessageBatch,
    Team,
    Ticket,
    TicketTier,
    CheckoutSession,
    RSVPBatch,
)
from apps.root.tasks import (
    task_handle_event_google_class,
    task_handle_message_batch_delivery,
    task_handle_rsvp_delivery,
)
from apps.root import exceptions

User = auth.get_user_model()


class TeamContextMixin(UserPassesTestMixin, ContextMixin):
    """
    Common context used site-wide
    Used to set current_team from team_slug
    """

    def test_func(self):
        try:
            user_membership = Membership.objects.select_related("team").get(
                team__slug=self.kwargs["team_slug"],
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
            raise Http404

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(dict(current_team=self.team))
        return context


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
            args=(self.object.slug,),
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
                    "dashboard_organizer:event_list", args=(membership.team.slug,)
                )
            else:
                return reverse("dashboard_organizer:team_create")
        else:
            return reverse("account_login")


class InvitationDetailView(View):
    """
    Allows a user to accept an invitation, either by logging in, or by
    creating a new account.

    Much of the conditional logic is handled in the template.
    """

    def get_object(self):
        return Invitation.objects.select_related("team").get(
            public_id=self.kwargs["invitation_public_id"]
        )

    def email_belongs_to_user(self, user, invitation):
        """
        Check if the recipient email (of the invitation) belongs to the logged 
        in user or not.
        """
        if user.is_authenticated:
            for emailaddress in user.emailaddress_set.all():
                if invitation.email == emailaddress.email and emailaddress.verified:
                    return True
        return False

    def get(self, *args, **kwargs):
        context = {}

        # Get invitation
        try:
            invitation = self.get_object()
        except Exception:
            raise Http404
        context["invitation"] = invitation

        # Stash email address
        DefaultAccountAdapter().stash_verified_email(self.request, invitation.email)

        # Check if email belongs to user
        context["email_belongs_to_user"] = self.email_belongs_to_user(
            self.request.user, invitation
        )

        # Check if user account exists or not
        # We check for verified email because if that exists, then user account
        # also exists
        account_exists = False
        if EmailAddress.objects.filter(email=invitation.email, verified=True).exists():
            account_exists = True
        context["account_exists"] = account_exists

        return render(
            self.request,
            template_name="invitations/invitation_detail.html",
            context=context,
        )

    def post(self, *args, **kwargs):
        # Get invitation
        try:
            invitation = self.get_object()
        except Exception:
            raise Http404

        # Validate again
        # Generic error message because we don't expect this to happen under
        # any normal circumstances. The GET method would handle proper messaging
        # via the template
        if (
            invitation.accepted
            or invitation.is_expired
            or not self.email_belongs_to_user(self.request.user, invitation)
        ):
            messages.add_message(self.request, messages.ERROR, "Something went wrong.")
            return redirect(
                "dashboard_organizer:invitation_detail",
                invitation.public_id,
            )

        # Create membership
        membership = Membership.objects.create(
            team=invitation.team,
            user=self.request.user,
        )

        # Update invitation, save, and redirect
        invitation.membership = membership
        invitation.accepted = True
        invitation.save()
        messages.add_message(self.request, messages.SUCCESS, "Invitation accepted.")
        return redirect(
            "dashboard_organizer:event_list",
            invitation.team.slug,
        )


class TeamDetailView(TeamContextMixin, TemplateView):
    """
    Returns the details of the logged in user's team.
    """

    template_name = "dashboard_organizer/team_details.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["memberships"] = Membership.objects.filter(team=context["current_team"])
        return context


class TeamMemberManageView(TeamContextMixin, FormView):
    """
    Manage a team's members.
    """

    form_class = InvitationForm
    template_name = "dashboard_organizer/manage_members.html"

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

        # Delete existing invitations (if they exist)
        invitations = Invitation.objects.filter(
            email=form.cleaned_data.get("email"),
            team=context["current_team"],
        )
        for invitation in invitations:
            invitation.delete()

        # Create new invitation
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
            "dashboard_organizer:team_members", args=(self.kwargs["team_slug"],)
        )


class TeamMemberDeleteView(TeamContextMixin, DeleteView):
    """
    Manage a team's members.
    """

    object: Membership  # Mypy typing
    model = Membership
    pk_url_kwarg = "member_pk"
    template_name = "dashboard_organizer/member_delete.html"

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Team members updated successfully."
        )
        return reverse(
            "dashboard_organizer:team_members", args=(self.kwargs["team_slug"],)
        )


class TeamUpdateView(TeamContextMixin, UpdateView):
    """
    Updates the user's team.
    """

    form_class = TeamForm
    model = Team
    pk_url_kwarg = "team_slug"
    template_name = "dashboard_organizer/team_update.html"

    def get_object(self):
        return self.team

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS, "Team information updated successfully."
        )
        return reverse("dashboard_organizer:team_detail", args=(self.kwargs["team_slug"],))


class EventListView(TeamContextMixin, ListView):
    """
    Returns a list of Ticket token gates.
    """

    model = Event
    paginate_by = 15
    ordering = ["-modified"]
    context_object_name = "events"
    template_name = "dashboard_organizer/event_list.html"

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(team__slug=self.kwargs["team_slug"])

        query_state = self.request.GET.get("state", "")
        if query_state == "Upcoming":
            qs = qs.filter(start_date__gt=timezone.now())
        elif query_state == "Past":
            qs = qs.filter(start_date__lt=timezone.now())

        return qs


class EventCreateView(SuccessMessageMixin, TeamContextMixin, CreateView):
    """
    Creates an Event
    """

    model = Event
    form_class = EventForm
    template_name = "dashboard_organizer/event_create.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["timezones"] = [
            timezone for timezone in sorted(zoneinfo.available_timezones())
        ]
        return context

    def form_valid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)
        form.instance.team = context["current_team"]
        form.instance.user = self.request.user
        response = super().form_valid(form)
        task_handle_event_google_class.defer(event_pk=form.instance.pk)
        return response

    def get_success_url(self, *args, **kwargs):
        return (
            reverse(
                "dashboard_organizer:event_tickets",
                args=(self.kwargs["team_slug"], self.object.pk),
            )
            + "?create_flow=true"
        )


class EventUpdateView(SuccessMessageMixin, TeamContextMixin, UpdateView):
    """
    Updates an Event
    """

    model = Event
    slug_field = "pk"
    slug_url_kwarg = "pk"
    form_class = EventForm
    template_name = "dashboard_organizer/event_update.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = self.object
        context["timezones"] = [
            timezone for timezone in sorted(zoneinfo.available_timezones())
        ]
        return context

    def form_valid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)
        form.instance.team = context["current_team"]
        form.instance.user = self.request.user
        task_handle_event_google_class.defer(event_pk=self.object.pk)
        return super().form_valid(form)

    def get_success_message(self, *args, **kwargs):
        return "Your event has been updated successfully."

    def get_success_url(self, *args, **kwargs):
        return reverse(
            "dashboard_organizer:event_update",
            args=(self.kwargs["team_slug"], self.object.pk),
        )


class EventTicketsView(SuccessMessageMixin, TeamContextMixin, UpdateView):
    """
    Show the tickets (and CTAs) for an event. Also show ticketing preferences
    form.
    """

    model = Event
    slug_field = "pk"
    slug_url_kwarg = "pk"
    form_class = TicketingSetupForm
    template_name = "dashboard_organizer/event_ticket_tiers.html"

    def get_object(self):
        return Event.objects.prefetch_related("tickettier_set").get(
            pk=self.kwargs["pk"], team__slug=self.kwargs["team_slug"]
        )

    def get_success_message(self, *args, **kwargs):
        return "Ticketing preferences have been updated."

    def get_success_url(self, *args, **kwargs):
        return (
            reverse(
                "dashboard_organizer:event_tickets",
                args=(self.kwargs["team_slug"], self.object.pk),
            )
            + "?showprefs=true"
        )


class EventDeleteView(TeamContextMixin, DeleteView):
    """
    Delete a team's event
    """

    object: Event  # Mypy typing
    model = Event
    template_name = "dashboard_organizer/event_delete.html"

    def get_object(self):
        return Event.objects.get(pk=self.kwargs["pk"], team__slug=self.kwargs["team_slug"])

    def get_success_url(self):
        messages.add_message(self.request, messages.SUCCESS, "Event has been deleted.")
        return reverse("dashboard_organizer:event_list", args=(self.kwargs["team_slug"],))


class EventStatsView(TeamContextMixin, DetailView):
    """
    Show stats, sales, orders, and check-in history of an event
    """

    model = Event
    template_name = "dashboard_organizer/event_stats.html"
    object = None

    def get_object(self):
        if not self.object:
            self.object = Event.objects.get(
                pk=self.kwargs["pk"], team__slug=self.kwargs["team_slug"]
            )
        return self.object

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        event = self.get_object()

        # Tickets
        tickets = Ticket.objects.select_related(
            "ticket_tier",
            "checkout_session",
        ).filter(event=event)
        results = []
        for ticket in tickets:
            if (
                ticket.checkout_session.session_type
                == CheckoutSession.SessionType.ASSET_OWNERSHIP
            ):
                wallet_address = ticket.checkout_session.wallet_address
                redeemed_nfts = [
                    nft["token_id"] for nft in ticket.checkout_session.redeemed_nfts
                ]
            else:
                wallet_address = None
                redeemed_nfts = None
            results.append(
                {
                    "ticket_id": str(ticket.public_id),
                    "ticket_tier": ticket.ticket_tier.name,
                    "created": ticket.created,
                    "redeemed_at": ticket.redeemed_at,
                    "checkout_session": str(ticket.checkout_session.public_id),
                    "customer_name": ticket.checkout_session.name,
                    "customer_email": ticket.checkout_session.email,
                    "wallet_address": wallet_address,
                    "redeemed_nfts": redeemed_nfts,
                    "party_size": ticket.party_size,
                }
            )
        context["tickets"] = results

        # Tickets redeemed
        context["tickets_scanned_count"] = event.tickets_scanned_count

        return context


class EventShareView(TeamContextMixin, DetailView):
    """
    Show public link, sharing, embed, etc.
    """

    model = Event
    template_name = "dashboard_organizer/event_share.html"
    object = None

    def get_object(self):
        if not self.object:
            self.object = Event.objects.get(
                pk=self.kwargs["pk"], team__slug=self.kwargs["team_slug"]
            )
        return self.object


class EventCheckInGuestsView(TeamContextMixin, DetailView):
    """
    Show link to the event scanner, and copy on how to use it
    """

    model = Event
    template_name = "dashboard_organizer/event_check_in_guests.html"
    object = None

    def get_object(self):
        if not self.object:
            self.object = Event.objects.get(
                pk=self.kwargs["pk"], team__slug=self.kwargs["team_slug"]
            )
        return self.object


class TicketTierNFTCreateView(SuccessMessageMixin, TeamContextMixin, CreateView):
    """
    Create an NFT-based ticket tier.
    """

    model = TicketTier
    form_class = TierAssetOwnershipForm
    template_name = "dashboard_organizer/ticket_tier_nft_create.html"
    form_data = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__slug=self.kwargs["team_slug"]
        )
        return context

    def form_valid(self, form, **kwargs):
        # add event data to TicketTierForm from context
        # validate TicketTierForm
        context = self.get_context_data(**kwargs)
        form.instance.event = context["event"]
        form.instance.category = TicketTier.Category.ASSET_OWNERSHIP

        return super().form_valid(form)

    def get_success_message(self, *args, **kwargs):
        return "Your ticket tier has been created successfully!"

    def get_success_url(self, *args, **kwargs):
        return reverse(
            "dashboard_organizer:event_tickets",
            args=(self.kwargs["team_slug"], self.kwargs["event_pk"]),
        )


class TicketTierFiatCreateView(SuccessMessageMixin, TeamContextMixin, CreateView):
    """
    Create a Fiat-based ticket tier.
    """

    model = TicketTier
    form_class = TierFiatForm
    template_name = "dashboard_organizer/ticket_tier_paid_create.html"
    form_data = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__slug=self.kwargs["team_slug"]
        )
        return context

    def dispatch(self, request, *args, **kwargs):
        team = Team.objects.get(slug=self.kwargs["team_slug"])
        stripe_status = team.stripe_account_payouts_enabled
        if not (stripe_status["details_submitted"] and stripe_status["payouts_enabled"]):
            messages.add_message(
                self.request,
                messages.ERROR,
                "Please connect your Stripe account first and make sure you "
                "can accept payouts.",
            )
            return redirect(
                "dashboard_organizer:payment_detail",
                self.kwargs["team_slug"],
            )
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)
        form.instance.event = context["event"]
        form.instance.category = TicketTier.Category.FIAT
        return super().form_valid(form)

    def get_success_message(self, *args, **kwargs):
        return "Your ticket tier has been created successfully!"

    def get_success_url(self, *args, **kwargs):
        return reverse(
            "dashboard_organizer:event_tickets",
            args=(self.kwargs["team_slug"], self.kwargs["event_pk"]),
        )


class TicketTierFreeCreateView(SuccessMessageMixin, TeamContextMixin, CreateView):
    """
    Create a free ticket tier.
    """

    model = TicketTier
    form_class = TicketTierForm
    template_name = "dashboard_organizer/ticket_tier_free_create.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__slug=self.kwargs["team_slug"]
        )
        return context

    def form_valid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)
        form.instance.event = context["event"]
        form.instance.category = TicketTier.Category.FREE
        return super().form_valid(form)

    def get_success_message(self, *args, **kwargs):
        return "Your ticket tier has been created successfully!"

    def get_success_url(self, *args, **kwargs):
        return reverse(
            "dashboard_organizer:event_tickets",
            args=(self.kwargs["team_slug"], self.kwargs["event_pk"]),
        )


class TicketTierUpdateView(TeamContextMixin, UpdateView):
    """
    Update an event's ticket tier.
    """

    form_class = TicketTierForm
    model = TicketTier
    pk_url_kwarg = "pk"
    template_name = "dashboard_organizer/ticket_tier_update.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__slug=self.kwargs["team_slug"]
        )
        return context

    def form_valid(self, form):
        tickets_count = self.object.tickets_sold_count
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
            args=(self.kwargs["team_slug"], self.kwargs["event_pk"]),
        )


class TicketTierDeleteView(TeamContextMixin, DeleteView):
    """
    Delete an event's ticket tier.
    """

    object: TicketTier  # Mypy typing
    model = TicketTier
    template_name = "dashboard_organizer/ticket_tier_delete.html"

    def get_object(self):
        return (
            TicketTier.objects.prefetch_related(
                "ticket_set", "checkoutitem_set", "checkoutitem_set__checkout_session"
            )
            .select_related("event")
            .get(pk=self.kwargs["pk"], event__team__slug=self.kwargs["team_slug"])
        )

    def has_sales(self):
        self.object = self.get_object()
        tickets_count = self.object.ticket_set.count()
        has_waitlist_session = False
        for checkout_item in self.object.checkoutitem_set.all():
            if checkout_item.checkout_session.waitlist_status:
                has_waitlist_session = True
                break
        if tickets_count > 0 or has_waitlist_session:
            return True
        return False

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = self.object.event
        context["has_sales"] = self.has_sales()
        return context

    def form_valid(self, form, **kwargs):
        if self.has_sales():
            messages.add_message(
                self.request,
                messages.ERROR,
                "This ticket tier cannot be deleted. Tickets have been issued, "
                "or there are sessions in the waitlist with this tier.",
            )
            return redirect(
                "dashboard_organizer:ticket_tier_delete",
                self.kwargs["team_slug"],
                self.kwargs["event_pk"],
                self.kwargs["pk"],
            )
        return super().form_valid(form)

    def get_success_url(self):
        messages.add_message(self.request, messages.SUCCESS, "Ticket has been deleted.")
        return reverse(
            "dashboard_organizer:event_tickets",
            args=(self.kwargs["team_slug"], self.kwargs["event_pk"]),
        )


class PaymentDetailView(TeamContextMixin, TemplateView):
    """
    Connect and manage Stripe account.
    """

    template_name = "dashboard_organizer/payment_details.html"

    def post(self, *args, **kwargs):
        """
        Override POST view to handle Stripe flow
        """

        context = self.get_context_data(**kwargs)
        current_team = context["current_team"]
        stripe.api_key = settings.STRIPE_API_KEY

        # Stripe account already connected
        if current_team.stripe_account_id:
            return redirect(
                "dashboard_organizer:payment_detail",
                self.kwargs["team_slug"],
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
                    self.kwargs["team_slug"],
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
                self.kwargs["team_slug"],
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
            "dashboard_organizer:payment_detail", args=(self.kwargs["team_slug"],)
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
        if current_team.stripe_account_id:
            return reverse(
                "dashboard_organizer:payment_detail",
                args=(self.kwargs["team_slug"],),
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
                args=(self.kwargs["team_slug"],),
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
            "dashboard_organizer:payment_detail", args=(self.kwargs["team_slug"],)
        )


class EventScanner(DetailView):
    model = Event
    slug_field = "scanner_id"
    slug_url_kwarg = "scanner_id"
    template_name = "scanner/scanner.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(dict(current_team=self.object.team))
        return context


class EventScannerStats(DetailView):
    model = Event
    slug_field = "scanner_id"
    slug_url_kwarg = "scanner_id"
    template_name = "scanner/scanner_stats.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(dict(current_team=self.object.team))
        return context


class EventScanner2(DetailView):
    model = Event
    slug_field = "scanner_id"
    slug_url_kwarg = "scanner_id"
    template_name = "scanner/scanner2.html"

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
            return render(self.request, template_name="scanner/scanner_error.html")
        try:
            embed_code = uuid.UUID(str(embed_code))
        except ValueError:
            return render(self.request, template_name="scanner/scanner_error.html")

        # Retrieve ticket
        try:
            ticket = Ticket.objects.get(embed_code=embed_code, event=self.object)
        except Ticket.DoesNotExist:
            return render(self.request, template_name="scanner/scanner_error.html")

        # Redeem ticket
        try:
            ticket.redeem_ticket(self.object.scanner_id)
        except exceptions.ForbiddenRedemptionError:
            context["message"] = "Not an authorized scanner!"
            return render(
                self.request,
                template_name="scanner/scanner_error.html",
                context=context,
            )
        except exceptions.AlreadyRedeemedError:
            context["ticket"] = ticket
            context["message"] = "Ticket already scanned!"
            return render(
                self.request,
                template_name="scanner/scanner_warning.html",
                context=context,
            )

        # OK
        context["ticket"] = ticket
        return render(
            self.request,
            template_name="scanner/scanner_success.html",
            context=context,
        )


class EventScannerManualCheckIn(DetailView):
    model = Event
    slug_field = "scanner_id"
    slug_url_kwarg = "scanner_id"
    template_name = "scanner/scanner_manual_check_in.html"

    def get_context_data(self, **kwargs):
        self.object = self.get_object()
        context = super().get_context_data(**kwargs)
        context.update(dict(current_team=self.object.team))

        # Empty state
        if not self.request.GET.get("search"):
            context["tickets"] = Ticket.objects.none()
            return context

        # Search for tickets
        context["tickets"] = (
            self.object.ticket_set.select_related("checkout_session")
            .filter(
                Q(checkout_session__name__icontains=self.request.GET.get("search"))
                | Q(checkout_session__email__icontains=self.request.GET.get("search"))
            )
            .order_by("-redeemed_at")
        )

        return context


class EventScannerManualTicketPost(DetailView):
    model = Event
    slug_field = "scanner_id"
    slug_url_kwarg = "scanner_id"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(dict(current_team=self.object.team))
        return context

    def post(self, *args, **kwargs):
        self.object = self.get_object()
        context = super().get_context_data(**kwargs)
        context["ticket"] = Ticket.objects.get(
            event=self.object,
            pk=self.kwargs["ticket_pk"],
        )
        context["ticket"].redeem_ticket(self.kwargs["scanner_id"])
        return render(
            self.request,
            template_name="scanner/manual_ticket_post.html",
            context=context,
        )


class RSVPTicketsView(TeamContextMixin, TemplateView):
    """
    Show the RSVP tickets (and CTAs) for an event.
    """

    template_name = "dashboard_organizer/rsvp_tickets.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Make sure team has correct permission
        if not context["current_team"].allow_rsvp:
            raise Http404

        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__slug=self.kwargs["team_slug"]
        )
        context["rsvp_batches"] = (
            RSVPBatch.objects.prefetch_related("checkoutsession_set")
            .filter(event=context["event"])
            .order_by("-created")
        )
        return context


class RSVPCreateTicketsView(TeamContextMixin, FormView):
    """
    Bulk create tickets using the RSVP system.
    """

    template_name = "dashboard_organizer/rsvp_create_tickets.html"
    form_class = RSVPCreateTicketsForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Make sure team has correct permission
        if not context["current_team"].allow_rsvp:
            raise Http404

        context["event"] = Event.objects.prefetch_related("tickettier_set").get(
            pk=self.kwargs["event_pk"], team__slug=self.kwargs["team_slug"]
        )
        context["ticket_tiers"] = context["event"].tickettier_set.all()
        return context

    def get_form(self, form_class=None):
        form = super().get_form()
        form.fields["ticket_tier"].queryset = TicketTier.objects.filter(
            event__pk=self.kwargs["event_pk"]
        )
        return form

    def form_valid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)

        # Validate all emails
        emails = form.cleaned_data["customer_emails"].split(",")
        for index, email in enumerate(emails):
            try:
                emails[index] = email.strip()
                validate_email(emails[index])
            except Exception as e:
                print(e)
                messages.add_message(
                    self.request,
                    messages.ERROR,
                    "Please make sure each email address is valid.",
                )
                return super().form_invalid(form)

        # Deliver RSVPs via background task
        rsvp_batch = RSVPBatch.objects.create(
            event=context["event"], ticket_tier=form.cleaned_data["ticket_tier"]
        )
        task_handle_rsvp_delivery.defer(
            rsvp_batch_pk=rsvp_batch.pk,
            emails=emails,
            guests_allowed=form.cleaned_data["guests_allowed"],
        )

        return super().form_valid(form)

    def get_success_url(self):
        messages.add_message(
            self.request,
            messages.SUCCESS,
            "RSVP tickets created successfully. This page may take a few moments to update.",
        )
        return reverse(
            "dashboard_organizer:rsvp_tickets",
            args=(
                self.kwargs["team_slug"],
                self.kwargs["event_pk"],
            ),
        )


class MessageBatchesView(TeamContextMixin, TemplateView):
    """
    Show the message batches (and CTAs) for an event.
    """

    template_name = "dashboard_organizer/message_batches.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Make sure team has correct permission
        if not context["current_team"].allow_messaging:
            raise Http404

        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__slug=self.kwargs["team_slug"]
        )
        context["message_batches"] = (
            MessageBatch.objects.select_related("ticket_tier")
            .filter(event=context["event"])
            .order_by("-created")
        )
        return context


class MessageBatchCreateView(TeamContextMixin, CreateView):
    """
    Create a message batch object
    """

    model = MessageBatch
    form_class = MessageBatchForm
    template_name = "dashboard_organizer/message_batch_create.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Make sure team has correct permission
        if not context["current_team"].allow_messaging:
            raise Http404

        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"], team__slug=self.kwargs["team_slug"]
        )
        return context

    def get_form(self, form_class=None):
        form = super().get_form()
        form.fields["ticket_tier"].queryset = TicketTier.objects.filter(
            event__pk=self.kwargs["event_pk"]
        )
        return form

    def form_valid(self, form, **kwargs):
        # Set event to context
        context = self.get_context_data(**kwargs)
        form.instance.event = context["event"]
        response = super().form_valid(form)

        # Deliver message via background task
        task_handle_message_batch_delivery.defer(message_batch_pk=form.instance.pk)
        return response

    def get_success_url(self):
        messages.add_message(
            self.request,
            messages.SUCCESS,
            "Messages sent successfully. This page may take a few moments to update.",
        )
        return reverse(
            "dashboard_organizer:message_batches",
            args=(
                self.kwargs["team_slug"],
                self.kwargs["event_pk"],
            ),
        )


class WaitlistView(TeamContextMixin, ListView):
    """
    Show the checkout sessions in the waiting queue, and allow organizers to
    bump them up to the attendee list (and issue tickets) as needed.
    """

    model = CheckoutSession
    paginate_by = 15
    ordering = ["-created"]
    context_object_name = "waitlist"
    template_name = "dashboard_organizer/waitlist.html"

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.prefetch_related("checkoutitem_set")

        if self.request.GET.get("search"):
            qs = qs.filter(
                Q(name__icontains=self.request.GET.get("search"))
                | Q(email__icontains=self.request.GET.get("search")),
                ~Q(waitlist_status=""),
                event__pk=self.kwargs["event_pk"],
                event__team__slug=self.kwargs["team_slug"],
            )
        else:
            qs = qs.filter(
                ~Q(waitlist_status=""),
                event__pk=self.kwargs["event_pk"],
                event__team__slug=self.kwargs["team_slug"],
            )

        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["event"] = Event.objects.get(
            pk=self.kwargs["event_pk"],
            team__slug=self.kwargs["team_slug"],
        )
        return context


class WaitlistPostView(TeamContextMixin, DetailView):
    model = CheckoutSession
    object = None

    def get_object(self):
        if not self.object:
            self.object = CheckoutSession.objects.select_related(
                "event",
                "event__team",
            ).get(
                ~Q(waitlist_status=""),
                event__pk=self.kwargs["event_pk"],
                event__team__slug=self.kwargs["team_slug"],
                pk=self.kwargs["checkout_session_pk"],
            )
        return self.object

    def post(self, *args, **kwargs):
        self.object = self.get_object()
        context = super().get_context_data(**kwargs)

        # Accept non-fiat sessions
        # Session already processed, so simply fulfill
        if self.object.session_type != CheckoutSession.SessionType.FIAT:
            self.object.fulfill_session()

        # Accept Fiat sessions
        # Session not processed, so send payment link for them to complete
        if self.object.session_type == CheckoutSession.SessionType.FIAT:
            domain = Site.objects.all().first().domain
            domain = f"http://{domain}"  # http works in local, converted to https on prod
            url = reverse(
                "checkout:checkout_fiat",
                args=[
                    self.object.event.team.slug,
                    self.object.event.slug,
                    self.object.public_id,
                ],
            )
            ctx = {
                "event": self.object.event,
                "payment_link": domain + url,
            }
            msg_subject = str(
                "[SocialPass] Complete payment to get tickets - " + self.object.event.title
            )
            msg_plain = render_to_string(
                "dashboard_organizer/email/wq_complete_payment_message.txt", ctx
            )
            msg_html = render_to_string(
                "dashboard_organizer/email/wq_complete_payment.html", ctx
            )
            send_mail(
                msg_subject,
                msg_plain,
                "tickets-no-reply@socialpass.io",
                [
                    self.object.email,
                ],
                html_message=msg_html,
            )

        # OK. Update waitlist status as approved and return
        self.object.waitlist_status = self.object.WaitlistStatus.WAITLIST_APPROVED
        self.object.save()
        return render(
            self.request,
            template_name="dashboard_organizer/waitlist_post.html",
            context=context,
        )
