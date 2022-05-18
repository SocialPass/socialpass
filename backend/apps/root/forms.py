import pytz
from django import forms

from apps.root import pricing_service
from apps.root.models import Team, TicketedEvent, Invite
from invitations.forms import InvitationAdminAddForm, InviteForm
from invitations.exceptions import AlreadyAccepted, AlreadyInvited


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
        fields = '__all__'


class TicketedEventForm(forms.ModelForm):
    """
    Allows ticketed event information to be updated.

    Features:
    - capacity is disabled if there is a payment in process.
    - price is updated when capacity is changed.
    """

    timezone = forms.ChoiceField(choices=[(x, x) for x in pytz.common_timezones])

    class Meta:
        model = TicketedEvent
        fields = [
            "title",
            "description",
            "date",
            "timezone",
            "location",
            "capacity",
            "requirements",
        ]
        widgets = {
            "requirements": forms.HiddenInput(),
            'date': forms.TextInput(attrs={
                'class': 'form-control',
                'id': 'date',
                'type': 'date',
            }),

        }

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        instance = getattr(self, "instance", None)
        if not instance:
            return

        if pricing_service.get_in_progress_payment(instance):
            self.fields['capacity'].disabled = True

    def save(self, commit: bool = ...) -> TicketedEvent:
        """Sets TicketedEvent price after save"""
        obj = super().save(commit)

        if 'capacity' in self.changed_data:
            pricing_service.set_ticket_gate_price(obj)

        return obj


class CustomInviteForm(InviteForm):
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
