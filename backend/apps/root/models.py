import math
import uuid
from datetime import datetime, timedelta

import boto3
from django.conf import settings
from django.contrib.auth.models import AbstractUser, UserManager
from django.contrib.sites.shortcuts import get_current_site
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.shortcuts import reverse
from django.utils import timezone
from django.utils.crypto import get_random_string
from invitations import signals
from invitations.adapters import get_invitations_adapter
from invitations.base_invitation import AbstractBaseInvitation
from model_utils.models import TimeStampedModel
from pytz import utc

from .model_field_choices import STIPE_PAYMENT_STATUSES
from .model_field_schemas import BLOCKCHAIN_REQUIREMENTS_SCHEMA
from .validators import JSONSchemaValidator

# s3 client init
s3_client = boto3.client(
    "s3",
    region_name="nyc3",
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)


class CustomUserManager(UserManager):
    """
    Prefetch members for user
    """

    pass


class CustomMembershipManager(models.Manager):
    """
    Prefetch teams for members
    """

    pass


class DBModel(TimeStampedModel):
    """
    Abstract base model that provides useful timestamps.
    """

    class Meta:
        abstract = True


class User(AbstractUser):
    """
    Default custom user model for backend.
    """


class Team(DBModel):
    """
    Umbrella team model for SocialPass customers
    """

    # base info
    name = models.CharField(max_length=255)
    image = models.ImageField(
        null=True, blank=True, height_field=None, width_field=None, max_length=255
    )
    description = models.TextField(blank=True)
    members = models.ManyToManyField(User, through="Membership")
    pricing_rule_group = models.ForeignKey(
        "PricingRuleGroup", on_delete=models.CASCADE, null=True, blank=True
    )

    def __str__(self):
        """
        return string representation of model
        """
        return self.name


class Membership(DBModel):
    """
    Membership manager for users <> teams
    """

    team = models.ForeignKey(Team, on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        unique_together = ("team", "user")

    def __str__(self):
        """
        return string representation of model
        """
        return f"{self.team.name}-{self.user.email}"


class Invite(DBModel, AbstractBaseInvitation):
    """
    Custom invite inherited from django-invitations
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
        invite_url = reverse(
            settings.INVITATIONS_CONFIRMATION_URL_NAME, args=[self.key]
        )
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
        return f"{self.team.name}-{self.email}"


class TicketedEvent(DBModel):
    """
    Stores data for ticketed event
    """

    public_id = models.UUIDField(
        max_length=64, default=uuid.uuid4, editable=False, unique=True, db_index=True
    )
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
        "PricingRule",
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
    def has_pending_checkout(self):
        return self.payments.last().status in [None, "PENDING", "CANCELLED", "FAILURE"]

    @property
    def is_ticketing_open(self):
        return self.tickets.count() != self.capacity


class RedemptionAccessKey(DBModel):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticketed_event = models.ForeignKey(
        TicketedEvent, on_delete=models.CASCADE, related_name="redemption_access_keys"
    )
    # TODO in a near future, different ScannerKeyAccess
    # can give access to scanning diferent type of tickets.


class Signature(DBModel):
    """
    Stores details used to verify wallets for tickets
    """

    def set_expires():
        return datetime.utcnow().replace(tzinfo=utc) + timedelta(minutes=30)

    unique_code = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticketed_event = models.ForeignKey(
        TicketedEvent, on_delete=models.CASCADE, related_name="signatures"
    )
    signing_message = models.CharField(max_length=1024)
    wallet_address = models.CharField(max_length=400)
    is_verified = models.BooleanField(default=False)
    expires = models.DateTimeField(default=set_expires)
    version = models.IntegerField(default=1)

    def __str__(self):
        """
        return string representation of model
        """
        return str(self.unique_code)

    @property
    def signing_message(self):
        signing_message_obj = {
            "You are accessing": self.ticketed_event.title,
            "Hosted by": self.ticketed_event.team.name,
            "One-Time Code": self.unique_code,
            "Valid until": self.expires.ctime(),
            "Version": self.version,
        }
        signing_message = "\n".join(
            ": ".join((key, str(val))) for (key, val) in signing_message_obj.items()
        )
        return signing_message


class Ticket(DBModel):
    """
    List of all the tickets distributed by the respective Ticketed Event.
    """

    ticketed_event = models.ForeignKey(
        TicketedEvent, on_delete=models.CASCADE, related_name="tickets"
    )
    signature = models.ForeignKey(
        Signature, on_delete=models.SET_NULL, related_name="tickets", null=True
    )
    filename = models.UUIDField(default=uuid.uuid4, editable=False)
    embed_code = models.UUIDField(default=uuid.uuid4)
    redeemed = models.BooleanField(default=False)
    redeemed_at = models.DateTimeField(null=True, blank=True)
    redeemed_by = models.ForeignKey(
        RedemptionAccessKey, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return f"Ticket List (Ticketed Event: {self.ticketed_event.title})"

    @property
    def image_location(self):
        return f"{settings.AWS_TICKET_DIRECTORY}{self.filename}.png"

    @property
    def embed(self):
        return f"{self.embed_code}/{self.filename}"

    @property
    def temporary_download_url(self):
        # s3 client init
        return s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": f"{settings.AWS_STORAGE_BUCKET_NAME}",
                "Key": f"media/tickets/{str(self.filename)}.png",
            },
            ExpiresIn=3600,
        )


class PricingRule(DBModel):
    """Maps a capacity to a price per capacity"""

    min_capacity = models.IntegerField(validators=[MinValueValidator(1)])
    max_capacity = models.IntegerField(null=True, blank=True)
    price_per_ticket = models.DecimalField(
        validators=[MinValueValidator(0)], decimal_places=2, max_digits=10
    )
    active = models.BooleanField(default=True)
    group = models.ForeignKey(
        "PricingRuleGroup",
        related_name="pricing_rules",
        on_delete=models.CASCADE,  # if group is deleted, delete all rules
    )

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

    @property
    def safe_max_capacity(self) -> int:
        return math.inf if self.max_capacity is None else self.max_capacity

    def __str__(self):
        return f"{self.group.name} ({self.min_capacity} - {self.max_capacity} | $ {self.price_per_ticket})"  # noqa

    def __repr__(self):
        return f"PricingRule({self.min_capacity} - {self.max_capacity})"


class PricingRuleGroup(DBModel):
    name = models.CharField(max_length=100)

    @property
    def active_rules(self):
        return self.pricing_rules.filter(active=True)

    def __str__(self):
        return f"{self.name}"

    def __repr__(self):
        return f"Pricing Rule Group({self.name})"


class TicketedEventStripePayment(DBModel):
    """Registers a payment done for TicketedEvent"""

    # TODO: This model could be more abstracted from the TicketedEvent

    ticketed_event = models.ForeignKey(
        TicketedEvent, on_delete=models.RESTRICT, related_name="payments"
    )
    value = models.DecimalField(
        validators=[MinValueValidator(0)], decimal_places=2, max_digits=10
    )
    status = models.CharField(
        choices=STIPE_PAYMENT_STATUSES, max_length=30, default="PENDING"
    )
    stripe_checkout_session_id = models.CharField(max_length=1024)
    callaback_timestamp = models.DateTimeField(null=True, blank=True)
    acknowledgement_timestamp = models.DateTimeField(null=True, blank=True)
