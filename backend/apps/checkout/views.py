from io import BytesIO
import base64
import datetime
import json
import jwt
import pytz
import qrcode
import rollbar
import stripe
import time

from django.conf import settings
from django.contrib import messages
from django.db import transaction
from django.http import Http404
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils import timezone
from django.views.generic import View
from django.views.generic.base import RedirectView
from django.views.generic.detail import DetailView

from apps.root.models import (
    CheckoutSession,
    CheckoutItem,
    Event,
    Ticket,
    Membership,
)
from apps.root.exceptions import TxAssetOwnershipProcessingError, TxFreeProcessingError

from .forms import (
    PasscodeForm,
    CheckoutForm,
    CheckoutFormFree,
    CheckoutFormAssetOwnership,
    CheckoutFormFiat,
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
    template_name = "redesign/checkout/checkout_page_one.html"

    def get_object(self):
        # Handle default checkout
        try:
            if self.kwargs.get("event_slug"):
                self.object = (
                    Event.objects.select_related("team")
                    .prefetch_related(
                        "tickettier_set",
                        "tickettier_set__tier_free",
                        "tickettier_set__tier_asset_ownership",
                    )
                    .get(slug=self.kwargs["event_slug"])
                )
            # Handle Migrated Checkout (react app)
            # Page rule from cloudflare tickets.socialpass.io/<UUID> to here
            if self.kwargs.get("event_uuid_slug"):
                self.object = (
                    Event.objects.select_related("team")
                    .prefetch_related(
                        "tickettier_set",
                        "tickettier_set__tier_free",
                        "tickettier_set__tier_asset_ownership",
                    )
                    .get(public_id=self.kwargs["event_uuid_slug"])
                )
            # Handle Migrated Checkout (redirect to react app)
            # Limit id to <1000 to only catch early events launched on the react app
            if self.kwargs.get("event_pk_slug") and self.kwargs["event_pk_slug"] < 1000:
                self.object = (
                    Event.objects.select_related("team")
                    .prefetch_related(
                        "tickettier_set",
                        "tickettier_set__tier_free",
                        "tickettier_set__tier_asset_ownership",
                    )
                    .get(pk=self.kwargs["event_pk_slug"])
                )
        except Event.DoesNotExist:
            raise Http404()
        except Exception:
            rollbar.report_exc_info()
            raise Http404()

        return self.object

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)

        # Check if user is part of team or not
        is_team_member = False
        try:
            user_membership = Membership.objects.select_related("team").get(
                team__public_id=self.object.team.public_id,
                user__id=self.request.user.id,
            )
        except Exception:
            user_membership = False
        is_team_member = self.request.user.is_authenticated and user_membership

        # If user is NOT team member, we make sure event is live
        if not is_team_member:
            if self.object.state != Event.StateStatus.LIVE:
                raise Http404()

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
            "FIAT": False,
            "ASSET_OWNERSHIP": False,
            "BLOCKCHAIN": False,
            "FREE": False,
        }

        # Populate holder lists with correct tiers and update availability
        for tier in tiers_all:
            # hide hidden tiers from general public
            if tier.hidden and (
                not is_team_member or self.request.GET.get("view_as_attendee")
            ):
                continue

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
        # we prioritize Fiat < NFTs < Crypto < Free
        # see above `availability` dictionary for ordering
        checkout_type = self.kwargs.get("checkout_type", "")
        if not checkout_type:
            for key, value in availability.items():
                if value is True:
                    checkout_type = key
                    break

        # Set tiers active
        if checkout_type == "FREE":
            tiers_active = tiers_free
        elif checkout_type == "FIAT":
            tiers_active = tiers_fiat
        elif checkout_type == "BLOCKCHAIN":
            tiers_active = tiers_blockchain
        elif checkout_type == "ASSET_OWNERSHIP":
            tiers_active = tiers_asset_ownership

        # Handle ticket sales
        sales_status = "OPEN"
        if self.object.timezone:
            now = datetime.datetime.now(pytz.timezone(self.object.timezone))
        else:
            now = datetime.datetime.now(pytz.utc)
        sales_start = datetime.datetime(1900, 1, 1, tzinfo=now.tzinfo)
        sales_end = datetime.datetime(3000, 1, 1, tzinfo=now.tzinfo)

        # Set actual dates if they exist (with timezone)
        # Note: Use now.tzinfo for timezone compatibility
        if self.object.sales_start:
            sales_start = self.object.sales_start.replace(tzinfo=now.tzinfo)
        if self.object.sales_end:
            sales_end = self.object.sales_end.replace(tzinfo=now.tzinfo)

        # Check status
        if now < sales_start:
            sales_status = "UPCOMING"
        # Note: Check if sales are over OR none of the items are available
        elif now > sales_end or True not in availability.values():
            sales_status = "OVER"

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
        context["is_team_member"] = is_team_member
        context["sales_start_with_tzinfo"] = sales_start
        context["sales_status"] = sales_status
        context["current_team"] = self.object.team
        return context

    @transaction.atomic
    def post(self, *args, **kwargs):
        # Setup form
        self.get_object()
        form = CheckoutForm(
            self.request.POST,
            event=self.object,
            tiers_all=self.object.tickettier_set.all(),
        )

        # Something went wrong, so we show error message
        if not form.is_valid():
            rollbar.report_message("CHECKOUT ERROR: " + str(form.errors))
            messages.add_message(
                self.request,
                messages.ERROR,
                "Something went wrong. Please try again.",
            )
            return redirect(
                "checkout:checkout_one",
                self.kwargs["event_slug"],
            )

        # Form is valid, continue...
        # Create checkout session
        checkout_session = CheckoutSession.objects.create(
            event=self.object,
            tx_type=form.cleaned_data["checkout_type"],
            name=form.cleaned_data["name"],
            email=form.cleaned_data["email"],
        )

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
        if checkout_session.tx_type == CheckoutSession.TransactionType.FIAT:
            return redirect(
                "checkout:checkout_fiat",
                self.object.slug,
                checkout_session.public_id,
            )
        else:
            return redirect(
                "checkout:checkout_two",
                self.object.slug,
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
    template_name = "redesign/checkout/checkout_page_two.html"

    def get_object(self):
        self.object = (
            CheckoutSession.objects.select_related(
                "event",
                "event__team",
                "event__team__whitelabel",
            )
            .prefetch_related("checkoutitem_set")
            .get(public_id=self.kwargs["checkout_session_public_id"])
        )
        if not self.object:
            raise Http404
        # Check if expired or not
        expiration = self.object.created + datetime.timedelta(minutes=15)
        if timezone.now() > expiration:
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
        context["current_team"] = self.object.event.team
        return context

    def get(self, *args, **kwargs):
        """
        override get to call create_transaction for each attempt
        """
        response = super().get(*args, **kwargs)
        self.object.create_transaction()
        return response

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
                self.kwargs["event_slug"],
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
                self.kwargs["event_slug"],
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
                self.kwargs["event_slug"],
                self.kwargs["checkout_session_public_id"],
            )

        # OK
        # Redirect on success
        return redirect(
            "checkout:checkout_success",
            self.object.event.slug,
            self.object.public_id,
        )


