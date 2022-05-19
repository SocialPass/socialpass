import secrets

from allauth.account.signals import user_logged_in
from django.contrib.auth import get_user_model
from django.dispatch import receiver

from apps.root.models import Invite, Membership

User = get_user_model()


@receiver(user_logged_in)
def login_membership_callback(request, user, **kwargs):
    """
    Upon login, check for a recently-accepted invitation
    If invite exists, create a membership to that team
    """
    # Check for accepted invites without membership
    invites = Invite.objects.filter(email__iexact=user.email, accepted=True, membership=None)

    # Create membership based on invites witout membership
    for invite in invites:
        membership, created = Membership.objects.get_or_create(team=invite.team, user=user)

        # update invite (add membership, archive email address, entire instance could be deleted instead)
        invite.membership = membership
        invite.archived_email = invite.email
        invite.email = f"{secrets.token_urlsafe(12)}{invite.archived_email}"
        invite.save()
