from datetime import date

import pytz
from django import forms
from django.utils.translation import gettext_lazy as _
from django_quill.forms import QuillFormField
from eth_utils import is_address

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


def get_country_choices():
    """
    Return choices for country where value is the country code
    """

    choices = []
    for i in pytz.country_names.items():
        choices.append((i[0], i[1]))
    return choices


class EventForm(forms.ModelForm):
    """
    Event form
    """

    description = QuillFormField()
    timezone = forms.ChoiceField(choices=[(x, x) for x in pytz.common_timezones])
    country = forms.ChoiceField(choices=get_country_choices())

    class Meta:
        model = Event
        fields = [
            "title",
            "organizer",
            "description",
            "start_date",
            "end_date",
            "timezone",
            "address_1",
            "address_2",
            "city",
            "postal_code",
            "country",
            "cover_image",
        ]

        widgets = {
            "title": forms.TextInput(attrs={"placeholder": "Be clear and descriptive"}),
            "organizer": forms.TextInput(
                attrs={"placeholder": "Name of Brand or Community organizing the event"}
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
            "address_1": forms.TextInput(
                attrs={"placeholder": "Name of place, street and number, P.O. box, c/o"}
            ),
            "address_2": forms.TextInput(
                attrs={"placeholder": "Apartment, suite, unit, building, floor, etc."}
            ),
            "city": forms.TextInput(attrs={"placeholder": "City name"}),
            "postal_code": forms.TextInput(attrs={"placeholder": "Postal code"}),
        }
        labels = {
            "address_1": "Address line 1",
            "address_2": "Address line 2 (Optional)",
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
        fields = [
            "balance_required",
            "network",
            "asset_type",
            "token_address",
            "token_id",
        ]
        widgets = {
            "token_address": forms.TextInput(
                attrs={"placeholder": "Example: 0xb79...79268"}
            ),
            "token_id": forms.TextInput(attrs={"placeholder": "Example: 1, 2, 3, 4, 5"}),
            "balance_required": forms.NumberInput(attrs={"min": 1}),
        }
        labels = {"token_id": "Token IDs (Optional)"}

    def clean_token_address(self):
        token_address = self.cleaned_data["token_address"]

        if not is_address(token_address):
            raise forms.ValidationError("The token address is not valid")

        return token_address
