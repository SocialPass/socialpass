import pytz
from django import forms

from apps.root import pricing_service
from apps.root.models import Team, TicketGate


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


class TicketGateUpdateForm(forms.ModelForm):
    """
    Allows ticketgate information to be updated.
    
    Restricts editing capacity
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
            "requirements",
        ]
        widgets = {
            "requirements": forms.HiddenInput(),
        }

class TicketGateForm(forms.ModelForm):
    """
    Allows ticketgate information to be updated.
    """

    timezone = forms.ChoiceField(choices=[(x, x) for x in pytz.common_timezones])

    class Meta:
        model = TicketGate
        fields = [
            "title",
            "date",
            "timezone",
            "location",
            "capacity",
            "requirements",
        ]
        widgets = {
            "requirements": forms.HiddenInput(),
        }

    def save(self, commit: bool = ...) -> TicketGate:
        """Sets TicketGate price after save"""
        obj = super().save(commit)

        if commit:
            pricing_service.set_ticket_gate_price(obj)
