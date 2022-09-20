from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings


class InviteAdapter(DefaultAccountAdapter):
    """custom adapter to set site as only open for invites by now"""

    def is_open_for_signup(self, request):
        if hasattr(request, "session") and request.session.get(
            "account_verified_email",
        ):
            return True
        elif settings.INVITATIONS_INVITATION_ONLY is True:
            # Site is ONLY open for invites
            return False
        else:
            # Site is open to signup
            return True
