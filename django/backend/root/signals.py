from allauth.account.signals import user_signed_up
from invitations.signals import invite_accepted
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from root.models import Membership, Invite
import secrets

User = get_user_model()

@receiver(invite_accepted)
def invite_callback(sender, **kwargs):
    """
    Try to create membership to team on invite accepted.
    Handles case where user already has account
    """
    try:
        print('invite_callback')
        # create membership
        invite = Invite.objects.filter(email__iexact=kwargs['email']).last()
        user = User.objects.get(email__iexact=kwargs['email'])
        Membership.objects.get_or_create(team=invite.team, user=user)

        # update invite (archive email address, entire instance could be deleted instead)
        invite.archived_email = invite.email
        invite.email = f"{secrets.token_urlsafe(12)}{invite.archived_email}"
        invite.save()
        return 'created'
    except Exception as e:
        print(e)
        return 'not created'

@receiver(user_signed_up)
def signup_callback(request, user, **kwargs):
    """
    Try to create membership(s) to team on signup for all accepted invites.
    Handles case where user already has just signed up
    """
    try:
        print('signup_callback')
        # create membership
        invite = Invite.objects.filter(email__iexact=user.email, accepted=True).last()
        Membership.objects.get_or_create(team=invite.team, user=user)

        # update invite (archive email address, entire instance could be deleted instead)
        invite.archived_email = invite.email
        invite.email = f"{secrets.token_urlsafe(12)}{invite.archived_email}"
        invite.save()
        return 'created'
    except Exception as e:
        print(e)
        return 'not created'

