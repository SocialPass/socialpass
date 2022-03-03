from django import forms
from invitations.forms import InvitationAdminAddForm, InviteForm
from root.models import Team, Invite

class TeamForm(forms.ModelForm):
    """
    Allows team information to be updated.
    """

    class Meta:
        model = Team
        exclude = [
            "software_types",
        ]

class CustomInviteForm(InviteForm):
    def validate_invitation(self, email):
        """
        sub-classed validation to remove check for active user
        """
        if Invite.objects.all_valid().filter(
                email__iexact=email, accepted=False):
            raise self.AlreadyInvited
        elif Invite.objects.filter(
                email__iexact=email, accepted=True):
            raise self.AlreadyAccepted
        else:
            return True


class CustomInvitationAdminAddForm(InvitationAdminAddForm):
    def save(self, *args, **kwargs):
        instance = super(CustomInvitationAdminAddForm, self).save(*args, **kwargs)
        cleaned_data = super(CustomInvitationAdminAddForm, self).clean()
        instance.team = cleaned_data.get("team")
        return instance

    def validate_invitation(self, email):
        """
        sub-classed validation to remove check for active user
        """
        if Invite.objects.all_valid().filter(
                email__iexact=email, accepted=False):
            raise self.AlreadyInvited
        elif Invite.objects.filter(
                email__iexact=email, accepted=True):
            raise self.AlreadyAccepted
        else:
            return True

    class Meta:
        model = Invite
        fields = ("email", "inviter", "team")
