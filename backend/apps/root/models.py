import json
import uuid
from datetime import date, timedelta
from typing import Optional

import jwt
import pytz
import requests
import rollbar
import stripe
from autoslug import AutoSlugField
from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.contrib.sites.models import Site
from django.core.mail import send_mail
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Q
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _
from django_fsm import FSMField, transition
from djmoney.settings import CURRENCY_CHOICES
from eth_account import Account
from eth_account.messages import encode_defunct
from model_utils.models import TimeStampedModel

from apps.root.exceptions import (
    AlreadyRedeemedError,
    EventStateTranstionError,
    ForbiddenRedemptionError,
    GoogleWalletAPIRequestError,
    TxAssetOwnershipProcessingError,
)
from apps.root.ticketing import AppleTicket, GoogleTicket
from apps.root.utils import get_expiration_datetime, get_random_passcode
stripe.api_key = settings.STRIPE_API_KEY

class DBModel(TimeStampedModel):
    """
    Abstract base model that provides useful fields such as timestamps, UUID's, and more.
    This field is inherited by every model
    """

    public_id = models.UUIDField(
        default=uuid.uuid4, unique=True, editable=False, db_index=True
    )

    class Meta:
        abstract = True


class User(AbstractUser):
    """
    Django User model inherited from AbstractUser
    Currently blank but allows for easier migration in the future
    """


class Team(DBModel):
    """
    Represents the 'umbrella' model for event organization
    Each user belongs to one or more teams, and each event belongs to a single team.
    """

    # keys
    members = models.ManyToManyField("User", through="Membership", blank=False)

    # basic info
    name = models.CharField(max_length=255, blank=False)
    image = models.ImageField(
        help_text="A brand image for your team. Please make sure the image is "
        "square, non-transparent, and ideally in the PNG format.",
        blank=False,
        null=False,
        height_field=None,
        width_field=None,
        upload_to="team__image",
    )
    description = models.TextField(blank=True, default="")
    theme = models.JSONField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    # stripe
    tmp_stripe_account_id = models.CharField(
        max_length=255,
        blank=True,
        default="",
        help_text="Temporary Stripe account ID used to create account links.",
    )
    stripe_account_id = models.CharField(
        max_length=255,
        blank=True,
        default="",
        help_text="Connected Stripe account ID.",
    )
    stripe_account_country = models.CharField(
        max_length=10,
        blank=True,
        default="",
        help_text="Connected Stripe account country.",
    )

    @property
    def is_stripe_connected(self):
        if self.stripe_account_id:
            return True
        else:
            return False

    @property
    def stripe_refresh_link(self):
        domain = Site.objects.all().first().domain
        url = reverse(
            "dashboard_organizer:stripe_refresh",
            args=[
                self.public_id,
            ],
        )
        return domain + url

    @property
    def stripe_return_link(self):
        domain = Site.objects.all().first().domain
        url = reverse(
            "dashboard_organizer:stripe_return",
            args=[
                self.public_id,
            ],
        )
        return domain + url

    @property
    def stripe_express_dashboard_link(self):
        if self.stripe_account_id:
            login_link = stripe.Account.create_login_link(
              self.stripe_account_id,
            )
            return login_link.url

    def __str__(self):
        """
        return string representation of model
        """
        return self.name


