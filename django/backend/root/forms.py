import pytz
from django import forms
from invitations.forms import InvitationAdminAddForm, InviteForm
from invitations.exceptions import AlreadyAccepted, AlreadyInvited, UserRegisteredEmail
from root.models import Team, Invite, TicketGate

class TimeZoneForm(forms.Form):
    """
    Form just to validate the event timezone field
    """
    event_time_zone = forms.ChoiceField(choices=[(x, x) for x in pytz.common_timezones])

class TeamForm(forms.ModelForm):
    """
    Allows team information to be updated.
    """

    class Meta:
        model = Team
        exclude = [
            "software_types",
        ]

class TicketGateForm(forms.ModelForm):
    """
    Allows ticketgate information to be updated.
    """
    timezone = forms.ChoiceField(choices=[(x, x) for x in pytz.common_timezones])

    class Meta:
        model = TicketGate
        fields = [
               "title",
               "description",
               "date",
               "timezone",
               "location",
               "capacity",
               "requirements"
        ]
        widgets = {
            'requirements': forms.HiddenInput(),

        }

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
    class Meta:
        model = Invite
        fields = ("email", "inviter", "team")

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

    def save(self, *args, **kwargs):
        cleaned_data = super(InvitationAdminAddForm, self).clean()
        email = cleaned_data.get("email")
        params = {'email': email}
        if cleaned_data.get("inviter"):
           params['inviter'] = cleaned_data.get("inviter")
        if cleaned_data.get("team"):
           params['team'] = cleaned_data.get("team")
        instance = Invite.create(**params)
        instance.send_invitation(self.request)
        super(InvitationAdminAddForm, self).save(*args, **kwargs)
        return instance
