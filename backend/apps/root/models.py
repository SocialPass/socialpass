import uuid
from datetime import date, timedelta
from typing import Optional

from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.contrib.sites.shortcuts import get_current_site
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Q
from django.urls import reverse
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _
from django_fsm import FSMField, transition
from model_utils.models import TimeStampedModel

from apps.root.exceptions import (
    AlreadyRedeemedError,
    ConflictingTiersRequestedError,
    DuplicatesTiersRequestedError,
    EventStateTranstionError,
    ForbiddenRedemptionError,
    TooManyTicketsRequestedError,
)
from apps.root.utilities.ticketing import AppleTicket, GoogleTicket, PDFTicket


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
        blank=True,
        null=True,
        height_field=None,
        width_field=None,
        upload_to="team__image",
    )
    description = models.TextField(blank=True, default="")
    theme = models.JSONField(blank=True, null=True)

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

        def delete_expired_confirmations(self):
            """
            delete all expired invites
            """
            self.all_expired().delete()

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
        unique=True,
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
        current_site = get_current_site(request)
        invite_url = reverse("dashboard:team_accept_invite", args=[self.key])
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

        def filter_featured(self):
            """
            public, featured events (filter_active ++ featured=True)
            """
            return self.filter(is_featured=True).filter_active()

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

    # Publish info
    is_featured = models.BooleanField(default=False, blank=False, null=False)

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
        help_text="A banner image for your event.",
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

    # Location info
    # timezone of event
    timezone = models.CharField(
        verbose_name="time zone",
        max_length=30,
        blank=False,
        default="",
    )
    # localized address string (used to populate maps lookup)
    initial_place = models.CharField(
        max_length=1024,
        help_text="Where your event will take place.",
        blank=True,
        default="",
    )
    # The street/location address (part 1)
    address_1 = models.CharField(max_length=255, blank=True, default="")
    # The street/location address (part 2)
    address_2 = models.CharField(max_length=255, blank=True, default="")
    # The city
    city = models.CharField(max_length=255, blank=True, default="")
    # The ISO 3166-2 2- or 3-character region code
    region = models.CharField(max_length=4, blank=True, default="")
    # The postal code
    postal_code = models.CharField(max_length=12, blank=True, default="")
    # The ISO 3166-1 2-character international code for the country
    country = models.CharField(max_length=2, blank=True, default="")
    # lat/long
    lat = models.DecimalField(max_digits=9, decimal_places=6, blank=False, null=True)
    long = models.DecimalField(max_digits=9, decimal_places=6, blank=False, null=True)
    localized_address_display = models.CharField(max_length=1024, blank=True, default="")

    def __str__(self):
        return f"{self.team} - {self.title}"

    def get_absolute_url(self):
        if self.state == Event.StateStatus.DRAFT:
            _success_url = "dashboard:event_update"
        elif self.state == Event.StateStatus.LIVE:
            _success_url = "dashboard:event_update"
        return reverse(
            _success_url,
            args=(
                self.team.public_id,
                self.pk,
            ),
        )

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

    def transition_live(self, save=True):
        """
        wrapper around _transition_live
        allows for saving after transition
        """
        try:
            self._transition_live()
            # Save unless explicilty told not to
            # This implies the caller will handle saving post-transition
            if save:
                self.save()
        except Exception as e:
            raise EventStateTranstionError({"state": str(e)})

    @transition(field=state, target=StateStatus.DRAFT)
    def _transition_draft(self):
        """
        This function handles state transition to DRAFT
        Side effects include
        -
        """
        pass

    @transition(field=state, target=StateStatus.LIVE)
    def _transition_live(self):
        """
        This function handles state transition from DRAFT to LIVE
        Side effects include
        - Create ticket scanner object
        - Set google_class_id
        """
        # - Create ticket scanner object
        TicketRedemptionKey.objects.get_or_create(event=self)
        # - Set google_class_id
        self.google_class_id = (
            f"{settings.GOOGLE_WALLET_ISSUER_ID}.{str(self.public_id)}"
        )

    @property
    def discovery_url(self):
        return reverse("discovery:details", args=(self.public_id,))

    @property
    def checkout_portal_url(self):
        return f"{settings.CHECKOUT_PORTAL_BASE_URL}/{self.public_id}"

    @property
    def scanner_url(self):
        return TicketRedemptionKey.objects.filter(event=self).first().scanner_url

    @property
    def has_ended(self):
        if self.end_date:
            return date.today() > self.end_date.date()
        else:
            return False


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

    # Ticket access info
    embed_code = models.UUIDField(default=uuid.uuid4, blank=False, null=False)
    archived = models.BooleanField(default=False, blank=False, null=False)
    redeemed = models.BooleanField(default=False, blank=False, null=False)
    redeemed_at = models.DateTimeField(blank=True, null=True)
    redeemed_by = models.ForeignKey(
        "TicketRedemptionKey", on_delete=models.SET_NULL, blank=True, null=True
    )
    google_class_id = models.CharField(max_length=255, blank=True, default="")

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

    def get_apple_ticket(self):
        """
        create a passfile and get its bytes
        """
        try:
            _pass = AppleTicket.AppleTicket()
            _pass.generate_pass_from_ticket(self)
            return _pass.get_bytes()
        except Exception as e:
            raise e

    def get_pdf_ticket(self):
        """
        create a pdf pass and get its bytes
        """
        try:
            _pass = PDFTicket.PDFTicket()
            _pass.generate_pass_from_ticket(self)
            return _pass.get_bytes()
        except Exception as e:
            raise e

    def get_google_ticket(self):
        """
        create or retrieve pass url from google wallet api
        """
        if not self.class_id:
            raise Exception("The event was not registered")

        _pass = GoogleTicket.GoogleTicket()
        resp = _pass.generate_pass_from_ticket(self)
        if resp.get("error"):
            raise Exception("The event was not registered properly")

        return _pass.get_pass_url()


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

    # basic info
    ticket_type = models.CharField(
        max_length=255,
        blank=False,
    )
    capacity = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        help_text="Maximum amount of attendees for your event.",
        blank=True,
        null=False,
    )
    quantity_sold = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
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

    def __str__(self):
        return f"TicketTier {self.ticket_type}-{self.public_id}"


