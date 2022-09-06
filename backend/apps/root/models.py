import os
import uuid
from datetime import datetime, timedelta
from enum import Enum

import boto3
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.sites.shortcuts import get_current_site
from django.core.validators import MinValueValidator
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.crypto import get_random_string
from django_fsm import FSMField, transition
from djmoney.models.fields import MoneyField
from invitations import signals
from invitations.adapters import get_invitations_adapter
from invitations.base_invitation import AbstractBaseInvitation
from pytz import utc
from taggit.managers import TaggableManager

from apps.root.model_field_choices import EVENT_VISIBILITY, STIPE_PAYMENT_STATUSES
from apps.root.model_wrappers import DBModel
from config.storages import get_private_ticket_storage


class User(AbstractUser):
    """
    Default custom user model for backend.
    """


class Team(DBModel):
    """
    Umbrella team model for SocialPass customers
    """

    def get_default_pricing_rule_group():  # type: ignore
        return PricingRuleGroup.objects.get(name="Default").pk

    # base info
    name = models.CharField(max_length=255)
    image = models.ImageField(
        null=True, blank=True, height_field=None, width_field=None, max_length=255
    )
    description = models.TextField(blank=True)
    members = models.ManyToManyField("root.User", through="root.Membership")
    pricing_rule_group = models.ForeignKey(
        "PricingRuleGroup",
        on_delete=models.CASCADE,
        default=get_default_pricing_rule_group,
    )
    theme = models.JSONField(null=True, blank=True)

    def __str__(self):
        """
        return string representation of model
        """
        return self.name


