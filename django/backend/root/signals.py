from invitations.signals import invite_accepted
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from root.models import Membership, Invite

User = get_user_model()

@receiver(invite_accepted)
def invite_callback(sender, **kwargs):
    """
    Create membership to team on invite
    """
    invite = Invite.objects.filter(email=kwargs['email']).last()
    user = User.objects.get(email=kwargs['email'])
    Membership.objects.create(team=invite.team, user=user)
    return print("Membership created")
