from datetime import datetime

import pytz
from django import forms
from invitations.exceptions import AlreadyAccepted, AlreadyInvited
from invitations.forms import InviteForm

from apps.dashboard import services
from apps.dashboard.models import Invite, Team
from apps.root.model_field_choices import EVENT_VISIBILITY
from apps.root.models import Event


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


class EventForm(forms.ModelForm):
    """
    Allows ticketed event information to be updated.

    Features:
    - capacity is disabled if there is a payment in process.
    - price is updated when capacity is changed.
    """

    timezone = forms.ChoiceField(
        choices=[("", "")] + [(x, x) for x in pytz.common_timezones], required=False
    )
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

    class Meta:
        model = Event
        fields = [
            "is_draft",
            # 1. General info
            # basic info
            "title",
            "organizer",
            "description",
            # "categories",
            "visibility",
            # location
            "location",
            # TODO
            # date and time
            "start_date",
            "end_date",
            "timezone",
            # cover image
            "cover_image",
            # 2. Requirements
            "requirements",
            # 3. Tickets
            "capacity",
            "limit_per_person",
            # 4. Publish
            "publish_date",
            "custom_url_path",
        ]
        widgets = {
            "title": forms.TextInput(attrs={"placeholder": "Be clear and descriptive"}),
            "organizer": forms.TextInput(
                attrs={"placeholder": "Name of Brand or Community organizing the event"}
            ),
            "description": forms.Textarea(
                attrs={"placeholder": "A short description of your event", "rows": 3}
            ),
            "location": forms.TextInput(
                attrs={"placeholder": "Where the event is taking place"}
            ),
            "is_draft": forms.HiddenInput(),
            "requirements": forms.HiddenInput(),
        }

    def can_edit_capacity(self) -> bool:
        if self.instance is None:
            return True

        return not (
            services.get_in_progress_payment(self.instance)
            or services.get_effective_payments(self.instance.payments)
        )

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        if not self.can_edit_capacity():
            self.fields["capacity"].disabled = True

    def save(self, commit: bool = ...) -> Event:
        """Sets Event price after save"""
        if (not self.can_edit_capacity()) and (
            self.instance.capacity != self.cleaned_data["capacity"]
        ):
            # not using field has_changed here since it can lead to a
            # security failure as it checks if the field is disabled.

            # this will never happend since capacity field is disabled, unless the user tries to hack the form
            raise RuntimeError("Cannot change capacity")

        obj = super().save(commit)

        if "capacity" in self.changed_data:
            services.set_event_price(obj)

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