class Membership(DBModel):
    """
    Membership manager for users <> teams
    """

    class Meta:
        unique_together = ("team", "user")

    team = models.ForeignKey(Team, on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(
        "root.User", on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        """
        return string representation of model
        """
        return f"{self.team.name}-{self.user.email}"


class Invite(DBModel, AbstractBaseInvitation):
    """
    Custom invite inherited from django-invitations
    Used for team invitations
    """

    email = models.EmailField(
        unique=True,
        verbose_name="e-mail address",
        max_length=settings.INVITATIONS_EMAIL_MAX_LENGTH,
    )
    # custom
    team = models.ForeignKey(Team, on_delete=models.CASCADE, blank=True, null=True)
    membership = models.ForeignKey(
        Membership, on_delete=models.CASCADE, blank=True, null=True
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
            days=settings.INVITATIONS_INVITATION_EXPIRY,
        )
        return expiration_date <= timezone.now()

    def send_invitation(self, request, **kwargs):
        current_site = get_current_site(request)
        invite_url = reverse(settings.INVITATIONS_CONFIRMATION_URL_NAME, args=[self.key])
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

        get_invitations_adapter().send_mail(email_template, self.email, ctx)
        self.sent = timezone.now()
        self.save()

        signals.invite_url_sent.send(
            sender=self.__class__,
            instance=self,
            invite_url_sent=invite_url,
            inviter=self.inviter,
        )

    def __str__(self):
        """
        return string representation of model
        """
        if self.team:
            return f"{self.team.name}-{self.email}"
        return self.email


class EventQuerySet(models.QuerySet):
    """
    Event model queryset manager
    """

    def filter_inactive(self):
        """
        inactive events (not live)
        """
        return self.filter(~models.Q(state=Event.StateEnum.LIVE.value))

    def filter_active(self):
        """
        active events (live)
        """
        return self.filter(state=Event.StateEnum.LIVE.value)

    def filter_publicly_accessible(self):
        """
        public events (filter_active ++ visibility==PUBLIC)
        In the future, should also check for published_date
        """
        return self.filter(visibility="PUBLIC").filter_active()

    def filter_featured(self):
        """
        public, featured events (filter_publicly_accessible ++ featured=True)
        """
        return self.filter(is_featured=True).filter_publicly_accessible()


class Event(DBModel):
    """
    Stores data for ticketed event
    """

    class StateEnum(Enum):
        DRAFT = "Draft"
        PENDING_CHECKOUT = "Ready for Checkout"
        LIVE = "Live"

    # Queryset manager
    objects = EventQuerySet.as_manager()

    # state
    state = FSMField(default=StateEnum.DRAFT.value, protected=True)

    # Keys
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

    # Publish info
    is_featured = models.BooleanField(default=False)
    publication_date = models.DateTimeField(
        default=timezone.now,
        null=True,
        blank=True,
        help_text="When your event will be made public.",
    )
    visibility = models.CharField(
        max_length=50,
        choices=EVENT_VISIBILITY,
        default=EVENT_VISIBILITY[0][0],
        help_text="Whether or not your event is searchable by the public.",
    )
    show_ticket_count = models.BooleanField(
        default=True, help_text="Whether or not your event displays ticket statistics."
    )
    show_team_image = models.BooleanField(
        default=True, help_text="Whether or not your event displays the team image."
    )

    # Basic Info
    title = models.CharField(
        max_length=255,
        blank=False,
        unique=True,
        help_text="Brief name for your event. Must be unique!",
    )
    organizer = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text="Name or brand or community organizing the event.",
    )
    description = models.TextField(
        null=True, blank=True, help_text="A short description of your event."
    )
    cover_image = models.ImageField(
        blank=True, null=True, help_text="A banner image for your event."
    )
    tags = TaggableManager(
        blank=True,
    )
    start_date = models.DateTimeField(
        blank=True, null=True, help_text="When your event will start."
    )
    end_date = models.DateTimeField(
        blank=True, null=True, help_text="When your event will end (optional)."
    )

    # Location info
    # tiemzone of event
    timezone = models.CharField(
        blank=True,
        null=True,
        verbose_name="time zone",
        max_length=30,
    )
    # localized address string (used to populate maps lookup)
    initial_place = models.CharField(
        max_length=1024,
        blank=True,
        null=True,
        help_text="Where your event will take place.",
    )
    # The street/location address (part 1)
    address_1 = models.CharField(max_length=255, blank=True, null=True)
    # The street/location address (part 2)
    address_2 = models.CharField(max_length=255, blank=True, null=True)
    # The city
    city = models.CharField(max_length=255, blank=True, null=True)
    # The ISO 3166-2 2- or 3-character region code
    region = models.CharField(max_length=4, blank=True, null=True)
    # The postal code
    postal_code = models.CharField(max_length=12, blank=True, null=True)
    # The ISO 3166-1 2-character international code for the country
    country = models.CharField(max_length=2, blank=True, null=True)
    # lat/long
    lat = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    long = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    localized_address_display = models.CharField(max_length=1024, blank=True, null=True)

    # Pricing Info
    _price = MoneyField(
        max_digits=19, decimal_places=4, default_currency="USD", null=True
    )
    pricing_rule = models.ForeignKey(
        "PricingRule",
        null=True,
        blank=True,
        default=None,
        on_delete=models.RESTRICT,
    )

    def __str__(self):
        return f"{self.team} - {self.title}"

    def get_absolute_url(self):
        if self.state == Event.StateEnum.DRAFT.value:
            _success_url = "event_update"
        elif self.state == Event.StateEnum.PENDING_CHECKOUT.value:
            _success_url = "event_checkout"
        elif self.state == Event.StateEnum.LIVE.value:
            _success_url = "event_detail"
        return reverse(
            _success_url,
            args=(
                self.team.public_id,
                self.pk,
            ),
        )

    def calculate_pricing_rule(self, capacity=None):
        """
        Returns calculated pricing rule based on capacity
        """
        # First check for capacity arg
        # If one isn't passed, used self.capacity
        if not capacity:
            capacity = self.capacity

        pricing_group = self.team.pricing_rule_group
        pricing_rules = pricing_group.active_rules.filter(active=True)
        pricing_rule_ranges = pricing_rules.order_by("min_capacity")
        for pricing_rule in pricing_rule_ranges:
            if (
                capacity >= pricing_rule.min_capacity
                and capacity <= pricing_rule.safe_max_capacity
            ):
                return pricing_rule

    def calculate_price(self, capacity=None):
        """
        Returns calculated pricing based on capacity
        """
        # First check for capacity arg
        # If one isn't passed, used self.capacity
        if not capacity:
            capacity = self.capacity

        # Pricing rule on event exists
        # Use this rule
        if self.pricing_rule:
            return self.pricing_rule.price_per_ticket * capacity

        # No pricing rule on event yet
        # Use calculate_pricing_rule
        else:
            return self.calculate_pricing_rule() * capacity

    def transition_draft(self, save=True):
        """
        wrapper around _transition_draft
        allows for saving after transition
        """
        try:
            self._transition_draft()
            # Save unless explicilty told not to
            if save:
                self.save()
        except Exception as e:
            raise e

    def transition_pending_checkout(self, save=True):
        """
        wrapper around _transition_pending_checkout
        allows for saving after transition
        """
        try:
            self._transition_pending_checkout()
            # Save unless explicilty told not to
            if save:
                self.save()
        except Exception as e:
            raise e

    def transition_live(self, save=True):
        """
        wrapper around _transition_live
        allows for saving after transition
        """
        try:
            self._transition_live()
            # Save unless explicilty told not to
            if save:
                self.save()
        except Exception as e:
            raise e

    @transition(
        field=state,
        source=[StateEnum.DRAFT.value, StateEnum.PENDING_CHECKOUT.value],
        target=StateEnum.DRAFT.value,
    )
    def _transition_draft(self):
        """
        This function handles state transition from draft to awaiting checkout
        Side effects include
        -
        """
        pass

    @transition(
        field=state,
        source=[StateEnum.DRAFT.value, StateEnum.PENDING_CHECKOUT.value],
        target=StateEnum.PENDING_CHECKOUT.value,
    )
    def _transition_pending_checkout(self):
        """
        This function handles state transition from draft to awaiting checkout
        Side effects include
        -
        """
        pass

    @transition(field=state, target=StateEnum.LIVE.value)
    def _transition_live(self):
        """
        This function handles state transition from draft to awaiting checkout
        Side effects include
        - Create ticket scanner object
        """
        # - Create ticket scanner object
        TicketRedemptionKey.objects.get_or_create(event=self)

    @property
    def price(self):
        """
        price property
        check @setter and @getter below
        """
        return self._price

    @price.setter
    def price(self, value):
        raise AttributeError(
            "Directly setting price is disallowed. \
            Please check the Event @price.getter method"
        )

    @price.getter
    def price(self):
        """
        Custom price.getter to provide calculable DB field
        Returns up-to-date price of event.
        Note: DB field is stored as self._price

        This getter evaluates calculated (expected) price vs current price.
        In case of conflict, this function update _price.
        """
        # Side effects may occur
        # Set to_save = True when they to do to be saved
        to_save = False

        # First check for pricing rule
        # If one does not exist, set one
        expected_pricing_rule = self.calculate_pricing_rule()
        if expected_pricing_rule != self.pricing_rule:
            to_save = True
            self.pricing_rule = expected_pricing_rule

        # Check price matches expected price
        # Update if not
        expected_price = self.calculate_price()
        if expected_price != self._price:
            to_save = True
            self._price = expected_price

        # Save and/or return
        if to_save is True:
            self.save()
        return self._price

    @property
    def discovery_url(self):
        return reverse("discovery:details", args=(self.public_id,))

    @property
    def checkout_portal_url(self):
        return f"{settings.CHECKOUT_PORTAL_BASE_URL}/{self.public_id}"

    @staticmethod
    def required_form_fields():
        fields = [
            "title",
            "organizer",
            "description",
            "visibility",
            "initial_place",
            "start_date",
            "timezone",
        ]
        return fields

    @staticmethod
    def optional_form_fields():
        fields = [
            "show_ticket_count",
            "show_team_image",
            "cover_image",
            "end_date",
            "publication_date",
            "address_1",
            "address_2",
            "city",
            "region",
            "postal_code",
            "country",
            "lat",
            "long",
            "localized_address_display",
        ]
        return fields


class Attendee(DBModel):
    """
    Stores data for an event attendee
    This model stores fields planned to support two separate checkout flows.
    1. Asset Ownership: Prove asset ownership to claim tickets
    2. Point of Sale Payments: Pay in crypto or fiat to purchase tickets
    """

    # Keys
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    # Basic Info
    email = models.EmailField()

    # Asset Ownership
    otp = models.UUIDField(null=True)
    wallet_address = models.CharField(max_length=400)
    is_verified = models.BooleanField(default=False)
    expires = models.DateTimeField(null=True)

    # Point of Sale Payments
    # Fields TBD

    def generate_otp_message(self):
        """
        Set new code and expiration
        Returns a message to be signed by wallet for asset ownership verification
        """
        self.expires = datetime.utcnow().replace(tzinfo=utc) + timedelta(minutes=30)
        self.otp = uuid.uuid4()
        self.save()
        return (
            "Greetings from SocialPass."
            "\nSign this message to prove ownership"
            "\n\nThis IS NOT a trade or transaction"
            f"\n\nTimestamp: {self.expires.strftime('%s')}"
            f"\nOne-Time Code: {str(self.otp)}"
        )

    @property
    def is_expired(self):
        """ """
        return self.expires < (datetime.utcnow().replace(tzinfo=utc))


class TicketOption(DBModel):
    """
    Stores data for a potential ticket option
    This model contains the data necessary to support multiple ticket option checkout flows
    - Asset Ownership
    - Free (TBA)
    - Crypto (TBA)
    - Fiat (TBA)
    """

    class TicketOptionEnum(models.TextChoices):
        ASSET_OWNERSHIP = "Asset Ownership"

    class BlockchainEnum(models.TextChoices):
        EVM = "EVM"

    class ChainIDEnum(models.TextChoices):
        ETH = (1, "Ethereum")
        ROPSTEN = (2, "Ropsten")  # Chain deprecated post-merge
        RINKEBY = (4, "Rinkeby")  # Chain deprecated post-merge
        BNB = (56, "BNB Chain")
        AVAX = (43114, "Avalanche")
        MATIC = (137, "Polygon")

    class AssetTypeEnum(models.TextChoices):
        ERC20 = "ERC20"
        ERC721 = "ERC721"
        ERC1155 = "ERC1155"

    # Keys
    event = models.ForeignKey("Event", on_delete=models.SET_NULL, null=True)

    # basic info
    name = models.CharField(max_length=255, default="Default")
    type = models.CharField(
        choices=TicketOptionEnum.choices,
        default=TicketOptionEnum.ASSET_OWNERSHIP,
        max_length=36,
    )
    # Ticket Info
    capacity = models.IntegerField(
        blank=True,
        default=1,
        validators=[MinValueValidator(1)],
        help_text="Maximum amount of attendees for this ticket type.",
    )
    min_quantity = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        help_text="Minimum amount of tickets for this ticket type.",
    )
    max_quantity = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        help_text="Maximum amount of tickets for this ticket type.",
    )

    # asset ownership
    asset_address = models.CharField(max_length=1024, null=True, blank=True)
    blockchain = models.CharField(
        choices=BlockchainEnum.choices, default=BlockchainEnum.EVM, max_length=12
    )
    chain_id = models.CharField(
        choices=ChainIDEnum.choices, default=ChainIDEnum.ETH, max_length=12
    )
    asset_type = models.CharField(
        choices=AssetTypeEnum.choices, default=AssetTypeEnum.ERC20, max_length=12
    )
    amount = models.IntegerField(null=True, blank=True)


