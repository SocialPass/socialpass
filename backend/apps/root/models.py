import os
import uuid
from datetime import datetime, timedelta

import boto3
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from model_utils.models import TimeStampedModel
from pytz import utc

from apps.dashboard.models import PricingRule, Team
from config.storages import PrivateTicketStorage

from .model_field_schemas import BLOCKCHAIN_REQUIREMENTS_SCHEMA
from .model_wrappers import DBModel
from .validators import JSONSchemaValidator


class User(AbstractUser):
    """
    Default custom user model for backend.
    """


class Event(DBModel):
    """
    Stores data for ticketed event
    """

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    requirements = models.JSONField(
        default=list,
        blank=True,
        null=True,
        validators=[JSONSchemaValidator(limit_value=BLOCKCHAIN_REQUIREMENTS_SCHEMA)],
    )
    limit_per_person = models.IntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(100)]
    )
    featured = models.BooleanField(default=False)
    date = models.DateTimeField()
    timezone = models.CharField(
        null=True,
        verbose_name="time zone",
        max_length=30,
    )
    location = models.CharField(max_length=1024)
    capacity = models.IntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(
        validators=[MinValueValidator(0)],
        decimal_places=2,
        max_digits=10,
        null=True,
        blank=True,
        default=None,
    )
    # TODO: add constraint so that price and pricing_rule should be set
    # together. Thus one can't be null if the other is not null.
    pricing_rule = models.ForeignKey(
        PricingRule,
        null=True,
        blank=True,
        default=None,
        on_delete=models.RESTRICT,  # Forbids pricing rules from being deleted
    )

    def __str__(self):
        """
        return string representation of model
        """
        return f"{self.team} - {self.title}"

    @property
    def event_portal_url(self):
        return f"{settings.EVENT_PORTAL_BASE_URL}/{self.public_id}"

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
            RedemptionAccessKey.objects.get_or_create(event=self)


class RedemptionAccessKey(DBModel):
    class Meta:
        unique_together = (
            "event",
            "name",
        )

    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="redemption_access_keys"
    )
    name = models.CharField(max_length=255, default="Default")
    # TODO in a near future, different ScannerKeyAccess
    # can give access to scanning diferent type of tickets.

    @property
    def scanner_url(self):
        return f"{settings.SCANNER_BASE_URL}/{self.public_id}"


class BlockchainOwnership(DBModel):
    """
    Stores details used to verify blockchain ownership in exchange for tickets
    """

    def set_expires():
        return datetime.utcnow().replace(tzinfo=utc) + timedelta(minutes=30)

    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    wallet_address = models.CharField(max_length=400)
    is_verified = models.BooleanField(default=False)
    expires = models.DateTimeField(default=set_expires)

    def __str__(self):
        """
        return string representation of model
        """
        return str(self.wallet_address)

    @property
    def is_expired(self):
        return self.expires < (datetime.utcnow().replace(tzinfo=utc))

    @property
    def signing_message(self):
        return f"Greetings from SocialPass. Sign this message to prove you have access to this wallet.\nThis IS NOT a trade or transaction.\n\nTimestamp: {self.expires.strftime('%s')}\nOne-Time Code: {str(self.public_id)[0:7]}"

        return "Hello from SocialPass!"
        signing_message_obj = {
            "You are accessing": self.event.title,
            "Hosted by": self.event.team.name,
            "One-Time Code": self.public_id,
            "Valid until": self.expires.ctime(),
        }
        signing_message = "\n".join(
            ": ".join((key, str(val))) for (key, val) in signing_message_obj.items()
        )
        return signing_message


class Ticket(DBModel):
    """
    List of all the tickets distributed by the respective Ticketed Event.
    """

    # basic info
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="tickets")
    # ticket file info
    filename = models.UUIDField(default=uuid.uuid4, editable=False)
    file = models.ImageField(null=True, storage=PrivateTicketStorage())
    embed_code = models.UUIDField(default=uuid.uuid4)
    # access info
    archived = models.BooleanField(default=False)
    redeemed = models.BooleanField(default=False)
    redeemed_at = models.DateTimeField(null=True, blank=True)
    redeemed_by = models.ForeignKey(
        RedemptionAccessKey, on_delete=models.SET_NULL, null=True, blank=True
    )
    # checkout info
    blockchain_ownership = models.ForeignKey(
        BlockchainOwnership,
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
