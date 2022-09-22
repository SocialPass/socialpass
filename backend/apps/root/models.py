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

from apps.root.model_field_choices import EVENT_VISIBILITY
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
    members = models.ManyToManyField("root.User", through="root.Membership")

    # basic info
    name = models.CharField(max_length=255)
    image = models.ImageField(
        null=True, blank=True, height_field=None, width_field=None, max_length=255
    )
    description = models.TextField(blank=True)
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
    accepted = models.BooleanField(verbose_name=_("accepted"), default=False)
    key = models.CharField(verbose_name=_("key"), max_length=64, unique=True)
    sent = models.DateTimeField(verbose_name=_("sent"), null=True)
    inviter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )

    email = models.EmailField(
        unique=True,
        verbose_name="e-mail address",
        max_length=254,
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
        invite_url = reverse("team_accept_invite", args=[self.key])
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
    # TODO localized_multi_line_address_display

    # Ticket Info
    # TODO: Move these to TicketType
    requirements = models.JSONField(
        blank=True,
        default=list,
        validators=[JSONSchemaValidator(limit_value=BLOCKCHAIN_REQUIREMENTS_SCHEMA)],
    )
    capacity = models.IntegerField(
        blank=True,
        default=1,
        validators=[MinValueValidator(1)],
        help_text="Maximum amount of attendees for your event.",
    )
    limit_per_person = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        help_text="Maximum amount of tickets per attendee.",
    )
    google_class_id = models.CharField(max_length=255, blank=True, null=True)

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
    google_class_id = models.CharField(max_length=255, blank=True, null=True)

    # blockchain Info
    blockchain_ownership = models.ForeignKey(
        "BlockchainOwnership",
        on_delete=models.SET_NULL,
        related_name="tickets",
        null=True,
    )
    blockchain_asset = models.JSONField(null=True)

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

    def set_expires():  # type: ignore
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
            "Greetings from SocialPass."
            "\nSign this message to prove ownership"
            "\n\nThis IS NOT a trade or transaction"
            f"\n\nTimestamp: {self.expires.strftime('%s')}"
            f"\nOne-Time Code: {str(self.public_id)[0:7]}"
        )
