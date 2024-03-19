from io import BytesIO
from zoneinfo import ZoneInfo
import base64
import datetime
import json
import jwt
import qrcode
import rollbar
import stripe
import time

from django.conf import settings
from django.contrib import messages
from django.db import transaction
from django.db.models import Prefetch
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
from apps.root.exceptions import (
    AssetOwnershipCheckoutError,
    FreeCheckoutError
)
from apps.checkout.forms import (
    PasscodeForm,
    CheckoutForm,
    CheckoutFormFree,
    CheckoutFormAssetOwnership,
    CheckoutFormFiat,
)
from apps.checkout.old_events_slug_to_pk import OLD_EVENTS_SLUG_TO_PK


class CheckoutPageOneRedirect(RedirectView):
    """
    Redirect to checkout page one. Used for preserving old URLs.
    """

    def get_redirect_url(self, *args, **kwargs):
        try:
            # Handle existing events on production as of 7th Nov, 2023
            if (
                self.kwargs.get("event_slug") and
                self.kwargs.get("event_slug") in OLD_EVENTS_SLUG_TO_PK
            ):
                event = (
                    Event.objects.select_related("team")
                    .prefetch_related("tickettier_set")
                    .get(
                        pk=OLD_EVENTS_SLUG_TO_PK[self.kwargs.get("event_slug")]
                    )
                )
            # Handle Migrated Checkout (react app)
            # Page rule from cloudflare tickets.socialpass.io/<UUID> to here
            elif self.kwargs.get("event_uuid_slug"):
                event = (
                    Event.objects.select_related("team")
                    .prefetch_related("tickettier_set")
                    .get(public_id=self.kwargs["event_uuid_slug"])
                )
            # Handle Migrated Checkout (redirect to react app)
            # Limit id to <1000 to only catch early events launched on the react app
            elif self.kwargs.get("event_pk_slug") and self.kwargs["event_pk_slug"] < 1000:
                event = (
                    Event.objects.select_related("team")
                    .prefetch_related("tickettier_set")
                    .get(pk=self.kwargs["event_pk_slug"])
                )
        except Event.DoesNotExist:
            raise Http404()
        except Exception:
            rollbar.report_exc_info()
            raise Http404()

        return reverse(
            "checkout:checkout_one",
            args=(
                event.team.slug,
                event.slug,
            ),
        )


