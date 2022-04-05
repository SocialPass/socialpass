import uuid
from datetime import datetime, timedelta

import requests
from eth_account.messages import encode_defunct
from invitations.models import Invitation
from model_utils.models import TimeStampedModel
from polymorphic.models import PolymorphicModel
from pytz import utc
from web3.auto import w3

from django.conf import settings
from django.contrib.auth.models import AbstractUser, UserManager
from django.contrib.sites.models import Site
from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import models

from .model_field_choices import TOKENGATE_TYPES
from .model_field_schemas import REQUIREMENTS_SCHEMA, SOFTWARE_TYPES_SCHEMA
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

    # hosted page info
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

    def __str__(self):
        return self.name

    @staticmethod
    def get_by_domain(domain):
        # get subdomain
        pieces = domain.split(".")
        subdomain = ".".join(pieces[:-2])  # join all but primary domain

        # check if multiple subdomains; currently not supported
        if len(subdomain.split(".")) > 1:
            return None

        # compare against default site domain(s)
        default_domain = Site.objects.get(id=settings.SITE_ID)
        if domain in {default_domain.domain, "127.0.0.1:8000"}:
            return None

        # try to fetch related team
        try:
            team = Team.objects.get(subdomain=subdomain)
            return team
        except Exception:
            return None


class Membership(DBModel):
    """
    Membership manager for users <> teams
    """

    team = models.ForeignKey(Team, on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
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
        # set custom kwargs for template
        kwargs = {"team": self.team}
        return super(Invite, self).send_invitation(request, **kwargs)


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
        return self.title

    def generate_signature_request(self):
        """
        generate one-time Signature model
        """
        expires = datetime.utcnow().replace(tzinfo=utc) + timedelta(minutes=30)
        signature = Signature.objects.create(
            tokengate=self,
            expires=expires,
        )
        message_obj = {
            "You are accessing": self.title,
            "Hosted by": self.team.name,
            "One-Time Code": signature.unique_code,
            "Valid until": expires.ctime(),
            "Version": signature.version,
        }
        message = "\n".join(
            ": ".join((key, str(val))) for (key, val) in message_obj.items()
        )
        signature.signing_message = message
        signature.save()

        return {
            "id": signature.unique_code,
            "message": signature.signing_message,
        }

    def validate_requirements(self, *args, **kwargs):
        """
        method to validate requirements via the services api
        either returns 200 success for authenticated
        or 403 forbidden for unauthenticated
        """
        # note: exclude passes generated by wallet
        issued_passes = list(
            self.tickets.exclude(wallet_address=kwargs["wallet_address"]).values_list(
                "token_id", flat=True
            )
        )

        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
        }

        params = (
            ("wallet_address", kwargs["wallet_address"]),
            ("limit_per_person", self.limit_per_person),
        )

        json_data = {
            "reward_list": issued_passes,
            "requirements": self.requirements,
        }

        resp = requests.post(
            f"{settings.SERVICES_URL}/blockchain/verify-requirements",
            headers=headers,
            params=params,
            json=json_data,
        )

        # return tuple of (access:bool, status:int, msg:str)
        x = resp.json()
        if resp.status_code == 200:
            return True, 200, x
        else:
            return False, 403, x


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
    version = models.IntegerField(default=1)

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
        if _recovered != address:
            return False, 401, "Signature x Address mismatch."

        # 200 section: User has authenticated and met requirements
        # before success, mark as verified, update address, and save
        self.is_verified = True
        self.wallet_address = _recovered
        self.save()

        return True, 200, "Success"


class TicketGate(TokenGate):
    """
    Stores a Ticket type token gate.
    """

    date = models.DateTimeField()
    timezone = models.CharField(
        null=True,
        verbose_name="time zone",
        max_length=30,
    )
    location = models.CharField(max_length=1024)
    capacity = models.IntegerField(validators=[MinValueValidator(1)])


class Ticket(DBModel):
    """
    List of all the tickets distributed by the respective Ticket token gates.
    """

    filename = models.UUIDField(default=uuid.uuid4, editable=False)
    tokengate = models.ForeignKey(
        TicketGate, on_delete=models.CASCADE, related_name="tickets"
    )
    signature = models.ForeignKey(
        Signature, on_delete=models.SET_NULL, related_name="tickets", null=True
    )
    wallet_address = models.CharField(max_length=400)
    token_id = models.IntegerField(null=True, blank=True)
    image = models.ImageField(
        null=True, blank=True, height_field=None, width_field=None, max_length=255
    )
    temporary_download_url = models.TextField(null=True, blank=True)
    redeemed = models.BooleanField(default=False)

    def __str__(self):
        return f"Ticket List (Token Gate: {self.tokengate.title})"

    def generate_from_validated_passes(**kwargs):
        """
        Given a number of validated_passes, this method will generate
        a given number of tickets.
        """
        ticketdata = []

        # validated_passes as amount of passes
        if isinstance(kwargs["validated_passes"], int):
            for id in range(kwargs["validated_passes"]):
                ticket, created = Ticket.objects.get_or_create(
                    wallet_address=kwargs["wallet_address"],
                    tokengate=kwargs["tokengate"],
                )
                if not ticket.signature:
                    ticket.signature = kwargs["signature"]
                if not ticket.image:
                    ticket.generate_ticket_image(
                        filename=ticket.filename,
                        embed="testing embed",
                        top_banner_text="SocialPass Ticket",
                    )
                    ticket.image = f"tickets/{str(ticket.filename)}.png"
                ticket.temporary_download_url = ticket.generate_ticket_download_url()
                ticket.save()
                ticketdata.append(ticket.__dict__)

        # validated_passes as List of ID's
        if isinstance(kwargs["validated_passes"], list):
            for id in kwargs["validated_passes"]:
                ticket, created = Ticket.objects.get_or_create(
                    wallet_address=kwargs["wallet_address"],
                    tokengate=kwargs["tokengate"],
                    token_id=id,
                )
                if not ticket.signature:
                    ticket.signature = kwargs["signature"]
                if not ticket.image:
                    ticket.generate_ticket_image(
                        filename=ticket.filename,
                        embed="testing embed",
                        top_banner_text="SocialPass Ticket",
                    )
                    ticket.image = f"tickets/{str(ticket.filename)}.png"
                ticket.temporary_download_url = ticket.generate_ticket_download_url()
                ticket.save()
                ticketdata.append(ticket.__dict__)

        return ticketdata

    def generate_ticket_image(self, **kwargs):
        """
        method to generate ticket image via the services api
        """
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
        }

        params = (
            ("filename", kwargs["filename"]),
            ("embed", kwargs["embed"]),
            ("top_banner_text", kwargs["top_banner_text"]),
        )

        json_data = {
            "name": self.tokengate.title,
            "date": self.tokengate.date.strftime("%m/%d/%Y, %H:%M:%S"),
            "location": self.tokengate.location,
        }

        resp = requests.post(
            f"{settings.SERVICES_URL}/ticketing/generate-ticket-image",
            headers=headers,
            params=params,
            json=json_data,
        )
        return resp.json()

    def generate_ticket_download_url(self):
        import boto3

        # s3 client init
        s3 = boto3.client(
            "s3",
            region_name="nyc3",
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )

        # generate presigned url
        url = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": f"{settings.AWS_STORAGE_BUCKET_NAME}",
                "Key": f"media/tickets/{str(self.filename)}.png",
            },
            ExpiresIn=3600,
        )
        return url
