import base64
from io import BytesIO

import qrcode
from django.contrib import messages
from django.http import Http404
from django.shortcuts import render

# from django.views.generic.list import ListView
from django.utils import timezone
from django.views.generic import TemplateView, View
from django.views.generic.detail import DetailView

from apps.root.models import CheckoutSession, Event, Ticket
from apps.root.exceptions import TxAssetOwnershipProcessingError, TxFreeProcessingError

from .forms import PasscodeForm, CheckoutForm, CheckoutForm2, NFTCheckoutForm


class NFTCheckout(View):
    """
    GET
    Fetch Event
    Fetch Event Ticket Tiers

    POST
    Create Checkout Session
    Create Checkout Items
    """

    def get(self, *args, **kwargs):
        nft_checkout_form = NFTCheckoutForm()

        return render(
            self.request,
            "event_discovery/nft_checkout.html",
            {
                "nft_checkout_form": nft_checkout_form,
            },
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
        tiers_active, tiers_free, tiers_fiat, tiers_blockchain, tiers_asset_ownership = (
            [] for i in range(5)
        )
        availability = {
            "free": False,
            "fiat": False,
            "blockchain": False,
            "asset_ownership": False,
        }

        # Populate holder lists with correct tiers and update availability
        for tier in tiers_all:
            if tier.tier_free:
                tiers_free.append(tier)
                if tier.availability > 0: availability["free"] = True
            if tier.tier_fiat:
                tiers_fiat.append(tier)
                if tier.availability > 0: availability["fiat"] = True
            if tier.tier_blockchain:
                tiers_blockchain.append(tier)
                if tier.availability > 0: availability["blockchain"] = True
            if tier.tier_asset_ownership:
                tiers_asset_ownership.append(tier)
                if tier.availability > 0: availability["asset_ownership"] = True

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
            if availability["asset_ownership"]:
                checkout_type = "nft"
            if availability["blockchain"]:
                checkout_type = "crypto"
            if availability["fiat"]:
                checkout_type = "fiat"
            if availability["free"]:
                checkout_type = "free"

        # If checkout type is still empty (no tier available), we set using length   
        if not checkout_type:
            if len(tiers_asset_ownership) > 0:
                checkout_type = "nft"
            if len(tiers_blockchain) > 0:
                checkout_type = "crypto"
            if len(tiers_fiat) > 0:
                checkout_type = "fiat"
            if len(tiers_free) > 0:
                checkout_type = "free"

        # Set tiers active
        if checkout_type == "free":
            tiers_active = tiers_free
        elif checkout_type == "fiat":
            tiers_active = tiers_fiat
        elif checkout_type == "crypto":
            tiers_active = tiers_blockchain
        elif checkout_type == "nft":
            tiers_active = tiers_asset_ownership

        # Set everything to context
        context["form"] = CheckoutForm()
        context["tiers_active"] = tiers_active
        context["tiers_free"] = tiers_free
        context["tiers_fiat"] = tiers_fiat
        context["tiers_blockchain"] = tiers_blockchain
        context["tiers_asset_ownership"] = tiers_asset_ownership
        context["tier_types_count"] = tier_types_count
        context["availability"] = availability
        context["checkout_type"] = checkout_type
        return context


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
    slug_url_kwarg = "public_id"
    template_name = "checkout/checkout_page_two.html"

    def get_object(self):
        # TODO
        # Prefetch event, checkout items, tickets, etc.
        # Redirect if checkout not success
        self.object = CheckoutSession.objects.prefetch_related("checkoutitem_set").get(
            public_id=self.kwargs["public_id"]
        )
        if not self.object:
            raise Http404
        return super().get_object()

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)

        context["checkout_items"] = self.object.checkoutitem_set.all()
        context["form"] = CheckoutForm2(initial={
            "name": self.object.name,
            "email": self.object.email
        })
        return context

    def post(self, *args, **kwargs):
        try:
            self.object.process_transaction()
        except TxAssetOwnershipProcessingError:
            return
            # TODO
            # return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)
        except TxFreeProcessingError:
            return
            # TODO
            # return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return
            # TODO
            # return Response(status=status.HTTP_400_BAD_REQUEST)

        return super().post(*args, **kwargs)


class CheckoutPageSuccess(DetailView):
    model = CheckoutSession
    slug_field = "public_id"
    slug_url_kwarg = "public_id"
    template_name = "checkout/checkout_page_success.html"

    def get_object(self):
        self.object = CheckoutSession.objects.prefetch_related("checkoutitem_set").get(
            public_id=self.kwargs["public_id"],
        )
        if not self.object:
            raise Http404
        return super().get_object()

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context["checkout_items"] = self.object.checkoutitem_set.all()
        return context


class EventDiscoveryIndex(TemplateView):
    template_name = "landing/index.html"

    def get_context_data(self, **kwargs):
        """
        featured event
        """
        context = super().get_context_data(**kwargs)
        featured_top = Event.objects.filter(is_featured_top=True)[:1]
        if featured_top.count() > 0:
            featured_event = featured_top[0]
        else:
            featured_event = False
        context.update({"featured_event": featured_event})
        return context


class EventDiscoveryHostIndex(TemplateView):
    template_name = "landing/index_host.html"


"""
class EventDiscoveryBrowse(ListView):
    model = Event
    paginate_by = 15
    ordering = ["-modified"]
    context_object_name = "events"
    template_name = "event_discovery/browse_events.html"

    def get_queryset(self):
        # Get public, published event queryset
        qs = super().get_queryset().filter_active()

        # Filter by available querystings
        query_title = self.request.GET.get("title", "")
        if query_title:
            qs = qs.filter(title__icontains=query_title)

        return qs
"""


class EventDiscoveryDetails(DetailView):
    model = Event
    slug_field = "id"
    slug_url_kwarg = "event_id"
    context_object_name = "event"
    template_name = "event_discovery/event_details.html"

    def get_queryset(self):
        qs = super().get_queryset().filter_active()
        return qs.filter(id=self.kwargs["event_id"])


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
            "event_discovery/get_tickets_passcode.html",
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

        return render(self.request, f"event_discovery/{template_name}", ctx)
