import secrets

from allauth.account.signals import user_signed_up
from django.contrib.auth import get_user_model
from django.dispatch import receiver

from apps.root.models import Invite, Membership

User = get_user_model()


@receiver(user_signed_up)
def new_user_invitation_callback(request, user, **kwargs):
    """
    Handle NEW user invitation flow
    Upon signup, check for a recently-accepted invitation and create memberships
    """
    # Check for accepted invites without membership
    invites = Invite.objects.filter(
        email__iexact=user.email, accepted=True, membership=None
    )

    # Create membership based on invites witout membership
    for invite in invites:
        if invite.team:
            membership, created = Membership.objects.get_or_create(
                team=invite.team, user=user
            )
            # update invite membership if created
            invite.membership = membership
        # update other info
        invite.archived_email = invite.email
        invite.email = f"{secrets.token_urlsafe(12)}{invite.archived_email}"
        invite.save()
