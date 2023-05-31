from io import BytesIO
import base64
import json
import qrcode
import rollbar

from django.contrib import messages
from django.db import transaction
from django.http import Http404
from django.shortcuts import render, redirect
from django.utils import timezone
from django.views.generic import View
from django.views.generic.detail import DetailView

from apps.root.models import CheckoutSession, CheckoutItem, Event, Ticket
from apps.root.exceptions import TxAssetOwnershipProcessingError, TxFreeProcessingError

from .forms import (
    PasscodeForm,
    CheckoutForm,
    CheckoutFormFree,
    CheckoutFormAssetOwnership,
)


class CheckoutPageOne(DetailView):
    """
    Checkout page one (start of flow)

    GET
    Show ticket tiers and selection system
    Form to enter name and email

    POST
    Create checkout session + items
    """

    model = Event
    template_name = "checkout/checkout_page_one.html"

    def get_object(self):
        self.object = Event.objects.prefetch_related("tickettier_set").get(
            id=self.kwargs["event_id"], state=Event.StateStatus.LIVE
        )
        if not self.object:
            raise Http404()
        return self.object

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)

        # Get all ticket tiers and set up holder lists and availabilities
        tiers_all = self.object.tickettier_set.all()
        (
            tiers_active,
            tiers_free,
            tiers_fiat,
            tiers_blockchain,
            tiers_asset_ownership,
        ) = ([] for i in range(5))
        availability = {
            "FREE": False,
            "FIAT": False,
            "BLOCKCHAIN": False,
            "ASSET_OWNERSHIP": False,
        }

        # Populate holder lists with correct tiers and update availability
        for tier in tiers_all:
            if tier.tier_free:
                tiers_free.append(tier)
                if tier.availability > 0:
                    availability["FREE"] = True
            if tier.tier_fiat:
                tiers_fiat.append(tier)
                if tier.availability > 0:
                    availability["FIAT"] = True
            if tier.tier_blockchain:
                tiers_blockchain.append(tier)
                if tier.availability > 0:
                    availability["BLOCKCHAIN"] = True
            if tier.tier_asset_ownership:
                tiers_asset_ownership.append(tier)
                if tier.availability > 0:
                    availability["ASSET_OWNERSHIP"] = True

        # Determine how many types of tiers are available
        tier_types_count = 0
        if len(tiers_free) > 0:
            tier_types_count += 1
        if len(tiers_fiat) > 0:
            tier_types_count += 1
        if len(tiers_blockchain) > 0:
            tier_types_count += 1
        if len(tiers_asset_ownership) > 0:
            tier_types_count += 1

        # If checkout type not given (default),
        # we prioritize NFTs < Crypto < Fiat < Free
        checkout_type = self.kwargs.get("checkout_type", "")
        if not checkout_type:
            if availability["ASSET_OWNERSHIP"]:
                checkout_type = "ASSET_OWNERSHIP"
            if availability["BLOCKCHAIN"]:
                checkout_type = "BLOCKCHAIN"
            if availability["FIAT"]:
                checkout_type = "FIAT"
            if availability["FREE"]:
                checkout_type = "FREE"

        # If checkout type is still empty (no tier available), we set using length
        if not checkout_type:
            if len(tiers_asset_ownership) > 0:
                checkout_type = "ASSET_OWNERSHIP"
            if len(tiers_blockchain) > 0:
                checkout_type = "BLOCKCHAIN"
            if len(tiers_fiat) > 0:
                checkout_type = "FIAT"
            if len(tiers_free) > 0:
                checkout_type = "FREE"

        # Set tiers active
        if checkout_type == "FREE":
            tiers_active = tiers_free
        elif checkout_type == "FIAT":
            tiers_active = tiers_fiat
        elif checkout_type == "BLOCKCHAIN":
            tiers_active = tiers_blockchain
        elif checkout_type == "ASSET_OWNERSHIP":
            tiers_active = tiers_asset_ownership

        # Set everything to context
        context["form"] = CheckoutForm(
            initial={
                "checkout_type": checkout_type,
                "name": self.request.GET.get("name", ""),
                "email": self.request.GET.get("email", ""),
            }
        )
        context["tiers_active"] = tiers_active
        context["tiers_free"] = tiers_free
        context["tiers_fiat"] = tiers_fiat
        context["tiers_blockchain"] = tiers_blockchain
        context["tiers_asset_ownership"] = tiers_asset_ownership
        context["tier_types_count"] = tier_types_count
        context["availability"] = availability
        context["checkout_type"] = checkout_type
        return context

    @transaction.atomic
    def post(self, *args, **kwargs):
        form = CheckoutForm(self.request.POST)

        # Something went wrong, so we show error message
        if not form.is_valid():
            messages.add_message(
                self.request,
                messages.ERROR,
                "Something went wrong. Please try again.",
            )
            return redirect(
                "checkout:checkout_one",
                self.kwargs["event_id"],
                self.kwargs["event_slug"],
            )

        # Form is valid, continue...
        # Create checkout session & related transaction
        checkout_session = CheckoutSession.objects.create(
            event=self.get_object(),
            tx_type=form.cleaned_data["checkout_type"],
            name=form.cleaned_data["name"],
            email=form.cleaned_data["email"],
        )
        checkout_session.create_transaction()

        # Create checkout items
        ticket_tier_data = json.loads(form.cleaned_data["ticket_tier_data"])
        for item in ticket_tier_data:
            CheckoutItem.objects.create(
                ticket_tier_id=int(item["id"]),
                checkout_session=checkout_session,
                quantity=int(item["amount"]),
                extra_party=int(item["extra_party"]),
            )

        # OK
        # Redirect on success
        return redirect(
            "checkout:checkout_two",
            checkout_session.public_id,
        )


