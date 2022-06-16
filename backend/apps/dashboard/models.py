from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.db import models
from django.shortcuts import reverse
from django.utils import timezone
from django.utils.crypto import get_random_string
from invitations import signals
from invitations.adapters import get_invitations_adapter
from invitations.base_invitation import AbstractBaseInvitation

from apps.root.models import DBModel, Team

User = get_user_model()


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
        if self.team:
            return f"{self.team.name}-{self.email}"
        return self.email