class CheckoutFiat(DetailView):
    """
    GET
    Fetch Checkout Session
    Fetch Checkout Items

    POST
    Process Fiat Checkout Session
    """

    model = CheckoutSession
    slug_field = "public_id"
    slug_url_kwarg = "checkout_session_public_id"
    template_name = "redesign/checkout/checkout_paid.html"

    def get_object(self):
        self.object = (
            CheckoutSession.objects.select_related(
                "event",
                "event__team",
                "event__team__whitelabel",
                "tx_fiat",
            )
            .prefetch_related(
                "checkoutitem_set",
            )
            .get(public_id=self.kwargs["checkout_session_public_id"])
        )
        if not self.object:
            raise Http404
        # Check if expired or not
        expiration = self.object.created + datetime.timedelta(minutes=15)
        if timezone.now() > expiration:
            raise Http404
        return super().get_object()

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context["checkout_items"] = self.object.checkoutitem_set.select_related(
            "ticket_tier", "ticket_tier__tier_fiat"
        ).all()
        context["form"] = CheckoutFormFiat(
            initial={"name": self.object.name, "email": self.object.email}
        )
        context["current_team"] = self.object.event.team
        return context

    def get(self, *args, **kwargs):
        """
        override get to call create_transaction for each attempt
        """
        response = super().get(*args, **kwargs)
        self.object.create_transaction()
        return response

    def post(self, *args, **kwargs):
        self.get_object()
        context = self.get_context_data()
        checkout_session = self.get_object()
        tx_fiat = checkout_session.tx_fiat
        form = CheckoutFormFiat(self.request.POST)
        stripe.api_key = settings.STRIPE_API_KEY

        # Something went wrong, so we show error message
        if not form.is_valid():
            messages.add_message(
                self.request,
                messages.ERROR,
                "Something went wrong. Please try again.",
            )
            return redirect(
                "checkout:checkout_two",
                self.kwargs["event_slug"],
                self.kwargs["checkout_session_public_id"],
            )

        # Form is valid, continue...

        # Create line items using Stripe PRICES API
        stripe_line_items = []
        for item in context["checkout_items"]:
            try:
                price = stripe.Price.create(
                    unit_amount=item.unit_amount,
                    currency=checkout_session.event.fiat_currency.lower(),
                    product_data={
                        "name": f"{item.ticket_tier.ticket_type} × {item.quantity}",
                    },
                )
            except Exception:
                rollbar.report_exc_info()
                messages.add_message(
                    self.request,
                    messages.ERROR,
                    "Something went wrong. Please try again.",
                )
                return redirect(
                    "checkout:checkout_fiat",
                    self.kwargs["event_slug"],
                    self.kwargs["checkout_session_public_id"],
                )
            stripe_line_items.append(
                {
                    "price": price["id"],
                    "quantity": 1,
                }
            )

        # Create Stripe session using API
        try:
            session = stripe.checkout.Session.create(
                customer_email=checkout_session.email,
                mode="payment",
                line_items=stripe_line_items,
                payment_intent_data={
                    "application_fee_amount": checkout_session.application_fee_amount,
                    "transfer_data": {
                        "destination": checkout_session.event.team.stripe_account_id
                    },
                },
                success_url=checkout_session.stripe_checkout_success_link,
                cancel_url=checkout_session.stripe_checkout_cancel_link,
                expires_at=int(time.time()) + 1800,  # 30 minutes from now
            )
        except Exception:
            rollbar.report_exc_info()
            messages.add_message(
                self.request,
                messages.ERROR,
                "Something went wrong. Please try again.",
            )
            return redirect(
                "checkout:checkout_fiat",
                self.kwargs["event_slug"],
                self.kwargs["checkout_session_public_id"],
            )

        # Store the Stripe data in transaction and save
        tx_fiat.stripe_line_items = stripe_line_items
        tx_fiat.stripe_session_id = session["id"]
        tx_fiat.stripe_session_url = session["url"]
        tx_fiat.save()

        # OK
        # Redirect to Stripe checkout
        return redirect(tx_fiat.stripe_session_url)


