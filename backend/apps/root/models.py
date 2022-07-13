import os
import typing
import uuid
from datetime import datetime, timedelta
from enum import Enum

import boto3
from dateutil.tz import tzoffset
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core import exceptions as dj_exceptions
from django.core.files.storage import get_storage_class
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django_fsm import FSMField, transition
from djmoney.models.fields import MoneyField
from pytz import utc
from taggit.managers import TaggableManager

from apps.dashboard.models import PricingRule, Team
from apps.root.model_field_choices import EVENT_VISIBILITY
from apps.root.model_field_schemas import BLOCKCHAIN_REQUIREMENTS_SCHEMA
from apps.root.model_wrappers import DBModel
from apps.root.validators import JSONSchemaValidator
from config.storages import PrivateTicketStorage


class User(AbstractUser):
    """
    Default custom user model for backend.
    """


class EventLocation(DBModel):
    # The street/location address (part 1)
    address_1 = models.CharField(max_length=255)
    # The street/location address (part 2)
    address_2 = models.CharField(max_length=255)
    # The city
    city = models.CharField(max_length=255)
    # The ISO 3166-2 2- or 3-character region code for the state, province, region, or district
    region = models.CharField(max_length=3)
    # The postal code
    postal_code = models.IntegerField()
    # The ISO 3166-1 2-character international code for the country
    country = models.CharField(max_length=2)
    # geodjango lat/long
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    long = models.DecimalField(max_digits=9, decimal_places=6)
    # TODO:
    # point = PointField(geography=True, default="POINT(0.0 0.0)")
    # localized_address_display #The format of the address display localized to the address country
    # localized_area_display	#The format of the address's area display localized to the address country
    # localized_multi_line_address_display #The multi-line format order of the address display localized to the address country, where each line is an item in the list


class EventCategory(DBModel):
    """
    Category model for Events
    Contains parent description
    """

    parent_category = models.ForeignKey(
        "EventCategory", on_delete=models.SET_NULL, null=True
    )
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        if self.parent_category:
            return f"{self.parent_category} - {self.name}"
        else:
            return self.name


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
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True)

    # Publish info
    is_featured = models.BooleanField(default=False)
    publish_date = models.DateTimeField(default=timezone.now, null=True, blank=True)
    visibility = models.CharField(
        max_length=50, choices=EVENT_VISIBILITY, default=EVENT_VISIBILITY[0][0]
    )

    # Basic Info
    title = models.CharField(max_length=255, blank=False, unique=True)
    organizer = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    cover_image = models.ImageField(blank=True, null=True, storage=get_storage_class())
    category = models.ForeignKey(
        EventCategory, on_delete=models.SET_NULL, null=True, blank=True
    )
    tags = TaggableManager(
        blank=True,
    )
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    timezone = models.CharField(
        blank=True,
        null=True,
        verbose_name="time zone",
        max_length=30,
    )
    timezone_offset = models.FloatField(
        blank=True, null=True, verbose_name="Timezone offset in seconds"
    )
    location = models.CharField(blank=True, max_length=1024)
    # location_info = models.ForeignKey(EventLocation, on_delete=models.CASCADE, null=True)

    # Ticket Info
    # TODO: Move these to TicketType
    requirements = models.JSONField(
        blank=True,
        default=list,
        validators=[JSONSchemaValidator(limit_value=BLOCKCHAIN_REQUIREMENTS_SCHEMA)],
    )
    capacity = models.IntegerField(
        blank=True, default=1, validators=[MinValueValidator(1)]
    )
    limit_per_person = models.IntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(100)]
    )

    # Pricing Info
    _price = MoneyField(
        max_digits=19, decimal_places=4, default_currency="USD", null=True
    )
    pricing_rule = models.ForeignKey(
        PricingRule,
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

    @transition(
        field=state,
        source=[StateEnum.DRAFT.value, StateEnum.PENDING_CHECKOUT.value],
        target=StateEnum.DRAFT.value,
    )
    def transition_draft(self):
        """
        This function handles state transition from draft to awaiting checkout
        Side effects include
        -
        """
        return

    @transition(
        field=state,
        source=[StateEnum.DRAFT.value, StateEnum.PENDING_CHECKOUT.value],
        target=StateEnum.PENDING_CHECKOUT.value,
    )
    def transition_pending_checkout(self):
        """
        This function handles state transition from draft to awaiting checkout
        Side effects include
        -
        """
        return

    @transition(field=state, target=StateEnum.LIVE.value)
    def transition_live(self):
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
            "Directly setting price is disallowed. Please check the Event @price.getter method"
        )

    @price.getter
    def price(self):
        """
        custom price.getter to provide calculable DB field (actual field is stored as _price)
        evaluates calculated vs current value and updates price or pricing_rule when needed
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
    def required_fields():
        fields = [
            "title",
            "organizer",
            "description",
            "visibility",
            # location
            "location",
            # TODO
            # date and time
            "start_date",
            # cover image
            "cover_image",
            # 2. Requirements
            "requirements",
            # 3. Tickets
            "capacity",
            "limit_per_person",
            # 4. Publish
        ]
        return fields

    @staticmethod
    def optional_fields():
        fields = [
            "visibility",
            "end_date",
            "timezone_offset",
            "publish_date",
            "checkout_requested",
        ]
        return fields


class Ticket(DBModel):
    """
    List of all the tickets distributed by the respective Ticketed Event.
    """

    # Keys
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="tickets")

    # Ticket File Info
    filename = models.UUIDField(default=uuid.uuid4, editable=False)
    file = models.ImageField(null=True, storage=PrivateTicketStorage())
    embed_code = models.UUIDField(default=uuid.uuid4)

    # Ticket access info
    archived = models.BooleanField(default=False)
    redeemed = models.BooleanField(default=False)
    redeemed_at = models.DateTimeField(null=True, blank=True)
    redeemed_by = models.ForeignKey(
        "TicketRedemptionKey", on_delete=models.SET_NULL, null=True, blank=True
    )

    # Checkout Info
    blockchain_ownership = models.ForeignKey(
        "BlockchainOwnership",
        on_delete=models.SET_NULL,
        related_name="tickets",
        null=True,
    )
    blockchain_asset = models.JSONField(null=True)

    def __str__(self):
        return f"Ticket List (Ticketed Event: {self.event.title})"

    @property
    def full_embed(self):
        return f"{self.embed_code}/{self.filename}"

    @property
    def filename_key(self):
        return os.path.join(self.file.storage.location, self.file.name)

    @property
    def temporary_download_url(self):
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


class BlockchainOwnership(DBModel):
    """
    Stores details used to verify blockchain ownership in exchange for tickets
    """

    def set_expires():
        return datetime.utcnow().replace(tzinfo=utc) + timedelta(minutes=30)

    # Keys
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    # Basic info
    wallet_address = models.CharField(max_length=400)
    is_verified = models.BooleanField(default=False)
    expires = models.DateTimeField(default=set_expires)

    def __str__(self):
        return str(self.wallet_address)

    @property
    def is_expired(self):
        return self.expires < (datetime.utcnow().replace(tzinfo=utc))

    @property
    def signing_message(self):
        return (
            "Greetings from SocialPass. Sign this message to prove you have access to this wallet"
            "\nThis IS NOT a trade or transaction"
            f"\n\nTimestamp: {self.expires.strftime('%s')}"
            f"\nOne-Time Code: {str(self.public_id)[0:7]}"
        )
