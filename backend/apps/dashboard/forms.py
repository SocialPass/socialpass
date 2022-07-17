from django import forms
from invitations.exceptions import AlreadyAccepted, AlreadyInvited
from invitations.forms import InviteForm

from apps.dashboard.models import Invite, Team
from apps.root.model_field_choices import EVENT_VISIBILITY
from apps.root.models import Event


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


class TeamForm(forms.ModelForm):
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
    class Meta:
        fields = Event.optional_fields() + Event.required_fields()
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


class EventDraftForm(EventForm):
    class Meta(EventForm.Meta):
        pass

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
            for i in Event.required_fields():
                field = data.get(i, None)
                if not field:
                    errors[i] = "This field is required"

        # check for errors
        # raise exception
        if errors:
            raise forms.ValidationError(errors)

        # form is OK, handle state transitions
        # Only call state transition if in expected state
        # Note: No need to save, as form will call save
        if checkout_requested:
            if self.instance.state != Event.StateEnum.PENDING_CHECKOUT.value:
                self.instance.transition_pending_checkout()
        else:
            if self.instance.state != Event.StateEnum.DRAFT.value:
                self.instance.transition_draft()

        # return form data
        return data


class EventPendingCheckoutForm(EventDraftForm):
    class Meta(EventDraftForm.Meta):
        pass


class EventLiveForm(EventForm):
    class Meta(EventForm.Meta):
        exclude = ["capacity"]

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
            for i in Event.required_fields():
                field = data.get(i, None)
                if not field and i not in EventLiveForm.Meta.exclude:
                    errors[i] = "This field is required"

        # check for errors
        if not errors:
            return data
        else:
            raise forms.ValidationError(errors)