class Membership(DBModel):
    """
    Represents the relationship between a `Team` and a `User`.
    This model also allows a `User` having multiple `Team`
    """

    class Meta:
        unique_together = ("team", "user")

    # keys
    team = models.ForeignKey("Team", on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(
        "root.User", on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return f"{self.team.name}-{self.user.email}"


class Invite(DBModel):
    """
    Represents an invite to join a respective team.
    This invite can be sent to an existing user, or a new user.
    """

    class InviteQuerySet(models.QuerySet):
        """
        Invite model queryset manager
        """

        def all_expired(self):
            """
            expired invites
            """
            return self.filter(self.expired_q())

        def all_valid(self):
            """
            invites sent and not expired
            """
            return self.exclude(self.expired_q())

        def expired_q(self):
            sent_threshold = timezone.now() - timedelta(days=3)
            q = Q(accepted=True) | Q(sent__lt=sent_threshold)
            return q

    # Queryset manager
    objects = InviteQuerySet.as_manager()

    # Keys
    inviter = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    team = models.ForeignKey("Team", on_delete=models.CASCADE, blank=True, null=True)
    membership = models.ForeignKey(
        "Membership", on_delete=models.CASCADE, blank=True, null=True
    )

    # basic info
    accepted = models.BooleanField(
        verbose_name=_("accepted"), default=False, blank=False, null=False
    )
    key = models.CharField(
        verbose_name=_("key"), max_length=64, unique=True, blank=False
    )
    sent = models.DateTimeField(verbose_name=_("sent"), blank=False, null=True)
    email = models.EmailField(
        verbose_name="e-mail address",
        max_length=254,
        blank=False,
        null=False,
    )
    archived_email = models.EmailField(blank=True, null=True)

    @classmethod
    def create(cls, email, inviter=None, **kwargs):
        key = get_random_string(64).lower()
        instance = cls._default_manager.create(
            email=email, key=key, inviter=inviter, **kwargs
        )
        return instance

    def key_expired(self):
        expiration_date = self.sent + timedelta(
            days=3,
        )
        return expiration_date <= timezone.now()

    def send_invitation(self, request, **kwargs):
        current_site = Site.objects.all().first()
        invite_url = reverse("dashboard_organizer:team_accept_invite", args=[self.key])
        invite_url = request.build_absolute_uri(invite_url)
        ctx = kwargs
        ctx.update(
            {
                "team": self.team,
                "invite_url": invite_url,
                "site_name": current_site.name,
                "email": self.email,
                "key": self.key,
                "inviter": self.inviter,
            },
        )

        email_template = "invitations/email/email_invite"

        DefaultAccountAdapter().send_mail(email_template, self.email, ctx)
        self.sent = timezone.now()
        self.save()

        # Makes sense call a signal by now?

    def __str__(self):
        """
        return string representation of model
        """
        if self.team:
            return f"{self.team.name}-{self.email}"
        return self.email


class Event(DBModel):
    """
    Represents an event on SocialPass
    This event supports multiple states as well as multiple ticker tiers.
    """

    class EventQuerySet(models.QuerySet):
        """
        Event model queryset manager
        """

        def filter_inactive(self):
            """
            inactive events (not live)
            """
            return self.filter(~models.Q(state=Event.StateStatus.LIVE))

        def filter_active(self):
            """
            active events (live)
            """
            return self.filter(state=Event.StateStatus.LIVE)

    class StateStatus(models.TextChoices):
        DRAFT = "DRAFT", _("Draft")
        LIVE = "LIVE", _("Live")

    # Queryset manager
    objects = EventQuerySet.as_manager()

    # Keys
    user = models.ForeignKey("User", on_delete=models.SET_NULL, blank=False, null=True)
    team = models.ForeignKey("Team", on_delete=models.CASCADE, blank=False, null=False)
    google_class_id = models.CharField(max_length=255, blank=True, default="")

    # state
    state = FSMField(
        choices=StateStatus.choices,
        default=StateStatus.DRAFT,
        protected=True,
        blank=False,
        null=False,
    )

    # Basic Info
    title = models.CharField(
        max_length=255,
        unique=True,
        help_text="Brief name for your event. Must be unique!",
        blank=False,
    )
    organizer = models.CharField(
        max_length=255,
        help_text="Name or brand or community organizing the event.",
        blank=False,
        default="",
    )
    description = models.TextField(
        help_text="A short description of your event.",
        blank=False,
        default="",
    )
    cover_image = models.ImageField(
        help_text="A banner image for your event. Please make sure the image "
        "is a high quality landscape image, ideally 960 x 720 pixels (4:3).",
        blank=False,
        null=False,
        upload_to="event__cover_image",
    )
    start_date = models.DateTimeField(
        help_text="When your event will start.",
        blank=False,
        null=False,
    )
    end_date = models.DateTimeField(
        help_text="When your event will end (optional).",
        blank=True,
        null=True,
    )
    fiat_currency = models.CharField(
        max_length=3,
        help_text="The fiat currency to use for all tickets of this event.",
        blank=False,
        default="USD",
        choices=CURRENCY_CHOICES,
    )

    # Location info
    # timezone of event
    timezone = models.CharField(
        verbose_name="time zone",
        max_length=30,
        blank=False,
        default="",
    )
    # The street/location address (part 1)
    address_1 = models.CharField(max_length=255, blank=False, default="")
    # The street/location address (part 2)
    address_2 = models.CharField(max_length=255, blank=True, default="")
    # The city
    city = models.CharField(max_length=255, blank=False, default="")
    # The ISO 3166-2 2- or 3-character region code
    region = models.CharField(max_length=4, blank=True, default="")
    # The postal code
    postal_code = models.CharField(max_length=12, blank=True, default="")
    # The ISO 3166-1 2-character international code for the country
    country = models.CharField(max_length=2, blank=False, default="")

    # Publish info
    is_featured_top = models.BooleanField(default=False)
    slug = AutoSlugField(populate_from="title", null=True, unique=True)

    def __str__(self):
        return f"{self.team} - {self.title}"

    def get_absolute_url(self):
        if self.state == Event.StateStatus.DRAFT:
            _success_url = "dashboard_organizer:event_update"
        elif self.state == Event.StateStatus.LIVE:
            _success_url = "dashboard_organizer:event_update"
        return reverse(
            _success_url,
            args=(
                self.team.public_id,
                self.pk,
            ),
        )

    def handle_google_event_class(self):
        """
        insert/update Google class for event
        - object is NOT saved afterwards (done manually)
        - return class ID for success case, False otherwise
        - we use Boolean to handle fail case (not exceptions), because this
          functionality should be non-blocking during fail case
        """
        is_insert = True
        if self.google_class_id != "":
            is_insert = False
        response = GoogleTicket.GoogleTicket.insert_update_event_class(
            event_obj=self, is_insert=is_insert
        )
        if 200 <= response.status_code <= 299:
            self.google_class_id = json.loads(response.text)["id"]
            return self.google_class_id
        else:
            print("GOOGLE WALLET ERROR: " + response.text)
            rollbar.report_message("GOOGLE WALLET ERROR: " + response.text)
            return False

    def clean_handle_google_event_class(self, *args, **kwargs):
        """
        clean the handling of the Google event class
        """
        # we do this only for LIVE events to reduce the number of API requests
        if self.state == Event.StateStatus.LIVE:
            google_event_class_id = self.handle_google_event_class()
            if not google_event_class_id:
                raise GoogleWalletAPIRequestError(
                    "Something went wrong while handling the Google event class."
                )

    def clean(self, *args, **kwargs):
        """
        clean method
        runs all clean_* methods
        """
        self.clean_handle_google_event_class()
        return super().clean(*args, **kwargs)

    def transition_draft(self, save=True):
        """
        wrapper around _transition_draft
        allows for saving after transition
        """
        try:
            self._transition_draft()
            # Save unless explicilty told not to
            # This implies the caller will handle saving post-transition
            if save:
                self.save()
        except Exception as e:
            raise EventStateTranstionError({"state": str(e)})

    def transition_live(self, save=True, ignore_google_api=False):
        """
        wrapper around _transition_live
        allows for saving after transition
        """
        try:
            self._transition_live(ignore_google_api=ignore_google_api)
            # Save unless explicilty told not to
            # This implies the caller will handle saving post-transition
            if save:
                self.save()
        except Exception as e:
            raise EventStateTranstionError({"state": str(e)})

        # Send emails to team members (fail silently)
        try:
            ctx = {
                "event": self,
                "scanner_url": self.scanner_url,
            }
            emails = []
            memberships = Membership.objects.select_related("user").filter(
                team=self.team
            )
            for m in memberships:
                emails.append(m.user.email)
            msg_plain = render_to_string(
                "dashboard_organizer/email/go_live_message.txt", ctx
            )
            msg_html = render_to_string("dashboard_organizer/email/go_live.html", ctx)
            send_mail(
                "[SocialPass] Your event is live - " + self.title,
                msg_plain,
                "tickets-no-reply@socialpass.io",
                emails,
                html_message=msg_html,
            )
        except Exception as e:
            print("EMAIL ERROR: " + str(e))
            rollbar.report_message("EMAIL ERROR: " + str(e))

    @transition(field=state, target=StateStatus.DRAFT)
    def _transition_draft(self):
        """
        This function handles state transition to DRAFT
        Side effects include
        -
        """
        pass

    @transition(field=state, target=StateStatus.LIVE)
    def _transition_live(self, ignore_google_api=False):
        """
        This function handles state transition from DRAFT to LIVE
        Side effects include
        - Create ticket scanner object
        - Handle Google event class
        """
        # - Create ticket scanner object
        TicketRedemptionKey.objects.get_or_create(event=self)
        # - Handle Google event class
        if not ignore_google_api:
            google_event_class_id = self.handle_google_event_class()
            if not google_event_class_id:
                raise GoogleWalletAPIRequestError(
                    "Something went wrong while handling the Google event class."
                )

    @property
    def scanner_url(self):
        return TicketRedemptionKey.objects.filter(event=self).first().scanner_url

    @property
    def has_ended(self):
        if self.end_date:
            return date.today() > self.end_date.date()
        else:
            return False

    @property
    def localized_address_display(self):
        """
        localized_address_display will be
        "address_1, address_2, city, country, postal_code" joined
        """
        if not self.city and not self.address_1:
            return ""

        # add postal code to city if exists
        if self.postal_code:
            city = self.city + "-" + self.postal_code
        else:
            city = self.city

        address_fields = [
            self.address_1,
            city,
            pytz.country_names[self.country],
        ]

        # add address_2 to second list position if exists
        if self.address_2:
            address_fields.insert(1, self.address_2)

        # join fields
        localized_address_display = ", ".join(address_fields)
        return localized_address_display

    @property
    def tickets_total(self):
        return Ticket.objects.filter(event=self).count()

    @property
    def tickets_redeemed(self):
        return Ticket.objects.filter(event=self, redeemed=True).count()

    @property
    def quantity_total_sold(self):
        sold = Ticket.objects.filter(event=self)
        sold_with_party = sold.aggregate(models.Sum("party_size"))["party_size__sum"]
        return sold_with_party or 0

    @property
    def quantity_total_redeemed(self):
        redeemed = Ticket.objects.filter(event=self, redeemed=True)
        redeemed_with_party = redeemed.aggregate(models.Sum("party_size"))[
            "party_size__sum"
        ]
        return redeemed_with_party or 0

    @property
    def description_html(self):
        description_html = ""
        try:
            description_html = json.loads(self.description)["html"]
        except Exception:
            pass
        return description_html

    @property
    def currency_symbol(self):
        """
        Not all currencies will have recognizable symbols. If we just store the
        most used ones here locally, we should be good to go for all use cases.

        When used BEFORE amount, we should always be able to handle prices, no
        matter what the currency.
        Example:
            - 29.99 in USD becomes $29.99
            - 500 in Pakistani Rupee becomes PKR 500
        """
        CURRENCY_SYMBOLS = {
            "USD": "$",
            "GBP": "£",
            "EUR": "€",
            "CNY": "¥",
            "INR": "₹",
            "BDT": "৳", # Bangladesh
            "VND": "₫", # Vietnam
        }
        return CURRENCY_SYMBOLS.get(self.fiat_currency, self.fiat_currency + " ")


class Ticket(DBModel):
    """
    Represents a ticket to an event
    This model supports multiple forms of tickets (PDF, Apple, Google)
    """

    # Keys
    event = models.ForeignKey(
        "Event",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )
    ticket_tier = models.ForeignKey(
        "TicketTier",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )
    checkout_item = models.ForeignKey(
        "CheckoutItem",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )
    checkout_session = models.ForeignKey(
        "CheckoutSession",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )
    google_class_id = models.CharField(max_length=255, blank=True, default="")

    # Ticket access info
    party_size = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    embed_code = models.UUIDField(default=uuid.uuid4, blank=False, null=False)
    redeemed = models.BooleanField(default=False, blank=False, null=False)
    redeemed_at = models.DateTimeField(blank=True, null=True)
    redeemed_by = models.ForeignKey(
        "TicketRedemptionKey", on_delete=models.SET_NULL, blank=True, null=True
    )

    def __str__(self):
        return f"Ticket List (Ticketed Event: {self.event.title})"

    def redeem_ticket(
        self, redemption_access_key: Optional["TicketRedemptionKey"] = None
    ):
        """Redeems a ticket."""
        # Check if redeemed
        if self.redeemed:
            raise AlreadyRedeemedError({"redeemed": "Ticket is already redeemed."})

        # # Check if redemption key was passed
        if not redemption_access_key:
            raise ForbiddenRedemptionError(
                {"redemption_access_key": "Access key was not passed in"}
            )

        # Check if match on redemption access key
        if self.event.id != redemption_access_key.event.id:
            raise ForbiddenRedemptionError(
                {"event": "Event does not match redemption key"}
            )

        self.redeemed = True
        self.redeemed_at = timezone.now()
        self.redeemed_by = redemption_access_key
        self.save()
        return self

    def get_google_ticket_url(self):
        """
        retrieve the save URL for the Google ticket
        - create a Google ticket if one doesn't exist, set ID, save object
        - return save URL for success case, False otherwise
        - we use Boolean to handle fail case (not exceptions), because this
          functionality should be non-blocking during fail case
        """
        # Google ticket has not been created
        if self.google_class_id == "":
            response = GoogleTicket.GoogleTicket.create_ticket(ticket_obj=self)
            if 200 <= response.status_code <= 299:
                # Created successfully, we set the ID and save
                self.google_class_id = json.loads(response.text)["id"]
                self.save()
            else:
                # Error while making API request
                print("GOOGLE WALLET ERROR: " + response.text)
                rollbar.report_message("GOOGLE WALLET ERROR: " + response.text)
                return False

        # Create the save URL and return
        save_url = GoogleTicket.GoogleTicket.get_ticket_url(self.google_class_id)
        return save_url

    def get_apple_ticket_bytes(self):
        """
        retrieve the bytes for the Apple ticket
        - return bytes for success case, False otherwise
        - we use Boolean to handle fail case (not exceptions), because this
          functionality should be non-blocking during fail case
        """
        try:
            # Create pass and return the bytes
            _pass = AppleTicket.AppleTicket()
            _pass.generate_pass_from_ticket(self)
            return _pass.get_bytes()
        except Exception as e:
            # Error while getting the pass
            print("APPLE WALLET ERROR: " + str(e))
            rollbar.report_message("APPLE WALLET ERROR: " + str(e))
            return False


class TicketRedemptionKey(DBModel):
    """
    Represents a unique ID for ticket scanning purposes
    This model allows for multiple scanner ID's to be issued, as well as ID revocation
    """

    class Meta:
        unique_together = (
            "event",
            "name",
        )

    # Keys
    event = models.ForeignKey(
        "Event",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )

    # Basic info
    name = models.CharField(max_length=255, default="Default", blank=False, null=False)

    @property
    def scanner_url(self):
        return f"{settings.SCANNER_BASE_URL}/{self.public_id}"


class TicketTier(DBModel):
    """
    Represents a ticker tier for a respective ticket.
    This tier contains details for a ticket, ++ pricing and payment method information.
    """

    # keys
    event = models.ForeignKey(
        "Event",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )
    tier_fiat = models.OneToOneField(
        "TierFiat",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    tier_blockchain = models.OneToOneField(
        "TierBlockchain",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    tier_asset_ownership = models.OneToOneField(
        "TierAssetOwnership",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    tier_free = models.OneToOneField(
        "TierFree",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    # basic info
    ticket_type = models.CharField(
        max_length=255,
        blank=False,
        help_text="A short descriptive label for your ticket tier.",
    )
    capacity = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        help_text="Maximum amount of attendees for your event.",
        blank=True,
        null=False,
    )
    max_per_person = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        help_text="Maximum amount of tickets per attendee.",
        blank=False,
        null=False,
    )
    allowed_guests = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Maximum number of guests allowed for one ticket.",
        blank=False,
        null=False,
    )

    def __str__(self):
        return f"TicketTier {self.ticket_type}-{self.public_id}"

    @cached_property
    def quantity_sold(self):
        tickets = Ticket.objects.filter(ticket_tier=self)
        tickets_with_party = tickets.aggregate(models.Sum("party_size"))[
            "party_size__sum"
        ]
        return tickets_with_party or 0

    @cached_property
    def availability(self):
        return self.capacity - self.quantity_sold


class TierFiat(DBModel):
    """
    Represents a fiat-based tier for an event ticket
    Holds payment processing fields specific to a fiat payment
    """

    price_per_ticket = models.DecimalField(
        max_digits=19,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Price of one ticket for this tier.",
        blank=False,
        null=False,
    )

    def __str__(self) -> str:
        return f"TierFiat {self.public_id}"

    @property
    def price_per_ticket_cents(self):
        return round(self.price_per_ticket * 100)


class TierBlockchain(DBModel):
    """
    Represents a blockchain-based tier for an event ticket
    Holds payment processing fields specific to a blockchain payment
    """

    def __str__(self) -> str:
        return f"TierBlockchain {self.public_id}"


class TierAssetOwnership(DBModel):
    """
    Represents a asset ownership based tier for an event ticket
    Holds details specific to an asset ownership verification

    Note: These choices are modeled off the moralis API:
    https://docs.moralis.io/reference/evm-api-overview
    """

    class BlockchainChoices(models.TextChoices):
        ETH = "ETH", _("Ethereum")

    class NetworkChoices(models.IntegerChoices):
        ETH = 1, _("Ethereum")
        GOERLI = 5, _("Ethereum (Goerli TestNet)")
        SEPOLIA = 11155111, _("Ethereum (Sepolia TestNet)")
        MUMBAI = 80001, _("Ethereum (Mumbai TestNet)")
        POLYGON = 137, _("Polygon")
        BSC = 56, _("Binance Smart Chain")
        BSC_TESTNET = 97, _("Binance Smart Chain (TestNet)")
        AVAX = 43114, _("Avalanche")
        AVAX_TESTNET = 43113, _("Avalanche (TestNet)")
        FANTOM = 250, _("Fantom")
        CRONOS = 25, _("Cronos")
        CRONOS_TESTNET = 338, _("Cronos (TestNet)")
        ARBITRUM = 42161, _("Arbitrum")

    class AssetChoices(models.TextChoices):
        NFT = "NFT", _("NFT")

    blockchain = models.CharField(
        max_length=50,
        choices=BlockchainChoices.choices,
        default=BlockchainChoices.ETH,
        blank=False,
    )
    network = models.IntegerField(
        choices=NetworkChoices.choices,
        default=NetworkChoices.ETH,
        blank=False,
    )
    asset_type = models.CharField(
        max_length=50,
        choices=AssetChoices.choices,
        default=AssetChoices.NFT,
        blank=False,
    )
    balance_required = models.IntegerField(
        default=1,
        blank=False,
        null=False,
    )
    token_address = models.CharField(max_length=42, blank=False, default="")
    token_id = ArrayField(
        models.IntegerField(),
        null=True,
        blank=True,
        help_text="Please enter a list of token ID(s) separated by commas.",
    )
    issued_token_id = ArrayField(models.IntegerField(), blank=True, default=list)

    def __str__(self) -> str:
        return f"TierAssetOwnership {self.public_id}"


class TierFree(DBModel):
    """
    Represents a free tier for an event ticket
    """

    issued_emails = ArrayField(models.EmailField(), blank=True, default=list)

    def __str__(self) -> str:
        return f"TierFree {self.public_id}"


class CheckoutSession(DBModel):
    """
    Represents a time-limited checkout session (aka 'cart') for an event organizer
    This model holds the relations to cart items for checkout purposes
    """

    class OrderStatus(models.TextChoices):
        VALID = "VALID", _("Valid")  # Initial State, TX is valid
        PROCESSING = "PROCESSING", _("Processing")  # TX has been created, processing...
        FAILED = "FAILED", _("Failed")  # TX has failed
        COMPLETED = "COMPLETED", _("Completed")  # TX has been completed, fulfill order
        FULFILLED = "FULFILLED", _("Fulfilled")  # TX has been filled

    class TransactionType(models.TextChoices):
        FIAT = "FIAT", _("Fiat")
        BLOCKCHAIN = "BLOCKCHAIN", _("Blockchain")
        ASSET_OWNERSHIP = "ASSET_OWNERSHIP", _("Asset Ownership")
        FREE = "FREE", _("Free")

    # keys
    event = models.ForeignKey(
        "Event",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )
    tx_fiat = models.OneToOneField(
        "TxFiat",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    tx_blockchain = models.OneToOneField(
        "TxBlockchain",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    tx_asset_ownership = models.OneToOneField(
        "TxAssetOwnership",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    tx_free = models.OneToOneField(
        "TxFree",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    # basic info
    tx_type = models.CharField(
        max_length=50,
        choices=TransactionType.choices,
        default=TransactionType.FIAT,
        blank=False,
    )
    tx_status = models.CharField(
        max_length=50,
        choices=OrderStatus.choices,
        default=OrderStatus.VALID,
        blank=False,
    )
    name = models.CharField(max_length=255, blank=False)
    email = models.EmailField(max_length=255, blank=False, null=False)
    cost = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        blank=True,
        null=False,
    )
    passcode = models.CharField(max_length=6, default=get_random_passcode)
    passcode_expiration = models.DateTimeField(default=get_expiration_datetime)

    def __str__(self):
        return self.name

    @property
    def get_tickets_link(self):
        """
        get link to get the tickets for this session
        """
        domain = Site.objects.all().first().domain
        url = reverse(
            "checkout:get_tickets",
            args=[
                self.public_id,
            ],
        )
        tickets_link = domain + url
        return tickets_link

    @property
    def total_price(self):
        if self.tx_fiat:
            total_price = 0
            checkout_items = CheckoutItem.objects.select_related(
                "ticket_tier", "ticket_tier__tier_fiat"
            ).filter(checkout_session=self)
            for item in checkout_items:
                tier_price = item.ticket_tier.tier_fiat.price_per_ticket
                total_price += item.quantity * tier_price
            return total_price
        else:
            return "N/A"

    @property
    def stripe_checkout_cancel_link(self):
        domain = Site.objects.all().first().domain
        token = jwt.encode(
            {"public_id": str(self.public_id)},
            settings.STRIPE_API_KEY,
            algorithm="HS256",
        )
        url = reverse(
            "checkout:stripe_checkout_cancel",
            args=[
                self.event.slug,
                self.public_id,
                token,
            ],
        )
        return domain + url

    @property
    def stripe_checkout_success_link(self):
        domain = Site.objects.all().first().domain
        token = jwt.encode(
            {"public_id": str(self.public_id)},
            settings.STRIPE_API_KEY,
            algorithm="HS256",
        )
        url = reverse(
            "checkout:stripe_checkout_success",
            args=[
                self.event.slug,
                self.public_id,
                token,
            ],
        )
        return domain + url

    @property
    def application_fee_amount(self):
        """
        application fee that will be requested to be applied to the payment,
        & transferred to the application owner’s Stripe account.

        Current model is 4% + $2 Per Ticket (i.e., $100 ticket we would take $6)
        """
        items = self.checkoutitem_set.all()
        application_fee_amount = 0
        per_ticket = .04
        flat_fee = 200
        for i in items:
            application_fee_amount += ((i.unit_amount * per_ticket) + flat_fee)
        application_fee_amount = round(application_fee_amount)
        return application_fee_amount

    def send_confirmation_email(self):
        """
        send the confirmation link to the attendee's email
        """
        ctx = {
            "event": self.event,
            "tickets_link": self.get_tickets_link,
            "passcode": self.passcode,
        }
        msg_plain = render_to_string("ticket/email/checkout_message.txt", ctx)
        msg_html = render_to_string("ticket/email/checkout.html", ctx)
        send_mail(
            "[SocialPass] Tickets for " + self.event.title,
            msg_plain,
            "tickets-no-reply@socialpass.io",
            [self.email],
            html_message=msg_html,
        )

    def refresh_passcode(self):
        """
        refresh passcode and its expiration
        """
        self.passcode = get_random_passcode()
        self.passcode_expiration = get_expiration_datetime()
        self.save()

    def create_items_tickets(self):
        """
        call `CheckoutItem.create_tickets()` method for all
        related checkout_item objects
        """
        for checkout_item in self.checkoutitem_set.all():
            checkout_item.create_tickets()

    def create_transaction(self):
        """
        Responsible for creating the correct transaction based on tx_status
        """
        match self.tx_type:
            case CheckoutSession.TransactionType.FREE:
                tx = TxFree.objects.create()
                self.tx_free = tx
                self.tx_status = CheckoutSession.OrderStatus.VALID
                self.save()
            case CheckoutSession.TransactionType.FIAT:
                tx = TxFiat.objects.create()
                self.tx_fiat = tx
                self.tx_status = CheckoutSession.OrderStatus.VALID
                self.save()
            case CheckoutSession.TransactionType.BLOCKCHAIN:
                tx = TxBlockchain.objects.create()
                self.tx_blockchain = tx
                self.tx_status = CheckoutSession.OrderStatus.VALID
                self.save()
            case CheckoutSession.TransactionType.ASSET_OWNERSHIP:
                tx = TxAssetOwnership.objects.create()
                self.tx_asset_ownership = tx
                self.tx_status = CheckoutSession.OrderStatus.VALID
                self.save()
            case _:
                pass

    def finalize_transaction(self, form_data):
        """
        Responsible for finalizing transaction info based on form_data supplied
        """
        match self.tx_type:
            case CheckoutSession.TransactionType.FREE:
                pass
            case CheckoutSession.TransactionType.FIAT:
                pass
            case CheckoutSession.TransactionType.BLOCKCHAIN:
                pass
            case CheckoutSession.TransactionType.ASSET_OWNERSHIP:
                tx = self.tx_asset_ownership
                tx.wallet_address = form_data.cleaned_data["wallet_address"]
                tx.signed_message = form_data.cleaned_data["signed_message"]
                tx.save()
            case _:
                pass

    def process_transaction(self):
        """
        Responsible for processing the correct transaction based on tx_type
        """
        # Process specific TX
        match self.tx_type:
            case CheckoutSession.TransactionType.FREE:
                self.tx_free.process()
            case CheckoutSession.TransactionType.FIAT:
                self.tx_fiat.process()
            case CheckoutSession.TransactionType.BLOCKCHAIN:
                self.tx_blockchain.process()
            case CheckoutSession.TransactionType.ASSET_OWNERSHIP:
                self.tx_asset_ownership.process()
            case _:
                pass

    def fulfill(self):
        """
        Fullfil an order related to a checkout session
        - create tickets
        - send confirmation email
        - mark as fullfilled
        """
        self.create_items_tickets()
        self.send_confirmation_email()
        self.tx_status = CheckoutSession.OrderStatus.FULFILLED
        self.save()


class CheckoutItem(DBModel):
    """
    Represents items selected for checkout (aka 'cart items') by an event attendee
    This model is mapped to a specific ticket tier, as well as a specific ticket
    """

    # keys
    ticket_tier = models.ForeignKey(
        "TicketTier",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )
    checkout_session = models.ForeignKey(
        "CheckoutSession",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )

    # basic info
    quantity = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        blank=True,
        null=False,
    )
    extra_party = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
    )
    is_overflow = models.BooleanField(default=False)

    def __str__(self):
        return f"CheckoutItem {self.public_id}"

    @property
    def unit_amount(self):
        if not self.ticket_tier.tier_fiat:
            return 'N/A'

        price_per_ticket_cents = self.ticket_tier.tier_fiat.price_per_ticket_cents
        unit_amount = price_per_ticket_cents * self.quantity
        return unit_amount

    def create_tickets(self):
        """
        create Tickets and relate to the checkout_item
        the amount of tickets created will be the same as
        the quantity defined in the related checkout_item

        also check overflow and mark if necessary
        """
        extra_party = self.extra_party
        if extra_party > self.ticket_tier.allowed_guests:
            extra_party = self.ticket_tier.allowed_guests

        ticket_keys = {
            "checkout_session": self.checkout_session,
            "event": self.checkout_session.event,
            "ticket_tier": self.ticket_tier,
            "checkout_item": self,
            "party_size": extra_party + 1,
        }
        tickets = [Ticket(**ticket_keys) for _ in range(self.quantity)]

        # check overflow
        tickets_total_people = (extra_party + 1) * self.quantity
        if tickets_total_people > self.ticket_tier.availability:
            self.is_overflow = True
            self.save()

        # creat tickets
        Ticket.objects.bulk_create(tickets)


class TxFiat(DBModel):
    """
    Represents a checkout transaction via fiat payment
    """

    stripe_session_id = models.CharField(
        max_length=255,
        blank=True,
        default="",
        help_text="Stripe checkout session ID.",
    )
    stripe_session_url = models.TextField(
        blank=True,
        default="",
        help_text="Stripe checkout session URL.",
    )
    stripe_line_items = models.JSONField(blank=True, null=True)

    def __str__(self) -> str:
        return f"TxFiat {self.public_id}"

    def process(self, checkout_session=None):
        """
        Go through the states.
        """
        if not checkout_session:
            checkout_session = self.checkoutsession
        checkout_session.tx_status = CheckoutSession.OrderStatus.PROCESSING
        checkout_session.save()

        # OK
        checkout_session.tx_status = CheckoutSession.OrderStatus.COMPLETED
        checkout_session.save()
        checkout_session.fulfill()


class TxBlockchain(DBModel):
    """
    Represents a checkout transaction via blockchain payment
    """

    def __str__(self) -> str:
        return f"TxBlockchain {self.public_id}"

    def process(self, *args, **kwargs):
        pass


class TxAssetOwnership(DBModel):
    """
    Represents a checkout transaction via asset ownership
    """

    wallet_address = models.CharField(max_length=42, blank=False, default="")
    signed_message = models.CharField(max_length=255, blank=False, default="")
    is_wallet_address_verified = models.BooleanField(
        default=False, blank=False, null=False
    )
    error_message = models.CharField(max_length=1024, blank=True, default="")
    token_id = ArrayField(models.IntegerField(), blank=True, default=list)

    def __str__(self) -> str:
        return f"TxAssetOwnership {self.public_id}"

    @property
    def unsigned_message(self):
        return (
            "Greetings from SocialPass."
            "\nSign this message to prove ownership"
            "\n\nThis IS NOT a trade or transaction"
            f"\n\nTimestamp: {self.created.strftime('%s')}"
            f"\nOne-Time Code: {str(self.public_id)}"
        )

    def _call_moralis_api(self, tier_asset_ownership):
        """
        Format & make API call for each CheckoutItem and its respective tier
        raise HTTPError if status code error
        """

        chain = hex(tier_asset_ownership.network)
        token_address = tier_asset_ownership.token_address
        api_url = (
            f"https://deep-index.moralis.io/api/v2/{self.wallet_address}/nft"
            f"?chain={chain}"
            f"&token_addresses={token_address}"
            f"&format=decimal"
            f"&disable_total=false"
        )
        headers = {
            "accept": "application/json",
            "X-API-Key": settings.MORALIS_API_KEY,
        }
        response = requests.get(api_url, headers=headers)
        try:
            response.raise_for_status()
            response = response.json()
        except requests.exceptions.HTTPError:
            raise TxAssetOwnershipProcessingError(
                {"message": _("An error has ocurred")}
            )
        return response

    def _check_balance(self, expected, actual):
        """
        Ensure wallet has sufficient balance for tier (balance_required * quantity)
        Raise exception on insufficient balance
        """

        if actual < expected:
            raise TxAssetOwnershipProcessingError(
                {
                    "quantity": _(
                        "Quantity requested exceeds the queried balance. "
                        f"Expected Balance: {expected}. "
                        f"Actual Balance: {actual}."
                    )
                }
            )

    def _check_against_issued_ids(self, tier_asset_ownership, expected, result):
        """
        Filter against already-issued token ID's (tier.issued_token_id's)
        Raise exception on insufficient unique token ID's
        """

        filtered_by_issued_ids = [
            data
            for data in result
            if int(data["token_id"]) not in tier_asset_ownership.issued_token_id
        ]
        actual = len(filtered_by_issued_ids)
        if actual < expected:
            # TODO: if actual < expected here, we may need to call API again
            # This is because there can be paginated results
            raise TxAssetOwnershipProcessingError(
                {
                    "issued_token_id": (
                        f"Could not find enough NFT's. "
                        f"Expected unique NFT's: {expected}. "
                        f"Actual unique NFT's: {actual}."
                    )
                }
            )
        return filtered_by_issued_ids

    def _process_wallet_address(self, checkout_session=None):
        """
        Recover a wallet address from the signed_message vs unsigned_message
        - On success: Mark is_wallet_address_verified as True
        - On error: Raise TxAssetOwnershipProcessingError, mark session.tx_status as FAILED
        Once this wallet address has been verified, set is_wallet_address_verified
        """
        # Recover wallet address
        # Handle encoding / decoding exception (usually forgery attempt)
        try:
            _msg = encode_defunct(text=self.unsigned_message)
            recovered_address = Account.recover_message(
                _msg, signature=self.signed_message
            )
        except Exception:
            checkout_session.tx_status = CheckoutSession.OrderStatus.FAILED
            raise TxAssetOwnershipProcessingError(
                {"wallet_address": _("Error recovering address")}
            )

        # Successful recovery attempt
        # Now check if addresses match
        if recovered_address != self.wallet_address:
            checkout_session.tx_status = CheckoutSession.OrderStatus.FAILED
            raise TxAssetOwnershipProcessingError(
                {"wallet_address": _("Address was recovered, but did not match")}
            )

        # Success, mark as verified
        self.is_wallet_address_verified = True
        self.save()

    def _process_asset_ownership(self, checkout_session=None):
        """
        Process asset ownership
        - On success: Mark session as completed, call CheckoutSession.fulfill()
        - On error: Raise TxProccessingError, with conflicing checkout item ID
        1. Loop over CheckoutItem's
        2. Format & make API call for each CheckoutItem and its respective tier
        3. Verify API response
            a Ensure wallet has sufficient balance for tier (balance_required * quantity)
            b Filter for already-issued token ID's (tier.issued_token_id)
            c Prep token ID list for bulk update
        4. Finished.
            a. Bulk update tier_asset_ownership.issued_token_id
            b. Save Token ID's alongside TxAssetOwnershop
        """
        # Globals
        ticket_tiers_with_ids = {}
        tiers_token_ids = set()

        # 1. Loop over CheckoutItem's
        for item in checkout_session.checkoutitem_set.all():
            # 2. Format & make API call for each CheckoutItem and its respective tier
            tier_asset_ownership = item.ticket_tier.tier_asset_ownership
            api_response = self._call_moralis_api(
                tier_asset_ownership=tier_asset_ownership
            )

            # 3a. Check if wallet has balance
            expected = tier_asset_ownership.balance_required * item.quantity
            self._check_balance(expected=expected, actual=api_response["total"])

            # 3b. Filter for already-issued token ID's (tier.issued_token_id)
            filtered_by_issued_ids = self._check_against_issued_ids(
                tier_asset_ownership=tier_asset_ownership,
                expected=expected,
                result=api_response["result"],
            )

            # 3c. Prep token ID list for bulk update
            token_ids = [
                int(data.get("token_id"))
                for data in filtered_by_issued_ids
                if data.get("token_id")
            ]
            ticket_tiers_with_ids[tier_asset_ownership] = token_ids[:expected]

        # 4. Finished.
        # 4a. Bulk update tier_asset_ownership.issued_token_id
        tier_asset_ownership_list = []
        for t in ticket_tiers_with_ids:
            t.issued_token_id += ticket_tiers_with_ids[t]
            tier_asset_ownership_list.append(t)
        TierAssetOwnership.objects.bulk_update(
            tier_asset_ownership_list, ["issued_token_id"]
        )

        # 4b. Save Token ID's alongside TxAssetOwnership
        checkout_session.tx_asset_ownership.token_id = list(tiers_token_ids)
        checkout_session.tx_asset_ownership.save()

    def process(self, checkout_session=None):
        """
        1. Get/Set checkout_session (avoid duplicate queries)
        2. Set checkout_session as processing
        3. Process wallet address / signature
        4. Process Asset Ownership (via CheckoutSession.CheckouItem's)
        5. OK
        """
        # Get/Set checkout_session (avoid duplicate queries)
        if not checkout_session:
            checkout_session = self.checkoutsession

        # Set checkout_session as processing
        checkout_session.tx_status = CheckoutSession.OrderStatus.PROCESSING
        checkout_session.save()

        # try / catch on process methods
        try:
            self._process_wallet_address(checkout_session=checkout_session)
            self._process_asset_ownership(checkout_session=checkout_session)
        except Exception as e:
            checkout_session.tx_status = CheckoutSession.OrderStatus.FAILED
            checkout_session.tx_asset_ownership.error_message = str(e)
            checkout_session.save()
            checkout_session.tx_asset_ownership.save()
            print(e)
            raise e

        # OK
        checkout_session.tx_status = CheckoutSession.OrderStatus.COMPLETED
        checkout_session.save()
        checkout_session.fulfill()


class TxFree(DBModel):
    """
    Represents a free checkout transaction
    """

    def __str__(self) -> str:
        return f"TxFree {self.public_id}"

    def process(self, checkout_session=None):
        """
        Go through the states, only stop to check for issued emails.
        """
        if not checkout_session:
            checkout_session = self.checkoutsession
        checkout_session.tx_status = CheckoutSession.OrderStatus.PROCESSING
        checkout_session.save()

        # Check for issued emails
        for item in checkout_session.checkoutitem_set.all():
            if checkout_session.email in item.ticket_tier.tier_free.issued_emails:
                checkout_session.tx_status = CheckoutSession.OrderStatus.FAILED
                checkout_session.save()
                raise Exception(
                    "This email has already been used for this ticket tier."
                )
            else:
                item.ticket_tier.tier_free.issued_emails.append(checkout_session.email)
                item.ticket_tier.tier_free.save()

        # OK
        checkout_session.tx_status = CheckoutSession.OrderStatus.COMPLETED
        checkout_session.save()
        checkout_session.fulfill()
