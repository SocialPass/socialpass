from datetime import date

import pytz
from django import forms
from invitations.exceptions import AlreadyAccepted, AlreadyInvited
from invitations.forms import InviteForm

from apps.root.models import Event, Invite, Team


class CustomInviteForm(InviteForm):
    """
    sub-classed validation to remove check for active user
    """

    def validate_invitation(self, email):
        if Invite.objects.all_valid().filter(email__iexact=email, accepted=False):
            raise AlreadyInvited
        elif Invite.objects.filter(email__iexact=email, accepted=True):
            raise AlreadyAccepted
        else:
            return True


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
    base Event form
    """

    show_ticket_count = forms.TypedChoiceField(
        coerce=lambda x: x == "True",
        choices=((True, "Yes"), (False, "No")),
        widget=forms.RadioSelect,
        initial=(True, "Yes"),
    )
    show_team_image = forms.TypedChoiceField(
        coerce=lambda x: x == "True",
        choices=((True, "Yes"), (False, "No")),
        widget=forms.RadioSelect,
        initial=(True, "Yes"),
    )
    timezone = forms.ChoiceField(choices=[(x, x) for x in pytz.common_timezones])

    class Meta:
        fields = Event.optional_form_fields() + Event.required_form_fields()
        model = Event

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
            "publication_date": forms.DateTimeInput(
                format="%Y-%m-%dT%H:%M",
                attrs={
                    "id": "publication_date",
                    "class": "form-control",
                    "type": "datetime-local",
                    "min": date.today().strftime("%Y-%m-%dT%H:%M"),
                },
            ),
            "visibility": forms.RadioSelect(),
            "requirements": forms.HiddenInput(),
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

    def check_required_fields(self, data=None, exclude=[]):
        errors = {}
        # check field
        for i in Event.required_form_fields():
            field = data.get(i, None)
            if not field and i not in exclude:
                errors[i] = "This field is required"
        # check for errors
        # raise exception
        if errors:
            raise forms.ValidationError(errors)

    def clean_limit_per_person(self):
        data = self.cleaned_data["limit_per_person"]

        # Make sure limit per person does not exceed capacity
        if self.instance.pk:
            capacity = self.instance.capacity
        else:
            capacity = self.cleaned_data["capacity"]
        if data > capacity:
            raise forms.ValidationError(
                f"Limit per person exceeds capacity of {capacity}."
            )

        return data


class EventDraftForm(EventForm):
    """
    Form for event.state == draft
    """

    class Meta(EventForm.Meta):
        pass

    def __init__(self, user=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["ready_for_checkout"] = forms.BooleanField(
            label="...", widget=forms.HiddenInput(), required=False, initial=False
        )

    def check_ready_for_checkout(self, data):
        """
        method for cleaning against checkout requested
        """
        # check required fields if ready for checkout
        ready_for_checkout = data.get("ready_for_checkout", None)
        if ready_for_checkout:
            self.check_required_fields(data=data)

    def save_state_transition(self, instance):
        """
        method for saving state transition
        """
        # form is OK, handle state transitions
        # Only call state transition if in expected state
        # Note: No need to save, as form will call save method later
        if self.cleaned_data.get("ready_for_checkout"):
            if instance.state != Event.StateEnum.LIVE.value:
                instance.transition_live()
        else:
            if instance.state != Event.StateEnum.DRAFT.value:
                instance.transition_draft()

    def save(self):
        instance = super().save()
        self.save_state_transition(instance)
        return instance

    def clean(self):
        data = super().clean()
        self.check_ready_for_checkout(data)
        return data


class EventLiveForm(EventForm):
    """
    Form for event.state == live
    """

    class Meta(EventForm.Meta):
        exclude = ["capacity"]

    def clean(self):
        data = super().clean()
        self.check_required_fields(data=data, exclude=EventLiveForm.Meta.exclude)
        return data