class CheckoutPageTwo(DetailView):
    """
    GET
    Fetch Checkout Session
    Fetch Checkout Items

    POST
    Process Checkout Session (and related TX, etc.)
    """

    model = CheckoutSession
    slug_field = "public_id"
    slug_url_kwarg = "checkout_session_public_id"
    template_name = "checkout/checkout_page_two.html"

    def get_object(self):
        self.object = CheckoutSession.objects.prefetch_related("checkoutitem_set").get(
            public_id=self.kwargs["checkout_session_public_id"]
        )
        if not self.object:
            raise Http404
        return super().get_object()

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context["checkout_items"] = self.object.checkoutitem_set.all()
        if self.object.tx_type == CheckoutSession.TransactionType.FREE:
            context["form"] = CheckoutFormFree(
                initial={"name": self.object.name, "email": self.object.email}
            )
        elif self.object.tx_type == CheckoutSession.TransactionType.ASSET_OWNERSHIP:
            context["form"] = CheckoutFormAssetOwnership(
                initial={"name": self.object.name, "email": self.object.email}
            )
        return context

    @transaction.atomic
    def post(self, *args, **kwargs):
        self.get_object()
        if self.object.tx_type == CheckoutSession.TransactionType.FREE:
            form = CheckoutFormFree(self.request.POST)
        elif self.object.tx_type == CheckoutSession.TransactionType.ASSET_OWNERSHIP:
            form = CheckoutFormAssetOwnership(self.request.POST)

        # Something went wrong, so we show error message
        if not form.is_valid():
            messages.add_message(
                self.request,
                messages.ERROR,
                "Something went wrong. Please try again.",
            )
            return redirect(
                "checkout:checkout_two",
                self.kwargs["checkout_session_public_id"],
            )

        # Form is valid, continue...
        # Finalize / process transaction and handle exceptions
        try:
            self.object.finalize_transaction(form_data=form)
            self.object.process_transaction()
        except (TxAssetOwnershipProcessingError, TxFreeProcessingError) as e:
            for key, value in e.message_dict.items():
                for message in value:
                    messages.add_message(
                        self.request,
                        messages.ERROR,
                        str(message),
                    )
            return redirect(
                "checkout:checkout_two",
                self.kwargs["checkout_session_public_id"],
            )
        except Exception as e:
            rollbar.report_exc_info()
            messages.add_message(
                self.request,
                messages.ERROR,
                str(e),
            )
            return redirect(
                "checkout:checkout_two",
                self.kwargs["checkout_session_public_id"],
            )

        # OK
        # Redirect on success
        return redirect(
            "checkout:checkout_success",
            self.object.public_id,
        )


