from datetime import date

import pytz
from django import forms
from django.utils.translation import gettext_lazy as _

from apps.root.forms import CleanEmailMixin
from apps.root.models import Event, Invite, Team, TicketTier, TierAssetOwnership


class CustomInviteForm(forms.Form, CleanEmailMixin):
    """
    sub-classed validation to remove check for active user
    """

    email = forms.EmailField(
        label=_("E-mail"),
        required=True,
        widget=forms.TextInput(attrs={"type": "email", "size": "30"}),
        initial="",
    )

    def save(self, email):
        return Invite.create(email=email)


class TeamForm(forms.ModelForm):
    """
    Team Form
    """

    class Meta:
        model = Team
        fields = ["name", "description", "image"]
        widgets = {
            "name": forms.TextInput(attrs={"placeholder": "Name of your team"}),
            "description": forms.Textarea(
                attrs={"placeholder": "A short description of your team", "rows": 3}
            ),
        }
        labels = {"image": "Set Team Image"}


class EventForm(forms.ModelForm):
    """
    Event form
    """

    timezone = forms.ChoiceField(choices=[(x, x) for x in pytz.common_timezones])

    class Meta:
        model = Event
        fields = [
            "title",
            "organizer",
            "description",
            "start_date",
            "end_date",
            "initial_place",
            "lat",
            "long",
            "region",
            "address_1",
            "address_2",
            "country",
            "city",
            "postal_code",
            "localized_address_display",
            "timezone",
            "cover_image",
        ]

        widgets = {
            "title": forms.TextInput(attrs={"placeholder": "Be clear and descriptive"}),
            "organizer": forms.TextInput(
                attrs={"placeholder": "Name of Brand or Community organizing the event"}
            ),
            "description": forms.Textarea(
                attrs={"placeholder": "A short description of your event", "rows": 3}
            ),
            "start_date": forms.DateTimeInput(
                format="%Y-%m-%dT%H:%M",
                attrs={
                    "id": "start_date",
                    "class": "form-control",
                    "type": "datetime-local",
                    "min": date.today().strftime("%Y-%m-%dT%H:%M"),
                },
            ),
            "end_date": forms.DateTimeInput(
                format="%Y-%m-%dT%H:%M",
                attrs={
                    "id": "end_date",
                    "class": "form-control",
                    "type": "datetime-local",
                    "min": date.today().strftime("%Y-%m-%dT%H:%M"),
                },
            ),
            "initial_place": forms.HiddenInput(),
            "lat": forms.HiddenInput(),
            "long": forms.HiddenInput(),
            "region": forms.HiddenInput(),
            "address_1": forms.HiddenInput(),
            "address_2": forms.HiddenInput(),
            "country": forms.HiddenInput(),
            "city": forms.HiddenInput(),
            "postal_code": forms.HiddenInput(),
            "localized_address_display": forms.HiddenInput(),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make sure the edit form populates with the start and end dates
        if self.instance.pk:
            if self.instance.start_date:
                self.initial["start_date"] = self.instance.start_date.strftime(
                    "%Y-%m-%dT%H:%M"
                )
            if self.instance.end_date:
                self.initial["end_date"] = self.instance.end_date.strftime(
                    "%Y-%m-%dT%H:%M"
                )


class TicketTierForm(forms.ModelForm):
    """
    Ticket tier form
    """

    class Meta:
        model = TicketTier
        fields = ["ticket_type", "capacity", "max_per_person"]
        widgets = {
            "ticket_type": forms.TextInput(
                attrs={"placeholder": "A short name for this type of ticket"}
            ),
            "capacity": forms.NumberInput(attrs={"min": 1}),
            "max_per_person": forms.NumberInput(attrs={"min": 1}),
        }
        labels = {"ticket_type": "Name of ticket tier"}


class TierAssetOwnershipForm(forms.ModelForm):
    """
    Ticket tier asset ownership form
    """

    class Meta:
        model = TierAssetOwnership
        fields = ["blockchain", "network", "asset_type", "token_address", "token_id"]
        widgets = {
            "token_address": forms.TextInput(
                attrs={"placeholder": "Example: 0xb79...79268"}
            ),
            "token_id": forms.TextInput(
                attrs={"placeholder": "Example: 1, 2, 3, 4, 5"}
            ),
        }
        labels = {"token_id": "Token IDs (Optional)"}