class StripeCheckoutCancel(RedirectView):
    """
    Redirect to fiat checkout
    """

    def get_redirect_url(self, *args, **kwargs):
        # Get object
        checkout_session = CheckoutSession.objects.get(
            public_id=self.kwargs["checkout_session_public_id"]
        )
        if not checkout_session:
            raise Http404

        # Make sure the provided token is valid (stateless double verification)
        payload = jwt.decode(
            self.kwargs["token"],
            settings.STRIPE_API_KEY,
            algorithms=["HS256"],
        )
        if not payload["public_id"] == str(checkout_session.public_id):
            raise Http404

        # OK
        # Redirect to fiat checkout
        messages.add_message(
            self.request,
            messages.INFO,
            "Payment was cancelled, you can try again.",
        )
        return reverse(
            "checkout:checkout_fiat",
            args=(
                self.kwargs["event_slug"],
                self.kwargs["checkout_session_public_id"],
            ),
        )


class StripeCheckoutSuccess(RedirectView):
    """
    Redirect to checkout success
    """

    def get_redirect_url(self, *args, **kwargs):
        # Get object
        checkout_session = CheckoutSession.objects.select_related("tx_fiat").get(
            public_id=self.kwargs["checkout_session_public_id"]
        )
        if not checkout_session:
            raise Http404

        # Make sure the provided token is valid (stateless double verification)
        payload = jwt.decode(
            self.kwargs["token"],
            settings.STRIPE_API_KEY,
            algorithms=["HS256"],
        )
        if not payload["public_id"] == str(checkout_session.public_id):
            raise Http404

        # Verify using Stripe's API (triple verification)
        stripe.api_key = settings.STRIPE_API_KEY
        stripe_session = stripe.checkout.Session.retrieve(
            checkout_session.tx_fiat.stripe_session_id
        )
        if not stripe_session["payment_status"] == "paid":
            messages.add_message(
                self.request,
                messages.INFO,
                "Payment has not been completed. Please try again.",
            )
            return reverse(
                "checkout:checkout_fiat",
                args=(
                    self.kwargs["event_slug"],
                    self.kwargs["checkout_session_public_id"],
                ),
            )

        # OK
        # Process transaction
        # Redirect to checkout success
        checkout_session.tx_fiat.process()
        return reverse(
            "checkout:checkout_success",
            args=(
                self.kwargs["event_slug"],
                self.kwargs["checkout_session_public_id"],
            ),
        )


class CheckoutPageSuccess(DetailView):
    model = CheckoutSession
    slug_field = "public_id"
    slug_url_kwarg = "checkout_session_public_id"
    template_name = "redesign/checkout/checkout_page_success.html"

    def get_object(self):
        self.object = CheckoutSession.objects.select_related(
            "event",
            "event__team",
            "event__team__whitelabel",
        ).prefetch_related("checkoutitem_set").get(
            public_id=self.kwargs["checkout_session_public_id"],
            tx_status=CheckoutSession.OrderStatus.FULFILLED,
        )
        if not self.object:
            raise Http404
        return super().get_object()

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context["checkout_items"] = self.object.checkoutitem_set.all()
        context["current_team"] = self.object.event.team
        return context


class GetTickets(View):
    """
    Get tickets for a checkout session
    """

    def get_object(self):
        try:
            return CheckoutSession.objects.select_related(
                "event",
                "event__team",
                "event__team__whitelabel",
            ).get(
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
            "redesign/checkout/get_tickets_passcode.html",
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
                    ctx[
                        "checkout_items"
                    ] = checkout_session.checkoutitem_set.select_related(
                        "ticket_tier", "ticket_tier__tier_fiat"
                    ).all()
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

        return render(self.request, f"redesign/checkout/{template_name}", ctx)
