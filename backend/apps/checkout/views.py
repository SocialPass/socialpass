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
from .old_events_slug_to_pk import OLD_EVENTS_SLUG_TO_PK


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
                    .prefetch_related(
                        "tickettier_set",
                        "tickettier_set__tier_free",
                        "tickettier_set__tier_asset_ownership",
                    )
                    .get(
                        pk=OLD_EVENTS_SLUG_TO_PK[self.kwargs.get("event_slug")]
                    )
                )
            # Handle Migrated Checkout (react app)
            # Page rule from cloudflare tickets.socialpass.io/<UUID> to here
            elif self.kwargs.get("event_uuid_slug"):
                event = (
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
            elif self.kwargs.get("event_pk_slug") and self.kwargs["event_pk_slug"] < 1000:
                event = (
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

        return reverse(
            "checkout:checkout_one",
            args=(
                event.team.slug,
                event.slug,
            ),
        )


class CheckoutPageOne(DetailView):
    """a
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
        # Handle default checkout
        try:
            self.object = (
                Event.objects.select_related("team")
                .prefetch_related(
                    "tickettier_set",
                    "tickettier_set__tier_free",
                    "tickettier_set__tier_asset_ownership",
                )
                .get(
                    team__slug=self.kwargs["team_slug"],
                    slug=self.kwargs["event_slug"]
                )
            )
        except Event.DoesNotExist:
            raise Http404()
        except Exception:
            rollbar.report_exc_info()
            raise Http404()

        return self.object

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)

        # Check if team member
        # If user is NOT team member, we make sure event is live
        is_team_member = self.request.user.is_authenticated and Membership.objects.filter(
            team__public_id=self.object.team.public_id, user=self.request.user
        ).exists()
        is_team_member = is_team_member and not self.request.GET.get("view_as_attendee")
        if not is_team_member:
            if self.object.state != Event.StateStatus.LIVE:
                raise Http404()

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
            sales_status = "OPEN"

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
                checkout_type = "FREE"

        # Set everything to context
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
                form.errors
            )
            return redirect(
                "checkout:checkout_one",
                self.kwargs["team_slug"],
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
                self.object.team.slug,
                self.object.slug,
                checkout_session.public_id,
            )
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
        return super().get_object()

    def get_form_class(self):
        raise NotImplementedError

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context["checkout_items"] = self.object.checkoutitem_set.select_related(
            "ticket_tier", "ticket_tier__tier_fiat", "ticket_tier__tier_free",
            "ticket_tier__tier_asset_ownership",
        ).all()
        context["form"] = self.get_form_class()(
            initial={"name": self.object.name, "email": self.object.email}
        )
        context["organizer_team"] = self.object.event.team
        return context

    def get(self, *args, **kwargs):
        """
        override get to call create_transaction for each attempt
        """
        response = super().get(*args, **kwargs)
        self.object.create_transaction()

        # Check if expired or not
        expiration = self.object.created + datetime.timedelta(minutes=15)
        if timezone.now() > expiration:
            messages.add_message(
                self.request,
                messages.ERROR,
                "Your session has expired. Please try again.",
            )
            return redirect(
                "checkout:checkout_one",
                self.kwargs["team_slug"],
                self.kwargs["event_slug"],
            )

        return response

    def validate_post(self):
        self.get_object()
        form = self.get_form_class()(self.request.POST)

        # Something went wrong, so we show error message
        if not form.is_valid():
            return {
                "is_error": True,
                "error_message": "Something went wrong. Please try again.",
                "form": form,
            }

        # Form is valid, continue...

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

        # Make sure none of the tiers' guests exceed the supply
        for item in checkout_items:
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
        is_waiting_list = self.object.check_is_waiting_list()
        if is_waiting_list:
            self.object.is_waiting_list = True
            self.object.save()
            return {
                "is_error": True,
                "error_message": str(
                    "We're sorry, not enough ticket(s) are available. However, "
                    "you are on a waiting list, so please be on the lookout for "
                    "an email. The organizers may decide to send you ticket(s) "
                    "depending on the availability."
                ),
                "form": form,
            }

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
        if self.object.tx_type == CheckoutSession.TransactionType.FREE:
            return CheckoutFormFree
        else:
            return CheckoutFormAssetOwnership

    @transaction.atomic
    def post(self, *args, **kwargs):
        self.get_object()

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
        form = validate_post["form"]
        context = self.get_context_data()
        checkout_session = self.get_object()

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
        self.get_object()

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
        form = validate_post["form"]
        context = self.get_context_data()
        checkout_session = self.get_object()
        tx_fiat = checkout_session.tx_fiat
        stripe.api_key = settings.STRIPE_API_KEY

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
                self.kwargs["team_slug"],
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
                    self.kwargs["team_slug"],
                    self.kwargs["event_slug"],
                    self.kwargs["checkout_session_public_id"],
                ),
            )

        # OK
        # Process transaction
        # Redirect to tickets page
        checkout_session.tx_fiat.process()
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
                tx_status=CheckoutSession.OrderStatus.FULFILLED,
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
                passcode will be valid for only 24 hours.",
            )

        return render(self.request, f"checkout/{template_name}", ctx)
