from datetime import date

import pytz
from django import forms
from django.utils.translation import gettext_lazy as _

from apps.root.forms import CleanEmailMixin
from apps.root.models import Event, Invite, Team


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
    base Event form
    """

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

    def clean(self):
        data = super().clean()
        if "transition_live" in self.data:
            self.check_required_fields(data=data, exclude=EventLiveForm.Meta.exclude)
        return data

    def save(self):
        instance = super().save()
        if "transition_draft" in self.data:
            instance.transition_draft()
        elif "transition_live" in self.data:
            instance.transition_live()
        return instance


class EventDraftForm(EventForm):
    """
    Form for event.state == draft
    """

    class Meta(EventForm.Meta):
        pass


class EventLiveForm(EventForm):
    """
    Form for event.state == live
    """

    class Meta(EventForm.Meta):
        exclude = ["capacity"]