class TierFiat(DBModel):
    """
    Represents a fiat-based tier for an event ticket
    Holds payment processing fields specific to a fiat payment
    """

    def __str__(self) -> str:
        return f"TierFiat {self.public_id}"


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
    token_address = models.CharField(max_length=42, blank=False, default="")
    token_id = ArrayField(
        models.IntegerField(),
        null=True,
        blank=True,
        help_text="Please enter a list of token ID(s) separated by commas.",
    )

    def __str__(self) -> str:
        return f"TierAssetOwnership {self.public_id}"


class CheckoutSession(DBModel):
    """
    Represents a time-limited checkout session (aka 'cart') for an event organizer
    This model holds the relations to cart items for checkout purposes
    """

    class OrderStatus(models.TextChoices):
        VALID = "VALID", _("Valid")
        FAILED = "FAILED", _("Failed")
        EXPIRED = "EXPIRED", _("Expired")
        COMPLETED = "COMPLETED", _("Completed")

    class TransactionType(models.TextChoices):
        FIAT = "FIAT", _("Fiat")
        BLOCKCHAIN = "BLOCKCHAIN", _("Blockchain")
        ASSET_OWNERSHIP = "ASSET_OWNERSHIP", _("Asset Ownership")

    # keys
    event = models.ForeignKey(
        "Event",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )
    tx_fiat = models.ForeignKey(
        "TxFiat",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    tx_blockchain = models.ForeignKey(
        "TxBlockchain",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    tx_asset_ownership = models.ForeignKey(
        "TxAssetOwnership",
        on_delete=models.CASCADE,
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
    expiration = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=False)
    email = models.EmailField(max_length=255, blank=False, null=False)
    cost = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        blank=True,
        null=False,
    )

    def __str__(self):
        return self.name


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

    def __str__(self):
        return f"CheckoutItem {self.public_id}"

    def clean_quantity(self, *args, **kwargs):
        """
        clean quantity method
        checks for available tickets
        """
        available = self.ticket_tier.capacity - self.ticket_tier.quantity_sold
        if self.quantity > available:
            raise TooManyTicketsRequestedError(
                {"quantity": _(f"Only {available} quantity is available.")}
            )

    def clean_ticket_tier(self, *args, **kwargs):
        """
        clean ticket_tier method
        checks for duplicate or conflicting tiers
        """
        # check if ticket_tier already exists in the parent CheckoutSession
        # raises DuplicatesTiersRequestedError if duplicate found
        qs = CheckoutItem.objects.filter(
            checkout_session=self.checkout_session, ticket_tier=self.ticket_tier
        ).exclude(pk=self.pk)
        if qs.exists():
            raise DuplicatesTiersRequestedError(
                {"ticket_tier": _("Duplicate ticket_tier are not accepted")}
            )

        # check if ticket_tier conflict with the parent CheckoutSession tx_type
        # raises ConflictingTiersRequestedError if mismatch found
        match self.checkout_session.tx_type:
            case CheckoutSession.TransactionType.FIAT:
                if not self.ticket_tier.tier_fiat:
                    raise ConflictingTiersRequestedError(
                        {"ticket_tier": _("ticket_tier does not support fiat")}
                    )
            case CheckoutSession.TransactionType.BLOCKCHAIN:
                if not self.ticket_tier.tier_blockchain:
                    raise ConflictingTiersRequestedError(
                        {"ticket_tier": _("ticket_tier does not support blockchain")}
                    )
            case CheckoutSession.TransactionType.ASSET_OWNERSHIP:
                if not self.ticket_tier.tier_asset_ownership:
                    raise ConflictingTiersRequestedError(
                        {
                            "ticket_tier": _(
                                "ticket_tier does not support asset ownership"
                            )
                        }
                    )
            case _:
                pass

    def clean(self, *args, **kwargs):
        """
        clean method
        runs all clean_* methods
        """
        self.clean_quantity()
        self.clean_ticket_tier()


class TxFiat(DBModel):
    """
    Represents a checkout transaction via fiat payment
    """

    def __str__(self) -> str:
        return f"TxFiat {self.public_id}"


class TxBlockchain(DBModel):
    """
    Represents a checkout transaction via blockchain payment
    """

    def __str__(self) -> str:
        return f"TxBlockchain {self.public_id}"


class TxAssetOwnership(DBModel):
    """
    Represents a checkout transaction via asset ownership
    """

    def __str__(self) -> str:
        return f"TxAssetOwnership {self.public_id}"
