import os
import uuid
from datetime import datetime, timedelta
from enum import Enum

import boto3
from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.sites.shortcuts import get_current_site
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Q
from django.urls import reverse
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _
from django_fsm import FSMField, transition
from pytz import utc
from taggit.managers import TaggableManager

from apps.root.model_field_choices import (
    CHECKOUT_SESSION_STATUS,
    EVENT_VISIBILITY,
    PAYMENT_TYPES,
    TICKET_TYPES,
)
from apps.root.model_field_schemas import BLOCKCHAIN_REQUIREMENTS_SCHEMA
from apps.root.model_wrappers import DBModel
from apps.root.utilities.ticketing import AppleTicket, GoogleTicket, PDFTicket
from apps.root.validators import JSONSchemaValidator
from config.storages import get_private_ticket_storage


class User(AbstractUser):
    """
    Default custom user model for backend.
    """


class Team(DBModel):
    """
    Umbrella team model for SocialPass customers
    """

    # keys
    members = models.ManyToManyField("root.User", through="root.Membership", blank=False)

    # basic info
    name = models.CharField(max_length=255, blank=False)
    image = models.ImageField(
        height_field=None, width_field=None, max_length=255, blank=True, null=True
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
    Membership manager for users <> teams
    """

    class Meta:
        unique_together = ("team", "user")

    team = models.ForeignKey(Team, on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(
        "root.User", on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return f"{self.team.name}-{self.user.email}"


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


class Invite(DBModel):
    """
    Invite model used for team invitations
    """

    # Queryset manager
    objects = InviteQuerySet.as_manager()

    # invitation fields
    accepted = models.BooleanField(
        verbose_name=_("accepted"), default=False, blank=False, null=False
    )
    key = models.CharField(
        verbose_name=_("key"), max_length=64, unique=True, blank=False
    )
    sent = models.DateTimeField(verbose_name=_("sent"), blank=False, null=True)
    inviter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )

    email = models.EmailField(
        unique=True,
        verbose_name="e-mail address",
        max_length=254,
        blank=False,
        null=False,
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
        LIVE = "Live"

    # Queryset manager
    objects = EventQuerySet.as_manager()

    # state
    state = FSMField(
        default=StateEnum.DRAFT.value, protected=True, blank=False, null=False
    )

    # Keys
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=False, null=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, blank=False, null=False)

    # Publish info
    is_featured = models.BooleanField(default=False, blank=False, null=False)
    publication_date = models.DateTimeField(
        default=timezone.now,
        help_text="When your event will be made public.",
        blank=True,
        null=True,
    )
    visibility = models.CharField(
        max_length=50,
        choices=EVENT_VISIBILITY,
        default=EVENT_VISIBILITY[0][0],
        help_text="Whether or not your event is searchable by the public.",
        blank=False,
    )
    show_ticket_count = models.BooleanField(
        default=True,
        help_text="Whether or not your event displays ticket statistics.",
        blank=False,
        null=False,
    )
    show_team_image = models.BooleanField(
        default=True,
        help_text="Whether or not your event displays the team image.",
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
        blank=True,
        default="",
    )
    description = models.TextField(
        help_text="A short description of your event.",
        blank=True,
        default="",
    )
    cover_image = models.ImageField(
        help_text="A banner image for your event.", blank=True, null=True
    )
    tags = TaggableManager(
        blank=True,
    )
    start_date = models.DateTimeField(
        help_text="When your event will start.",
        blank=True,
        null=True,
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
        blank=True,
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
    # TODO localized_multi_line_address_display

    # Ticket Info
    # TODO: Move these to TicketType
    requirements = models.JSONField(
        default=list,
        validators=[JSONSchemaValidator(limit_value=BLOCKCHAIN_REQUIREMENTS_SCHEMA)],
        blank=True,
        null=False,
    )
    capacity = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        help_text="Maximum amount of attendees for your event.",
        blank=True,
        null=False,
    )
    limit_per_person = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        help_text="Maximum amount of tickets per attendee.",
        blank=False,
        null=False,
    )
    google_class_id = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return f"{self.team} - {self.title}"

    def get_absolute_url(self):
        if self.state == Event.StateEnum.DRAFT.value:
            _success_url = "dashboard:event_update"
        elif self.state == Event.StateEnum.LIVE.value:
            _success_url = "dashboard:event_detail"
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
            raise e

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
            raise e

    @transition(field=state, target=StateEnum.DRAFT.value)
    def _transition_draft(self):
        """
        This function handles state transition to DRAFT
        Side effects include
        -
        """
        pass

    @transition(field=state, target=StateEnum.LIVE.value)
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

    @staticmethod
    def required_form_fields():
        fields = [
            "title",
            "organizer",
            "description",
            "visibility",
            "initial_place",
            "start_date",
            "capacity",
            "timezone",
            "limit_per_person",
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


class Ticket(DBModel):
    """
    List of all the tickets distributed by the respective Ticketed Event.
    """

    # Keys
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="tickets", blank=False, null=False
    )

    # Ticket File Info
    filename = models.UUIDField(
        default=uuid.uuid4, editable=False, blank=False, null=False
    )
    file = models.ImageField(storage=get_private_ticket_storage, blank=False, null=True)
    embed_code = models.UUIDField(default=uuid.uuid4, blank=False, null=False)

    # Ticket access info
    archived = models.BooleanField(default=False, blank=False, null=False)
    redeemed = models.BooleanField(default=False, blank=False, null=False)
    redeemed_at = models.DateTimeField(blank=True, null=True)
    redeemed_by = models.ForeignKey(
        "TicketRedemptionKey", on_delete=models.SET_NULL, blank=True, null=True
    )
    google_class_id = models.CharField(max_length=255, blank=True, default="")

    # blockchain Info
    blockchain_ownership = models.ForeignKey(
        "BlockchainOwnership",
        on_delete=models.SET_NULL,
        related_name="tickets",
        blank=False,
        null=True,
    )
    blockchain_asset = models.JSONField(blank=False, null=True)

    def __str__(self):
        return f"Ticket List (Ticketed Event: {self.event.title})"

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
        Event,
        on_delete=models.CASCADE,
        related_name="ticket_redemption_keys",
        blank=False,
        null=False,
    )

    # Basic info
    name = models.CharField(max_length=255, default="Default", blank=False, null=False)

    @property
    def scanner_url(self):
        return f"{settings.SCANNER_BASE_URL}/{self.public_id}"


class BlockchainOwnership(DBModel):
    """
    Stores details used to verify blockchain ownership in exchange for tickets
    """

    def set_expires():  # type: ignore
        return datetime.utcnow().replace(tzinfo=utc) + timedelta(minutes=30)

    # Keys
    event = models.ForeignKey(Event, on_delete=models.CASCADE, blank=False, null=False)

    # Basic info
    wallet_address = models.CharField(max_length=400, blank=False, null=False)
    is_verified = models.BooleanField(default=False, blank=False, null=False)
    expires = models.DateTimeField(default=set_expires, blank=False, null=False)

    def __str__(self):
        return str(self.wallet_address)

    @property
    def is_expired(self):
        return self.expires < (datetime.utcnow().replace(tzinfo=utc))

    @property
    def signing_message(self):
        return (
            "Greetings from SocialPass."
            "\nSign this message to prove ownership"
            "\n\nThis IS NOT a trade or transaction"
            f"\n\nTimestamp: {self.expires.strftime('%s')}"
            f"\nOne-Time Code: {str(self.public_id)[0:7]}"
        )


class TicketTier(DBModel):

    # specific fields
    ticket_type = models.CharField(
        max_length=50,
        choices=TICKET_TYPES,
        default=TICKET_TYPES[0][0],
        blank=False,
    )
    price = models.DecimalField(
        max_digits=9,
        validators=[MinValueValidator(0)],
        decimal_places=9,
        blank=False,
        null=True,
    )
    capacity = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        help_text="Maximum amount of attendees for your event.",
        blank=True,
        null=False,
    )  # MIGRATE FROM EVENT
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
    )  # MIGRATE FROM EVENT (limit_per_person)

    # keys
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="ticket_tiers",
        blank=False,
        null=False,
    )  # MIGRATE FROM TICKET

    class Meta:
        abstract = True

    def __str__(self):
        """
        return string representation of model
        """
        return f"TicketTier {self.ticket_type}-{self.public_id}"


class TicketTierPaymentType(DBModel):

    # specific fields
    payment_type = models.CharField(
        max_length=50,
        choices=PAYMENT_TYPES,
        default=PAYMENT_TYPES[0][0],
        help_text="The payment method",
        blank=False,
    )

    # keys
    ticket_tier = models.ForeignKey(
        TicketTier,
        on_delete=models.CASCADE,
        related_name="tier_payment_types",
        blank=False,
        null=False,
    )

    class Meta:
        abstract = True

    def __str__(self):
        """
        return string representation of model
        """
        return f"TicketTierPaymentType {self.payment_type}-{self.public_id}"


class CheckoutSession(DBModel):

    # specific fields
    expiration = models.DateTimeField(help_text="...", blank=True, null=True)
    name = models.CharField(max_length=255, blank=False)
    email = models.CharField(max_length=255, blank=False)
    cost = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        blank=True,
        null=False,
    )
    status = models.CharField(
        max_length=50,
        choices=CHECKOUT_SESSION_STATUS,
        default=CHECKOUT_SESSION_STATUS[0][0],
        blank=False,
    )

    # keys
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="checkout_sessions",
        blank=False,
        null=False,
    )

    class Meta:
        abstract = True

    def __str__(self):
        """
        return string representation of model
        """
        return self.name


class CheckoutItem(DBModel):

    # specific fields
    quantity = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        blank=True,
        null=False,
    )

    # keys
    ticket_tier = models.ForeignKey(
        TicketTier,
        on_delete=models.CASCADE,
        related_name="checkout_items",
        blank=False,
        null=False,
    )
    checkout_session = models.ForeignKey(
        CheckoutSession,
        on_delete=models.CASCADE,
        related_name="checkout_items",
        blank=False,
        null=False,
    )

    class Meta:
        abstract = True

    def __str__(self):
        """
        return string representation of model
        """
        return f"CheckoutItem {self.public_id}"


class FiatTx(DBModel):

    # keys
    checkout_session = models.ForeignKey(
        CheckoutSession,
        on_delete=models.CASCADE,
        related_name="fiat_transactions",
        blank=False,
        null=False,
    )

    class Meta:
        abstract = True

    def __str__(self) -> str:
        """
        return string representation of model
        """
        return f"FiatTx {self.public_id}"


class BlockchainTx(DBModel):

    # keys
    checkout_session = models.ForeignKey(
        CheckoutSession,
        on_delete=models.CASCADE,
        related_name="blockchain_transactions",
        blank=False,
        null=False,
    )

    class Meta:
        abstract = True

    def __str__(self) -> str:
        """
        return string representation of model
        """
        return f"BlockchainTx {self.public_id}"


class AssetOwnershipTx(DBModel):

    # keys
    checkout_session = models.ForeignKey(
        CheckoutSession,
        on_delete=models.CASCADE,
        related_name="assetownership_transactions",
        blank=False,
        null=False,
    )

    class Meta:
        abstract = True

    def __str__(self) -> str:
        """
        return string representation of model
        """
        return f"AssetOwnershipTx {self.public_id}"
