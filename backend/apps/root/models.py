import math
import secrets
import uuid
from datetime import datetime, timedelta
from invitations.models import Invitation

from django.contrib.auth.models import AbstractUser, UserManager
from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import models
from model_utils.models import TimeStampedModel
from polymorphic.models import PolymorphicModel
from pytz import utc

from .model_field_choices import TOKENGATE_TYPES, STIPE_PAYMENT_STATUSES
from .model_field_schemas import REQUIREMENTS_SCHEMA, REQUIREMENT_SCHEMA, SOFTWARE_TYPES_SCHEMA
from .validators import JSONSchemaValidator
from apps.gates import Ticketing


class CustomUserManager(UserManager):
    """
    Prefetch members for user
    """

    def get(self, *args, **kwargs):
        return super().prefetch_related("membership_set").get(*args, **kwargs)


class CustomMembershipManager(models.Manager):
    """
    Prefetch teams for members
    """

    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).prefetch_related("team")


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

    objects = CustomUserManager()


class Team(DBModel):
    """
    Team manager for software plans && token gates
    """

    # base info
    name = models.CharField(max_length=255)
    image = models.ImageField(
        null=True, blank=True, height_field=None, width_field=None, max_length=255
    )
    details = models.TextField(blank=True)
    software_types = models.JSONField(
        default=list,
        validators=[JSONSchemaValidator(limit_value=SOFTWARE_TYPES_SCHEMA)],
    )
    members = models.ManyToManyField(User, through="Membership")
    subdomain = models.CharField(
        max_length=256,
        null=True,
        unique=True,
        validators=[
            RegexValidator(
                r"^[0-9a-zA-Z]*$", message="Subdomain only allows alphanumeric"
            )
        ],
    )
    pricing_rule_group = models.ForeignKey(
        "PricingRuleGroup",
        on_delete=models.CASCADE,
        null=True,
        blank=True
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
    objects = CustomMembershipManager()

    class Meta:
        unique_together = ("team", "user")

    def __str__(self):
        """
        return string representation of model
        """
        return f"{self.team.name}-{self.user.email}"


class Invite(Invitation):
    """
    Custom invite model inherited from beekeper invtations

    Includes team on create
    """

    team = models.ForeignKey(Team, on_delete=models.CASCADE, blank=True, null=True)
    archived_email = models.EmailField(blank=True, null=True)

    def send_invitation(self, request, **kwargs):
        """
        custom send_invitation method for adding team to kwargs
        """
        # set custom kwargs for template
        kwargs = {"team": self.team}
        return super(Invite, self).send_invitation(request, **kwargs)

    def __str__(self):
        """
        return string representation of model
        """
        return f"{self.team.name}-{self.email}"


class TokenGate(DBModel, PolymorphicModel):
    """
    Base token gate model meant to be extended by the other types of gates in
    the system. Allows for field reuse, simpler grouped querying, and clearer
    transparency on important shared data.

    Please note, this model should NOT be abstract so that other tables are
    able reference this table directly using foreign keys.
    """

    public_id = models.UUIDField(
        max_length=64, default=uuid.uuid4, editable=False, unique=True, db_index=True
    )
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="tokengates"
    )
    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, blank=True, related_name="tokengates"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    general_type = models.CharField(max_length=50, choices=TOKENGATE_TYPES)
    requirements = models.JSONField(
        default=list,
        blank=True,
        null=True,
        validators=[JSONSchemaValidator(limit_value=REQUIREMENTS_SCHEMA)],
    )
    limit_per_person = models.IntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(100)]
    )
    featured = models.BooleanField(default=False)

    def __str__(self):
        """
        return string representation of model
        """
        return self.title