class CheckoutPageOne(DetailView):
    """
    Checkout page one (start of flow)

    GET
    Show ticket tiers and selection system
    Form to enter name and email

    POST
    Create checkout session + items
    Handle redirect based on checkout session type
    """

    model = Event
    template_name = "checkout/checkout_page_one.html"

    def get_object(self):
        self.object = Event.objects.select_related("team").prefetch_related(
            "tickettier_set"
        ).get(
            team__slug=self.kwargs["team_slug"],
            slug=self.kwargs["event_slug"]
        )
        if not self.object:
            raise Http404
        return self.object

    def get_context_data(self, *args, **kwargs):
        # Check if team member
        is_team_member = self.request.user.is_authenticated and Membership.objects.filter(
            team__public_id=self.object.team.public_id, user=self.request.user
        ).exists()
        is_team_member = is_team_member and not self.request.GET.get("view_as_attendee")

        # Handle Ticket Sales Start / Sales End
        # Determine the sales status of an event based on its sales start and end times.
        now = datetime.datetime.now(ZoneInfo(self.object.timezone) if self.object.timezone else ZoneInfo("UTC"))
        sales_start = self.object.sales_start.replace(tzinfo=now.tzinfo) if self.object.sales_start else datetime.datetime(1900, 1, 1, tzinfo=now.tzinfo)
        sales_end = self.object.sales_end.replace(tzinfo=now.tzinfo) if self.object.sales_end else datetime.datetime(3000, 1, 1, tzinfo=now.tzinfo)
        if now < sales_start:
            sales_status = "UPCOMING"
        elif now > sales_end:
            sales_status = "OVER"
        else:
            sales_status = None

        # Handle checkout type
        # If checkout type not given, we prioritize Fiat < NFTs < Crypto < Free
        checkout_type = self.kwargs.get("checkout_type", "")
        if not checkout_type:
            if self.object.ticket_tier_counts["fiat_count"] > 0:
                checkout_type = "FIAT"
            elif self.object.ticket_tier_counts["asset_ownership_count"] > 0:
                checkout_type = "ASSET_OWNERSHIP"
            elif self.object.ticket_tier_counts["blockchain_count"] > 0:
                checkout_type = "BLOCKCHAIN"
            elif self.object.ticket_tier_counts["free_count"] > 0:
                checkout_type = "FREE"
            else:
                checkout_type = None

        # OK, set everything to context
        context = super().get_context_data(*args, **kwargs)
        context["checkout_type"] = checkout_type
        context["organizer_team"] = self.object.team
        context["is_team_member"] = is_team_member
        context["sales_start_with_tzinfo"] = sales_start
        context["sales_status"] = sales_status
        context["form"] = CheckoutForm(
            initial={
                "checkout_type": checkout_type,
                "name": self.request.GET.get("name", ""),
                "email": self.request.GET.get("email", ""),
            }
        )
        return context

    @transaction.atomic
    def post(self, *args, **kwargs):
        # Validate form
        self.get_object()
        form = CheckoutForm(
            self.request.POST,
            event=self.object,
            tiers_all=self.object.tickettier_set.all(),
        )
        if not form.is_valid():
            rollbar.report_message("CHECKOUT ERROR: " + str(form.errors.as_json()))
            for k, v in json.loads(form.errors.as_json()).items():
                for error in v:
                    messages.add_message(
                        self.request,
                        messages.ERROR,
                        error["message"]
                    )
            return redirect(
                "checkout:checkout_one",
                self.kwargs["team_slug"],
                self.kwargs["event_slug"],
            )

        # Form is valid, continue...
        # Create session, checkout items, and transaction

        # Create checkout session
        checkout_session = CheckoutSession.objects.create(
            event=self.object,
            session_type=form.cleaned_data["checkout_type"],
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

        # Handle redirect cases
        # Handle case where checkout is FIAT and is waiting queue checkout
        if (
            checkout_session.session_type == CheckoutSession.SessionType.FIAT
            and self.object.waiting_queue_enabled
        ):
            checkout_session.waitlist_status = CheckoutSession.WaitlistStatus.WAITLIST_JOINED
            checkout_session.save()
            return redirect(
                "checkout:joined_waiting_queue",
                checkout_session.public_id,
            )
        # Handle case where checkout is FIAT and is standard checkout
        elif (
            checkout_session.session_type == CheckoutSession.SessionType.FIAT
            and not self.object.waiting_queue_enabled
        ):
            return redirect(
                "checkout:checkout_fiat",
                self.object.team.slug,
                self.object.slug,
                checkout_session.public_id,
            )
        # Handle standard checkout (NFT, FREE)
        else:
            return redirect(
                "checkout:checkout_two",
                self.object.team.slug,
                self.object.slug,
                checkout_session.public_id,
            )


class CheckoutPageTwoBase(DetailView):
    """
    Base class for handling FREE, NFT, and FIAT checkout sessions.
    """

    model = CheckoutSession
    slug_field = "public_id"
    slug_url_kwarg = "checkout_session_public_id"

    def get_template_names(self):
        raise NotImplementedError

    def get_form_class(self):
        raise NotImplementedError

    def get_object(self):
        self.object = (
            CheckoutSession.objects.select_related(
                "event",
                "event__team",
                "event__team__whitelabel",
            )
            .prefetch_related(
                Prefetch(
                    "checkoutitem_set",
                    queryset=CheckoutItem.objects.select_related("ticket_tier")
                )
            )
            .get(public_id=self.kwargs["checkout_session_public_id"])
        )
        if not self.object:
            raise Http404
        return self.object

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context["form"] = self.get_form_class()(
            initial={"name": self.object.name, "email": self.object.email}
        )
        context["organizer_team"] = self.object.event.team
        return context

    def validate_post(self):
        # Get object
        # Also validate transaction status to avoid resubmission
        self.get_object()
        if self.object.order_status in [
            CheckoutSession.OrderStatus.PROCESSING,
            CheckoutSession.OrderStatus.COMPLETED,
            CheckoutSession.OrderStatus.FULFILLED
        ]:
            return {
                "is_error": True,
                "error_message": str(
                    f"Your checkout is already processing. Please check for confirmation at {self.object.email}."
                ),
                "form": None,
            }

        # Validate form
        form = self.get_form_class()(self.request.POST)
        if not form.is_valid():
            return {
                "is_error": True,
                "error_message": "Something went wrong. Please try again.",
                "form": form,
            }

        # Form is valid, continue...
        # Handle both cases: waitlist checkout or standard checkout

        # Waitlist checkout
        # If waiting queue is enabled, we ignore everything and return the form
        if self.object.event.waiting_queue_enabled:
            return {
                "is_error": False,
                "error_message": "",
                "form": form,
            }

        # Standard checkout
        # Make sure event venue capacity is not exceeded
        checkout_items = self.object.checkoutitem_set.all()
        if self.object.event.total_capacity:
            new_attendees_count = self.object.event.attendees_count
            for item in checkout_items:
                new_attendees_count += item.quantity + (item.quantity * item.extra_party)
            if new_attendees_count > self.object.event.total_capacity:
                return {
                    "is_error": True,
                    "error_message": str(
                        "Your order exceeds the total venue capacity for the "
                        "event. Please try changing your order, or contact the "
                        "organizer if you think something is wrong."
                    ),
                    "form": form,
                }
        # Verify each checkout item in the checkout session
        for item in checkout_items:
            # Make sure none of the item's guests exceed the tier's supply
            new_guests_count = item.ticket_tier.guests_count + item.extra_party
            if item.ticket_tier.guest_supply and new_guests_count > item.ticket_tier.guest_supply:
                return {
                    "is_error": True,
                    "error_message": str(
                        "For one or more tiers, the number of guests exceeds the "
                        "allotted guest supply. Please try again."
                    ),
                    "form": form,
                }
            # Make sure there is no ticket overflow
            if item.quantity > item.ticket_tier.tickets_available:
                return {
                    "is_error": True,
                    "error_message": str(
                        "We're sorry, not enough ticket(s) are available. Perhaps they "
                        "sold out as you were completing the checkout process."
                    ),
                    "form": form,
                }

        # OK
        return {
            "is_error": False,
            "error_message": "",
            "form": form,
        }


class CheckoutPageTwo(CheckoutPageTwoBase):
    """
    Handle FREE and NFT checkout sessions.
    """

    def get_template_names(self):
        return ["checkout/checkout_page_two.html",]

    def get_form_class(self):
        if self.object.session_type == CheckoutSession.SessionType.FREE:
            return CheckoutFormFree
        if self.object.session_type == CheckoutSession.SessionType.ASSET_OWNERSHIP:
            return CheckoutFormAssetOwnership

    @transaction.atomic
    def post(self, *args, **kwargs):
        # Validate POST request, redirect if needed
        validate_post = self.validate_post()
        if validate_post["is_error"]:
            messages.add_message(
                self.request,
                messages.ERROR,
                validate_post["error_message"]
            )
            return redirect(
                reverse(
                    "checkout:checkout_one",
                    args=(
                        self.kwargs["team_slug"],
                        self.kwargs["event_slug"],
                    ),
                ) + f"?name={self.object.name}&email={self.object.email}"
            )

        # Finalize transaction using form data
        form_data = validate_post["form"]
        if self.object.session_type == CheckoutSession.SessionType.ASSET_OWNERSHIP:
            self.object.wallet_address = form_data.cleaned_data["wallet_address"]
            self.object.signed_message = form_data.cleaned_data["signed_message"]
            self.object.delegated_wallet = form_data.cleaned_data["delegated_wallet"]
            self.object.save()

        # If waiting queue is enabled, we ignore everything
        # And redirect to the waiting queue success page
        if self.object.event.waiting_queue_enabled:
            self.object.waitlist_status = CheckoutSession.WaitlistStatus.WAITLIST_JOINED
            self.object.save()
            return redirect(
                "checkout:joined_waiting_queue",
                self.kwargs["checkout_session_public_id"],
            )

        # Process transaction and handle exceptions
        try:
            self.object.process_session()
            self.object.fulfill_session()
        except (AssetOwnershipCheckoutError, FreeCheckoutError) as e:
            messages.add_message(
                self.request,
                messages.ERROR,
                e
            )
            return redirect(
                "checkout:checkout_two",
                self.kwargs["team_slug"],
                self.kwargs["event_slug"],
                self.kwargs["checkout_session_public_id"],
            )
        except Exception:
            rollbar.report_exc_info()
            messages.add_message(
                self.request,
                messages.ERROR,
                "An unexpected error occurred. Please try again later, or contact support if the issue persists.",
            )
            return redirect(
                "checkout:checkout_two",
                self.kwargs["team_slug"],
                self.kwargs["event_slug"],
                self.kwargs["checkout_session_public_id"],
            )

        # OK
        # Redirect on success
        return redirect(
            reverse(
                "checkout:get_tickets",
                args=(self.kwargs["checkout_session_public_id"],),
            ) + f"?passcode={self.object.passcode}&is_checkout_flow=True"
        )


class CheckoutFiat(CheckoutPageTwoBase):
    """
    Handle FIAT checkout sessions.
    """

    def get_template_names(self):
        return ["checkout/checkout_paid.html",]

    def get_form_class(self):
        return CheckoutFormFiat

    @transaction.atomic
    def post(self, *args, **kwargs):
        # Validate POST request, redirect if needed
        validate_post = self.validate_post()
        if validate_post["is_error"]:
            messages.add_message(
                self.request,
                messages.ERROR,
                validate_post["error_message"]
            )
            return redirect(
                reverse(
                    "checkout:checkout_one",
                    args=(
                        self.kwargs["team_slug"],
                        self.kwargs["event_slug"],
                    ),
                ) + f"?name={self.object.name}&email={self.object.email}"
            )

        # Set local variables
        context = self.get_context_data()
        stripe.api_key = settings.STRIPE_API_KEY

        # Create line items using Stripe PRICES API
        stripe_line_items = []
        checkout_items = self.object.checkoutitem_set.all()
        for item in checkout_items:
            try:
                price = stripe.Price.create(
                    unit_amount=item.unit_amount,
                    currency=self.object.event.fiat_currency.lower(),
                    product_data={
                        "name": f"{item.ticket_tier.name} × {item.quantity}",
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
                    self.kwargs["team_slug"],
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
                customer_email=self.object.email,
                mode="payment",
                line_items=stripe_line_items,
                payment_intent_data={
                    "application_fee_amount": self.object.application_fee_amount,
                    "transfer_data": {
                        "destination": self.object.event.team.stripe_account_id
                    },
                },
                success_url=self.object.stripe_checkout_success_link,
                cancel_url=self.object.stripe_checkout_cancel_link,
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
                self.kwargs["team_slug"],
                self.kwargs["event_slug"],
                self.kwargs["checkout_session_public_id"],
            )

        # Store the Stripe data in transaction and save
        self.object.stripe_line_items = stripe_line_items
        self.object.stripe_session_id = session["id"]
        self.object.stripe_session_url = session["url"]
        self.object.save()

        # OK
        # Redirect to Stripe checkout
        return redirect(self.object.stripe_session_url)


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
                self.kwargs["team_slug"],
                self.kwargs["event_slug"],
                self.kwargs["checkout_session_public_id"],
            ),
        )


