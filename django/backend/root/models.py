import uuid
from datetime import datetime, timedelta

from eth_account.messages import encode_defunct
from invitations.adapters import get_invitations_adapter
from invitations.models import Invitation
from invitations.signals import invite_url_sent
from model_utils.models import TimeStampedModel
from pytz import utc
from web3.auto import w3

from django.contrib.sites.models import Site
from django.contrib.auth.models import AbstractUser, UserManager
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone
from django.shortcuts import reverse

from .model_field_choices import ASSET_TYPES, BLOCKCHAINS, TOKENGATE_TYPES
from .model_field_schemas import (
    REQUIREMENTS_SCHEMA,
    REQUIREMENTS_SCHEMA_REQUIRED,
    SOFTWARE_TYPES_SCHEMA,
)
from .validators import JSONSchemaValidator


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

    def __str__(self):
        return self.name


class Membership(DBModel):
    """
    Membership manager for users <> teams
    """

    team = models.ForeignKey(Team, on_delete=models.SET_NULL, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    objects = CustomMembershipManager()

    class Meta:
        unique_together = ("team", "user")

class InvitationAbstract(Invitation):
    class Meta:
        abstract = True

class Invite(InvitationAbstract):
    """
    Custom invite model inherited from beekeper invtations

    Includes team on create
    """
    team = models.ForeignKey(Team, on_delete=models.CASCADE, blank=True, null=True)
    archived_email = models.EmailField(blank=True, null=True)
    def send_invitation(self, request, **kwargs):
        current_site = kwargs.pop('site', Site.objects.get_current())
        invite_url = reverse('accept_invite',
                             args=[self.key])
        invite_url = request.build_absolute_uri(invite_url)
        ctx = kwargs
        ctx.update({
            'invite_url': invite_url,
            'site_name': current_site.name,
            'email': self.email,
            'key': self.key,
            'inviter': self.inviter,
        })

        email_template = 'invitations/email/email_invite'

        get_invitations_adapter().send_mail(
            email_template,
            self.email,
            ctx)
        self.sent = timezone.now()
        self.save()

        invite_url_sent.send(
            sender=self.__class__,
            instance=self,
            invite_url_sent=invite_url,
            inviter=self.inviter)

class TokenGate(DBModel):
    """
    Base token gate model meant to be extended by the other types of gates in
    the system. Allows for field reuse, simpler grouped querying, and clearer
    transparency on important shared data.

    Please note, this model should NOT be abstract so that other tables are
    able reference this table directly using foreign keys.
    """

    public_id = models.CharField(
        max_length=64, editable=False, unique=True, db_index=True
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tokengates")
    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, blank=True, related_name="tokengates"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    general_type = models.CharField(max_length=50, choices=TOKENGATE_TYPES)

    def __str__(self):
        return self.title

    def generate_public_id(self):
        import secrets

        return f"{self.general_type}_{secrets.token_urlsafe(32)}"

    def generate_signature_request(self):
        """
        generate one-time Signature model to be consumed and signed by the client for verification
        returns unique code (for lookup) and message (for signature)
        """
        expires = datetime.utcnow().replace(tzinfo=utc) + timedelta(minutes=30)
        message_obj = {
            "You are accessing": self.title,
            "Hosted by": self.team.name,
            "Hosted at": "https://...",
            "Valid until": expires.ctime(),
        }
        message = "\n".join(": ".join((key, val)) for (key, val) in message_obj.items())
        signature = Signature.objects.create(
            tokengate=self,
            signing_message=message,
            expires=expires,
        )
        return {
            "id": signature.unique_code,
            "message": signature.signing_message,
        }

    def save(self, *args, **kwargs):
        """
        overriden to set public_id
        """
        if not self.public_id:
            self.public_id = self.generate_public_id()
        super(TokenGate, self).save(*args, **kwargs)


class Signature(DBModel):
    """
    Stores details used to verify wallets.
    """

    unique_code = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tokengate = models.ForeignKey(
        TokenGate, on_delete=models.CASCADE, related_name="signatures"
    )
    signing_message = models.CharField(max_length=1024)
    wallet_address = models.CharField(max_length=400)
    is_verified = models.BooleanField(default=False)
    expires = models.DateTimeField()

    def __str__(self):
        return str(self.unique_code)

    def validate(self, signed_message="", address="", tokengate_id=""):
        """
        Reusable method to validate a given signature
        """

        # 401 section: User has not provided invalid authentication details
        # check if already verified
        if self.is_verified:
            return False, 401, "Signature message already verified."

        # check if expired
        if self.expires < (datetime.utcnow().replace(tzinfo=utc)):
            return False, 401, f"Signature request expired at {self.expires}"

        # check for id mismatch
        if self.tokengate.public_id != tokengate_id:
            return False, 401, "Signature x TokenGate ID mismatch."

        # check if address matches recovered address
        _msg = encode_defunct(text=self.signing_message)
        _recovered = w3.eth.account.recover_message(_msg, signature=signed_message)
        print(_recovered)
        if _recovered != address:
            return False, 401, "Signature x Address mismatch."

        # 403 section: User has authenticated, but does not meet requirements
        # check if address meets requirements

        # 200 section: User has authenticated and met requirements
        # before success, mark as verified, update address, and save
        # self.is_verified = True
        # self.wallet_address = _recovered
        self.save()

        return True, 200, "Success"


class AirdropGate(TokenGate):
    """
    Stores an Airdrop type token gate.
    """

    chain = models.CharField(max_length=50, choices=BLOCKCHAINS)
    asset_type = models.CharField(max_length=50, choices=ASSET_TYPES)
    asset_address = models.CharField(max_length=400)
    amount_per_person = models.IntegerField(validators=[MinValueValidator(1)])
    total_amount = models.IntegerField(validators=[MinValueValidator(1)])
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    requirements = models.JSONField(
        default=list,
        blank=True,
        null=True,
        validators=[JSONSchemaValidator(limit_value=REQUIREMENTS_SCHEMA)],
    )


class Airdrop(DBModel):
    """
    List of all the airdrops distributed by the respective Airdrop token gates.
    """

    tokengate = models.ForeignKey(
        AirdropGate, on_delete=models.CASCADE, related_name="airdrops"
    )
    signature = models.ForeignKey(
        Signature, on_delete=models.SET_NULL, related_name="airdrops", null=True
    )
    wallet_address = models.CharField(max_length=400)
    transaction_hash = models.CharField(max_length=400)

    def __str__(self):
        return f"Airdrop List (Token Gate: {self.tokengate.title})"


class TicketGate(TokenGate):
    """
    Stores an Ticket type token gate.
    """

    date = models.DateTimeField()
    location = models.CharField(max_length=1024)
    capacity = models.IntegerField(validators=[MinValueValidator(1)])
    deadline = models.DateTimeField()
    requirements = models.JSONField(
        default=list,
        validators=[JSONSchemaValidator(limit_value=REQUIREMENTS_SCHEMA_REQUIRED)],
    )


class Ticket(DBModel):
    """
    List of all the tickets distributed by the respective Ticket token gates.
    """

    tokengate = models.ForeignKey(
        TicketGate, on_delete=models.CASCADE, related_name="tickets"
    )
    signature = models.ForeignKey(
        Signature, on_delete=models.SET_NULL, related_name="tickets", null=True
    )
    wallet_address = models.CharField(max_length=400)
    ticket_url = models.URLField()

    def __str__(self):
        return f"Ticket List (Token Gate: {self.tokengate.title})"