class Ticket(DBModel):
    """
    List of all the tickets distributed by the respective Ticketed Event.
    """

    # Keys
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="tickets")

    # Ticket File Info
    filename = models.UUIDField(default=uuid.uuid4, editable=False)
    file = models.ImageField(null=True, storage=get_private_ticket_storage)
    embed_code = models.UUIDField(default=uuid.uuid4)

    # Ticket access info
    archived = models.BooleanField(default=False)
    redeemed = models.BooleanField(default=False)
    redeemed_at = models.DateTimeField(null=True, blank=True)
    redeemed_by = models.ForeignKey(
        "TicketRedemptionKey", on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return f"Ticket List (Ticketed Event: {self.event.title})"

    @property
    def full_embed(self):
        return f"{self.embed_code}/{self.filename}"

    @property
    def filename_key(self):
        return os.path.join(self.file.storage.location, self.file.name)

    @property
    def download_url(self):
        """
        This property is used for private ticket url
        On debug, use default image file
        On production, generate pre-signed s3 url
        """
        # Production
        if not settings.DEBUG:
            s3_client = boto3.client(
                "s3",
                region_name=settings.AWS_S3_REGION_NAME,
                endpoint_url=settings.AWS_S3_ENDPOINT_URL,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )
            return s3_client.generate_presigned_url(
                ClientMethod="get_object",
                Params={
                    "Bucket": f"{settings.AWS_STORAGE_BUCKET_NAME}",
                    "Key": self.filename_key,
                },
                ExpiresIn=3600,
            )
        # Debug
        else:
            return self.file.url


class TicketRedemptionKey(DBModel):
    """
    Stores authentication details used by ticket scanners
    """

    class Meta:
        unique_together = (
            "event",
            "name",
        )

    # Keys
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="ticket_redemption_keys"
    )

    # Basic info
    name = models.CharField(max_length=255, default="Default")

    @property
    def scanner_url(self):
        return f"{settings.SCANNER_BASE_URL}/{self.public_id}"