class CheckoutPageSuccess(DetailView):
    model = CheckoutSession
    slug_field = "public_id"
    slug_url_kwarg = "checkout_session_public_id"
    template_name = "checkout/checkout_page_success.html"

    def get_object(self):
        self.object = CheckoutSession.objects.prefetch_related("checkoutitem_set").get(
            public_id=self.kwargs["checkout_session_public_id"],
        )
        if not self.object:
            raise Http404
        return super().get_object()

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context["checkout_items"] = self.object.checkoutitem_set.all()
        return context


class GetTickets(View):
    """
    Get tickets for a checkout session
    """

    def get_object(self):
        try:
            return CheckoutSession.objects.select_related("event").get(
                public_id=self.kwargs["checkout_session_public_id"],
            )
        except Exception:
            raise Http404()

    def get(self, *args, **kwargs):
        """
        override get view to handle passcode
        """
        checkout_session = self.get_object()
        passcode_form = PasscodeForm()

        return render(
            self.request,
            "checkout/get_tickets_passcode.html",
            {
                "current_team": checkout_session.event.team,
                "checkout_session": checkout_session,
                "passcode_form": passcode_form,
            },
        )

    def post(self, *args, **kwargs):
        """
        override post view to handle passcode form
        """
        checkout_session = self.get_object()
        passcode_form = PasscodeForm()
        template_name = "get_tickets_passcode.html"
        ctx = {
            "current_team": checkout_session.event.team,
            "checkout_session": checkout_session,
            "passcode_form": passcode_form,
        }

        # handle the passcode submission
        if "passcode_submit" in self.request.POST:
            passcode_form = PasscodeForm(self.request.POST)
            ctx["passcode_form"] = passcode_form
            if passcode_form.is_valid():
                actual_passcode = checkout_session.passcode.lower()
                entered_passcode = passcode_form.cleaned_data["passcode"].lower()
                if (
                    actual_passcode != entered_passcode
                    or checkout_session.passcode_expiration < timezone.now()
                ):
                    # validation was unsuccessful, so we show error message
                    messages.add_message(
                        self.request,
                        messages.ERROR,
                        "Sorry, but the passcode is invalid, or has expired! \
                        Please try again or generate another one.",
                    )
                else:
                    # validation was successful, so we send over the tickets
                    # and change the template
                    template_name = "get_tickets.html"
                    tickets = Ticket.objects.select_related("ticket_tier").filter(
                        checkout_session=checkout_session
                    )
                    ctx["tickets"] = []
                    for ticket in tickets:
                        # QR code
                        img = qrcode.make(ticket.embed_code)
                        stream = BytesIO()
                        img.save(stream, format="PNG")

                        # Google ticket
                        google_ticket = {
                            "exists": False,
                            "save_url": "",
                        }
                        google_ticket_url = ticket.get_google_ticket_url()
                        if google_ticket_url:
                            google_ticket["exists"] = True
                            google_ticket["save_url"] = google_ticket_url

                        # Apple ticket
                        apple_ticket = {
                            "exists": False,
                            "bytes": "",
                        }
                        apple_ticket_bytes = ticket.get_apple_ticket_bytes()
                        if apple_ticket_bytes:
                            apple_ticket["exists"] = True
                            apple_ticket["bytes"] = base64.b64encode(
                                apple_ticket_bytes
                            ).decode("ascii")

                        # Add ticket to context
                        ctx["tickets"].append(
                            {
                                "object": ticket,
                                "qrcode": "data:image/png;base64,"
                                + base64.b64encode(stream.getvalue()).decode("utf-8"),
                                "google_ticket": google_ticket,
                                "apple_ticket": apple_ticket,
                            }
                        )

        # refresh passcode and send email
        elif "resend_passcode" in self.request.POST:
            checkout_session.refresh_passcode()
            checkout_session.send_confirmation_email()
            messages.add_message(
                self.request,
                messages.SUCCESS,
                "Passcode sent to your email address. Please note, this \
                passcode will be valid for only 10 minutes.",
            )

        return render(self.request, f"checkout/{template_name}", ctx)
