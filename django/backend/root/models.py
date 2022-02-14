from django.contrib.auth.models import AbstractUser, UserManager
from django.core.validators import MinValueValidator
from django.db import models

from .model_field_choices import ASSET_TYPES, BLOCKCHAINS, TOKENGATE_TYPES
from .model_field_schemas import (
    REQUIREMENTS_SCHEMA,
    REQUIREMENTS_SCHEMA_REQUIRED,
    SOFTWARE_TYPES_SCHEMA,
)
from .validators import JSONSchemaValidator


class CustomUserManager(UserManager):
    """
    Select the team for users. Small optimization when using `request.user` in 
    the site views, especially the permission system.
    """

    def get(self, *args, **kwargs):
        return super().select_related("team").get(*args, **kwargs)


class DBModel(models.Model):
    """
    Abstract base model that provides useful timestamps.
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Team(DBModel):
    """
    Team manager for software plans && token gates
    """

    name = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    software_types = models.JSONField(
        default=list,
        validators=[JSONSchemaValidator(limit_value=SOFTWARE_TYPES_SCHEMA)],
    )

    def __str__(self):
        return self.name


class User(AbstractUser):
    """
    Default custom user model for backend.
    """
    team = models.ForeignKey(
        Team, on_delete=models.SET_NULL, blank=True, null=True, related_name="users"
    )

    objects = CustomUserManager()


class TokenGate(DBModel):
    """
    Base token gate model meant to be extended by the other types of gates in
    the system. Allows for field reuse, simpler grouped querying, and clearer
    transparency on important shared data.

    Please note, this model should NOT be abstract so that other tables are
    able reference this table directly using foreign keys.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tokengates")
    team = models.ForeignKey(Team, on_delete=models.CASCADE, blank=True, related_name="tokengates")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    general_type = models.CharField(max_length=50, choices=TOKENGATE_TYPES)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        """
        Method overridden to set the team.
        """

        self.team = self.user.team
        super(TokenGate, self).save(*args, **kwargs)


class Signature(DBModel):
    """
    Stores details used to verify wallets.
    """

    tokengate = models.ForeignKey(
        TokenGate, on_delete=models.CASCADE, related_name="signatures"
    )
    unique_code = models.CharField(max_length=400, unique=True)
    signing_message = models.CharField(max_length=400)
    wallet_address = models.CharField(max_length=400)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.unique_code


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


class AirdropList(DBModel):
    """
    List of all the airdrops distributed by the respective Airdrop token gates.
    """

    tokengate = models.ForeignKey(
        AirdropGate, on_delete=models.CASCADE, related_name="airdrop_lists"
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


class TicketList(DBModel):
    """
    List of all the tickets distributed by the respective Ticket token gates.
    """

    tokengate = models.ForeignKey(
        TicketGate, on_delete=models.CASCADE, related_name="ticket_lists"
    )
    wallet_address = models.CharField(max_length=400)
    ticket_url = models.URLField()
    token_id = models.IntegerField()

    def __str__(self):
        return f"Ticket List (Token Gate: {self.tokengate.title})"
