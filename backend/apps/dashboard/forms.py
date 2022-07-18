from django import forms
from invitations.exceptions import AlreadyAccepted, AlreadyInvited
from invitations.forms import InviteForm

from apps.dashboard.models import Invite, Team
from apps.root.model_field_choices import EVENT_VISIBILITY
from apps.root.models import Event


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
            "requirements": forms.HiddenInput(),
            "location": forms.HiddenInput(),
            "lat": forms.HiddenInput(),
            "long": forms.HiddenInput(),
            "country": forms.HiddenInput(),
            "city": forms.HiddenInput(),
            "postal_code": forms.HiddenInput(),
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
    visibility = forms.ChoiceField(
        label="Visibility",
        initial=EVENT_VISIBILITY[0][0],
        choices=EVENT_VISIBILITY,
        widget=forms.RadioSelect,
    )
    ready_for_checkout = forms.BooleanField(
        label="", widget=forms.HiddenInput(), required=False
    )

    def _ready_for_checkout(self, data):
        """
        method for cleaning against checkout requested
        """
        errors = {}
        ready_for_checkout = data.get("ready_for_checkout", None)
        print(ready_for_checkout, "ready_for_checkout")
        if ready_for_checkout:
            # check field
            for i in Event.required_form_fields():
                field = data.get(i, None)
                if not field:
                    errors[i] = "This field is required"
        # check for errors
        # raise exception
        if errors:
            raise forms.ValidationError(errors)

        # form is OK, handle state transitions
        # Only call state transition if in expected state
        # Note: No need to save, as form will call save method later
        if ready_for_checkout:
            if self.instance.state != Event.StateEnum.PENDING_CHECKOUT.value:
                self.instance.transition_pending_checkout()
        else:
            if self.instance.state != Event.StateEnum.DRAFT.value:
                self.instance.transition_draft()


class EventDraftForm(EventForm):
    """
    Form for event.state == draft
    """

    class Meta(EventForm.Meta):
        pass

    def clean(self):
        data = super().clean()
        self._ready_for_checkout(data)
        return data


class EventPendingCheckoutForm(EventDraftForm):
    """
    Form for event.state == pending checkout
    """

    class Meta(EventDraftForm.Meta):
        pass

    def clean(self):
        data = super().clean()
        self._ready_for_checkout(data)
        return data


class EventLiveForm(EventForm):
    """
    Form for event.state == live
    """

    class Meta(EventForm.Meta):
        exclude = ["capacity"]
