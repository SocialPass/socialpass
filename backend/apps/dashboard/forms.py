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


class TicketGateForm(forms.ModelForm):
    """
    Allows ticketgate information to be updated.

    Features:
    - capacity is disabled if there is a payment in process.
    - price is updated when capacity is changed.
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

    def save(self, commit: bool = ...) -> TicketGate:
        """Sets TicketGate price after save"""
        obj = super().save(commit)

        if 'capacity' in self.changed_data:
            pricing_service.set_ticket_gate_price(obj)

        return obj
