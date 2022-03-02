from django import forms
from invitations.forms import InvitationAdminAddForm
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


class CustomInvitationAdminAddForm(InvitationAdminAddForm):
    def save(self, *args, **kwargs):
        instance = super(CustomInvitationAdminAddForm, self).save(*args, **kwargs)
        cleaned_data = super(CustomInvitationAdminAddForm, self).clean()
        instance.team = cleaned_data.get("team")
        return instance

    class Meta:
        model = Invite
        fields = ("email", "inviter", "team")