class EventStripePayment(DBModel):
    """
    Registers a payment done for Event
    """

    event = models.ForeignKey(
        "Event", on_delete=models.SET_NULL, null=True, related_name="payments"
    )
    value = MoneyField(
        max_digits=19, decimal_places=4, default_currency="USD", null=True
    )
    status = models.CharField(
        choices=STIPE_PAYMENT_STATUSES, max_length=30, default="PENDING"
    )
    stripe_checkout_session_id = models.CharField(max_length=1024)
    callaback_timestamp = models.DateTimeField(null=True, blank=True)
    acknowledgement_timestamp = models.DateTimeField(null=True, blank=True)


class PricingRule(DBModel):
    """
    Maps a capacity to a price per capacity
    Used to represent specific capacity charge of a team's event
    """

    class Meta:
        constraints = [
            # adds constraint so that max_capacity is necessarily
            # greater than min_capacity
            models.CheckConstraint(
                name="%(app_label)s_%(class)s_max_capacity__gt__min_capacity",
                check=(
                    models.Q(max_capacity__isnull=True)
                    | models.Q(max_capacity__gt=models.F("min_capacity"))
                ),
            )
        ]

    min_capacity = models.IntegerField(validators=[MinValueValidator(1)])
    max_capacity = models.IntegerField(null=True, blank=True)
    price_per_ticket = MoneyField(
        max_digits=19, decimal_places=4, default_currency="USD", null=True
    )
    active = models.BooleanField(default=True)
    group = models.ForeignKey(
        "PricingRuleGroup",
        related_name="pricing_rules",
        on_delete=models.CASCADE,  # if group is deleted, delete all rules
    )

    def __str__(self):
        return f"{self.group.name} ({self.min_capacity} - {self.max_capacity} | $ {self.price_per_ticket})"  # noqa

    def __repr__(self):
        return f"PricingRule({self.min_capacity} - {self.max_capacity})"

    @property
    def safe_max_capacity(self) -> int:
        # note: return psql max size integer
        return 2147483640 if self.max_capacity is None else self.max_capacity


class PricingRuleGroup(DBModel):
    """
    Represents a group of PricingRule's
    Used to represent full-range of charges per team's event
    """

    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.name}"

    def __repr__(self):
        return f"Pricing Rule Group({self.name})"

    @property
    def active_rules(self):
        return self.pricing_rules.filter(active=True)
