from apps.dashboard.models import Invite
from invitations.exceptions import AlreadyAccepted, AlreadyInvited
from invitations.forms import InvitationAdminAddForm


class CustomInvitationAdminAddForm(InvitationAdminAddForm):
    class Meta:
        model = Invite
        fields = ("email", "inviter", "team")

    def validate_invitation(self, email):
        """
        sub-classed validation to remove check for active user
        """
        if Invite.objects.all_valid().filter(email__iexact=email, accepted=False):
            raise AlreadyInvited
        elif Invite.objects.filter(email__iexact=email, accepted=True):
            raise AlreadyAccepted
        else:
            return True

    def save(self, *args, **kwargs):
        cleaned_data = super(InvitationAdminAddForm, self).clean()
        email = cleaned_data.get("email")
        params = {"email": email}
        if cleaned_data.get("inviter"):
            params["inviter"] = cleaned_data.get("inviter")
            if cleaned_data.get("team"):
                params["team"] = cleaned_data.get("team")
            instance = Invite.create(**params)
            instance.send_invitation(self.request)
            super(InvitationAdminAddForm, self).save(*args, **kwargs)
            return instance
