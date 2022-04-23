import pytz
from django import forms

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
            "requirements",
        ]
        widgets = {
            "requirements": forms.HiddenInput(),
        }