class StripeCheckoutSuccess(RedirectView):
    """
    Redirect to tickets page
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

        # Verify using Stripe's API (triple verification)
        stripe.api_key = settings.STRIPE_API_KEY
        stripe_session = stripe.checkout.Session.retrieve(
            checkout_session.stripe_session_id
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
                    self.kwargs["team_slug"],
                    self.kwargs["event_slug"],
                    self.kwargs["checkout_session_public_id"],
                ),
            )

        # OK
        # Process transaction
        # Redirect to tickets page
        checkout_session.process_session()
        checkout_session.fulfill_session()
        return reverse(
            "checkout:get_tickets",
            args=(self.kwargs["checkout_session_public_id"],),
        ) + f"?passcode={checkout_session.passcode}&is_checkout_flow=True"


class CheckoutPageSuccess(DetailView):
    model = CheckoutSession
    slug_field = "public_id"
    slug_url_kwarg = "checkout_session_public_id"
    template_name = "checkout/checkout_page_success.html"

    def get_object(self):
        self.object = (
            CheckoutSession.objects.select_related(
                "event",
                "event__team",
                "event__team__whitelabel",
            )
            .prefetch_related("checkoutitem_set")
            .get(
                public_id=self.kwargs["checkout_session_public_id"],
                order_status=CheckoutSession.OrderStatus.FULFILLED,
            )
        )
        if not self.object:
            raise Http404
        return super().get_object()

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context["checkout_items"] = self.object.checkoutitem_set.all()
        context["organizer_team"] = self.object.event.team
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
            "checkout/get_tickets_passcode.html",
            {
                "organizer_team": checkout_session.event.team,
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
            "organizer_team": checkout_session.event.team,
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
                if actual_passcode != entered_passcode:
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
                    ] = checkout_session.checkoutitem_set.select_related("ticket_tier").all()
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
            checkout_session.send_confirmation_email()
            messages.add_message(
                self.request,
                messages.SUCCESS,
                "Passcode sent to your email address. Please note, this \
                passcode will be valid for only 24 hours.",
            )

        return render(self.request, f"checkout/{template_name}", ctx)


class JoinedWaitingQueue(DetailView):
    model = CheckoutSession
    slug_field = "public_id"
    slug_url_kwarg = "checkout_session_public_id"
    template_name = "checkout/joined_waiting_queue.html"

    def get_object(self):
        self.object = (
            CheckoutSession.objects.select_related(
                "event",
                "event__team",
                "event__team__whitelabel",
            )
            .get(
                public_id=self.kwargs["checkout_session_public_id"],
            )
        )
        if not self.object:
            raise Http404
        return super().get_object()

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context["checkout_items"] = self.object.checkoutitem_set.all()
        context["organizer_team"] = self.object.event.team
        return context
