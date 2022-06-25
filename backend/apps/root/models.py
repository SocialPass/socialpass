import os
import uuid
from datetime import datetime, timedelta

import boto3
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from pytz import utc
from taggit.managers import TaggableManager

from apps.dashboard.models import PricingRule, Team
from config.storages import MediaRootS3Boto3Storage, PrivateTicketStorage

from .model_field_schemas import BLOCKCHAIN_REQUIREMENTS_SCHEMA
from .model_wrappers import DBModel
from .validators import JSONSchemaValidator


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
    """
    localized_address_display #The format of the address display localized to the address country
    localized_area_display	#The format of the address's area display localized to the address country
    localized_multi_line_address_display #The multi-line format order of the address display localized to the address country, where each line is an item in the list
    """


class Event(DBModel):
    """
    Stores data for ticketed event
    """

    # Keys
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, blank=True)

    # Basic Info
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(null=True, storage=MediaRootS3Boto3Storage())
    categories = TaggableManager()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(blank=True, null=True)
    timezone = models.CharField(
        null=True,
        verbose_name="time zone",
        max_length=30,
    )
    location = models.ForeignKey(EventLocation, on_delete=models.CASCADE, null=True)

    # Ticket Info
    # TODO: Move these to TicketType
    requirements = models.JSONField(
        default=list,
        blank=True,
        null=True,
        validators=[JSONSchemaValidator(limit_value=BLOCKCHAIN_REQUIREMENTS_SCHEMA)],
    )
    capacity = models.IntegerField(validators=[MinValueValidator(1)])
    limit_per_person = models.IntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(100)]
    )

    # Pricing Info
    # TODO: These will be reworked / removed with event attendee billing
    price = models.DecimalField(
        validators=[MinValueValidator(0)],
        decimal_places=2,
        max_digits=10,
        null=True,
        blank=True,
        default=None,
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

    @property
    def checkout_portal_url(self):
        return f"{settings.CHECKOUT_PORTAL_BASE_URL}/{self.public_id}"

    @property
    def has_pending_checkout(self):
        last_payment = self.payments.last()
        if last_payment is None:
            return True

        return last_payment.status in [None, "PENDING", "CANCELLED", "FAILURE"]

    def save(self, *args, **kwargs):
        created = self.pk
        super().save(*args, **kwargs)

        if created:
            TicketRedemptionKey.objects.get_or_create(event=self)


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
