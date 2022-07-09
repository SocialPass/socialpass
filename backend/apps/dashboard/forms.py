import pytz
from django import forms
from invitations.exceptions import AlreadyAccepted, AlreadyInvited
from invitations.forms import InviteForm
from taggit.forms import TagField

from apps.dashboard import services
from apps.dashboard.models import Invite, Team
from apps.root.model_field_choices import EVENT_VISIBILITY
from apps.root.models import Event


class CustomInviteForm(InviteForm):
    """
    Custom invite form subclassing django-invitations
    """

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


class TeamForm(forms.ModelForm):
    """
    Allows team information to be updated.
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


required_fields = [
    "title",
    "organizer",
    "description",
    "visibility",
    # location
    "location",
    # TODO
    # date and time
    "start_date",
    # cover image
    "cover_image",
    # 2. Requirements
    "requirements",
    # 3. Tickets
    "capacity",
    "limit_per_person",
    # 4. Publish
]
optional_fields = [
    # 1. General info
    # basic info
    "category",
    "tags",
    "visibility",
    "end_date",
    "timezone_offset",
    "cover_image",
    "publish_date",
    "timezone_offset",
    "checkout_requested",
]


class EventForm(forms.ModelForm):
    """
    Allows ticketed event information to be updated.

    Features:
    - capacity is disabled if there is a payment in process.
    - price is updated when capacity is changed.
    """

    class Meta:
        fields = optional_fields + required_fields
        model = Event

        widgets = {
            "title": forms.TextInput(attrs={"placeholder": "Be clear and descriptive"}),
            "organizer": forms.TextInput(
                attrs={"placeholder": "Name of Brand or Community organizing the event"}
            ),
            "description": forms.Textarea(
                attrs={"placeholder": "A short description of your event", "rows": 3}
            ),
            "location": forms.HiddenInput(),
            "requirements": forms.HiddenInput(),
            "timezone_offset": forms.HiddenInput(),
        }

    start_date = forms.DateTimeField(
        widget=forms.DateTimeInput(
            format="%Y-%m-%dT%H:%M",
            attrs={"id": "date", "class": "form-control", "type": "datetime-local"},
        ),
        required=False,
    )
    end_date = forms.DateTimeField(
        widget=forms.DateTimeInput(
            format="%Y-%m-%dT%H:%M",
            attrs={"id": "date", "class": "form-control", "type": "datetime-local"},
        ),
        required=False,
    )
    publish_date = forms.DateTimeField(
        widget=forms.DateTimeInput(
            format="%Y-%m-%dT%H:%M",
            attrs={"id": "date", "class": "form-control", "type": "datetime-local"},
        ),
        required=False,
    )
    visibility = forms.CharField(
        label="Visibility",
        widget=forms.RadioSelect(choices=EVENT_VISIBILITY),
        required=False,
    )
    checkout_requested = forms.BooleanField(
        label="...", widget=forms.HiddenInput(), required=False, initial=False
    )

    def save(self, commit: bool = ...) -> Event:
        """
        save method sets Event price after save
        """
        obj = super().save(commit)
        services.set_event_price(obj)
        return obj

    def clean(self):
        """
        Clean method for dynamic form field requirement
        """
        data = super().clean()
        errors = {}

        # first check for checkout_requested
        # loop over required fields
        checkout_requested = data.get("checkout_requested", None)
        if checkout_requested:
            # check field
            for i in required_fields:
                field = data.get(i, None)
                if not field:
                    errors[i] = "This field is required"

        # check for errors
        if not errors:
            return data
        else:
            raise forms.ValidationError(errors)