class Signature(DBModel):
    """
    Stores details used to verify wallets.
    """

    def set_expires():
        return datetime.utcnow().replace(tzinfo=utc) + timedelta(minutes=30)

    unique_code = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tokengate = models.ForeignKey(
        TokenGate, on_delete=models.CASCADE, related_name="signatures"
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

    def save(self, *args, **kwargs):
        """
        override save to set signing message (aggregate from other fields)
        """
        if not self.signing_message:
            signing_message_obj = {
                "You are accessing": self.tokengate.title,
                "Hosted by": self.tokengate.team.name,
                "One-Time Code": self.unique_code,
                "Valid until": self.expires.ctime(),
                "Version": self.version,
            }
            signing_message = "\n".join(
                ": ".join((key, str(val))) for (key, val) in signing_message_obj.items()
            )
            self.signing_message = signing_message
        super().save(*args, **kwargs)


class TicketGate(TokenGate):
    """
    Stores a Ticket type token gate.
    """

    def set_scanner_code():
        return secrets.token_urlsafe(256)

    date = models.DateTimeField()
    timezone = models.CharField(
        null=True,
        verbose_name="time zone",
        max_length=30,
    )
    location = models.CharField(max_length=1024)
    capacity = models.IntegerField(validators=[MinValueValidator(1)])
    scanner_code = models.CharField(max_length=1024, default=set_scanner_code)
    price = models.DecimalField(
        validators=[MinValueValidator(0)], decimal_places=2, max_digits=10,
        null=True, blank=True, default=None
    )
    pricing_rule = models.ForeignKey(
        "PricingRule", null=True, blank=True, default=None,
        on_delete=models.RESTRICT  # Forbids pricing rules from being deleted
    )
    # TODO: add constraint so that price and pricing_rule should be set
    # together. Thus one can't be null if the other is not null.


class Ticket(DBModel):
    """
    List of all the tickets distributed by the respective Ticket token gates.
    """

    def set_embed_code():
        return secrets.token_urlsafe(256)

    filename = models.UUIDField(default=uuid.uuid4, editable=False)
    embed_code = models.CharField(max_length=1024, default=set_embed_code)
    tokengate = models.ForeignKey(
        TicketGate, on_delete=models.CASCADE, related_name="tickets"
    )
    signature = models.ForeignKey(
        Signature, on_delete=models.SET_NULL, related_name="tickets", null=True
    )
    wallet_address = models.CharField(max_length=400)
    requirement = models.JSONField(
        blank=True,
        null=True,
        validators=[JSONSchemaValidator(limit_value=REQUIREMENT_SCHEMA)],
    )
    option = models.JSONField(blank=True, null=True)
    image = models.ImageField(
        null=True, blank=True, height_field=None, width_field=None, max_length=255
    )
    temporary_download_url = models.TextField(null=True, blank=True)
    redeemed = models.BooleanField(default=False)

    def __str__(self):
        return f"Ticket List (Token Gate: {self.tokengate.title})"

    def populate_data(self, **kwargs):
        """
        method to populate necessary ticketdata on creation
        """
        # set signature
        if not self.signature:
            self.signature = kwargs['signature']

        # create ticket image
        if not self.image:
            Ticketing.Utilities.create_ticket_store_s3(
                event_data={
                    "event_name": self.tokengate.title,
                    "event_date": self.tokengate.date.strftime("%m/%d/%Y, %H:%M:%S"),
                    "event_location": self.tokengate.location,
                },
                filename=self.filename,
                embed=f"{self.embed_code}/{self.filename}",
                top_banner_text="SocialPass Ticket",
            )
            self.image = f"tickets/{str(self.filename)}.png"
        # set download url (always)
        self.temporary_download_url = Ticketing.Utilities.fetch_ticket_download_url(ticket=self)
        self.save()


class PricingRule(DBModel):
    """Maps a capacity to a price per capacity"""
    min_capacity = models.IntegerField(validators=[MinValueValidator(1)])
    max_capacity = models.IntegerField(null=True, blank=True)
    price_per_ticket = models.FloatField(validators=[MinValueValidator(0)])
    active = models.BooleanField(default=True)
    group = models.ForeignKey(
        "PricingRuleGroup", related_name="pricing_rules",
        on_delete=models.CASCADE  # if group is deleted, delete all rules
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
        return f"{self.group.name} ({self.min_capacity} - {self.max_capacity} | $ {self.price_per_ticket})" # noqa

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


class TokenGateStripePayment(DBModel):
    """Registers a payment done for TokenGate"""
    # TODO: This model could be more abstracted from the TokenGate

    token_gate = models.ForeignKey(
        TokenGate, on_delete=models.RESTRICT, related_name="payments"
    )
    value = models.FloatField(validators=[MinValueValidator(0)])
    status = models.CharField(choices=STIPE_PAYMENT_STATUSES, max_length=30, default="PENDING")
    stripe_checkout_session_id = models.CharField(max_length=1024)
    callaback_timestamp = models.DateTimeField(null=True, blank=True)
    acknowledgement_timestamp = models.DateTimeField(null=True, blank=True)
