import math
from datetime import timedelta

from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.core.validators import MinValueValidator
from django.db import models
from django.shortcuts import reverse
from django.utils import timezone
from django.utils.crypto import get_random_string
from invitations import signals
from invitations.adapters import get_invitations_adapter
from invitations.base_invitation import AbstractBaseInvitation

from apps.root.model_field_choices import STIPE_PAYMENT_STATUSES
from apps.root.model_wrappers import DBModel


class Team(DBModel):
    """
    Umbrella team model for SocialPass customers
    """

    def get_default_pricing_rule_group():
        return PricingRuleGroup.objects.get(name="Default").pk

    # base info
    name = models.CharField(max_length=255)
    image = models.ImageField(
        null=True, blank=True, height_field=None, width_field=None, max_length=255
    )
    description = models.TextField(blank=True)
    members = models.ManyToManyField("root.User", through="dashboard.Membership")
    pricing_rule_group = models.ForeignKey(
        "PricingRuleGroup",
        on_delete=models.CASCADE,
        default=get_default_pricing_rule_group,
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
    user = models.ForeignKey(
        "root.User", on_delete=models.CASCADE, blank=True, null=True
    )

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
        invite_url = reverse(settings.INVITATIONS_CONFIRMATION_URL_NAME, args=[self.key])
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
        if self.team:
            return f"{self.team.name}-{self.email}"
        return self.email


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
    description = models.TextField(null=True, blank=True)

    @property
    def active_rules(self):
        return self.pricing_rules.filter(active=True)

    def __str__(self):
        return f"{self.name}"

    def __repr__(self):
        return f"Pricing Rule Group({self.name})"


class EventStripePayment(DBModel):
    """Registers a payment done for Event"""

    # TODO: This model could be more abstracted from the Event

    event = models.ForeignKey(
        "root.Event", on_delete=models.RESTRICT, related_name="payments"
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
