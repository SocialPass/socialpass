import zoneinfo
from datetime import date
from django import forms
from django.utils.translation import gettext as _
from django_quill.forms import QuillFormField
from eth_utils import is_address

from apps.root.countries import COUNTRIES
from apps.root.models import (
    Event,
    Invitation,
    MessageBatch,
    Team,
    TicketTier,
)
from apps.root.exceptions import GoogleWalletAPIRequestError


class InvitationForm(forms.Form):
    """
    Invite users to team
    """

    email = forms.EmailField(
        label=_("Email Address"),
        required=True,
        widget=forms.TextInput(
            attrs={
                "type": "email",
                "placeholder": "JohnDoe@gmail.com",
            }
        ),
        initial="",
    )

    def save(self, email):
        return Invitation(email=email)


class TeamForm(forms.ModelForm):
    """
    Team Form
    """

    class Meta:
        model = Team
        fields = ["name", "description", "image"]
        widgets = {
           "name": forms.TextInput(attrs={"placeholder": _("Event Planner Company")}),
           "description": forms.Textarea(
               attrs={
                   "placeholder": _("Your premier event planning company specializing in unforgettable experiences."),
                   "rows": 3,
               }
           ),
        }
        labels = {
           "name": _("Name"),
           "description": _("Description"),
           "image": _("Profile Image"),
        }
        help_texts = {
           "image": _(
               "A personal image for your profile. Please make sure the image is "
               "square, non-transparent, and ideally in the PNG format."
           ),
        }



class EventCreateForm(forms.ModelForm):
    """
    Event create form
    """

    class Meta:
        model = Event
        fields = [
            "team",
            "title",
            "description",
            "cover_image",
        ]
        widgets = {
            "title": forms.TextInput(
                attrs={
                    "placeholder": _("Your Event Name Here"),
                }
            ),
            "description": forms.Textarea(
                attrs={
                    "placeholder": _(
                        "Short description here. Let the people know what’s "
                        "going on with this event!"
                    ),
                    "rows": 3,
                }
            ),
        }


class EventForm(forms.ModelForm):
    """
    Event form
    """

    description = QuillFormField()
    timezone = forms.ChoiceField(choices=[
        (x, x) for x in sorted(zoneinfo.available_timezones())
    ])

    class Meta:
        model = Event
        fields = [
            "team",
            "title",
            "description",
            "cover_image",
            "start_date",
            "end_date",
            "timezone",
            "geo_address",
            "hide_address",
        ]

        widgets = {
            "title": forms.TextInput(
                attrs={
                    "placeholder": _("Your Event Name Here"),
                }
            ),
            "start_date": forms.DateTimeInput(
                format="%Y-%m-%dT%H:%M",
                attrs={
                    "id": "start_date",
                    "class": "form-control",
                    "type": "datetime-local",
                    "min": date.today().strftime("%Y-%m-%dT%H:%M"),
                    "required": "required",
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
            "geo_address": forms.TextInput(
                attrs={
                    "placeholder": _("Start typing to find your venue..."),
                    "required": "required",
                }
            ),
        }
        labels = {
            "title": _("Title"),
            "description": _("Description"),
            "start_date": _("Event Start"),
            "end_date": _("Event End"),
            "timezone": _("Timezone"),
            "geo_address": _("Address"),
            "hide_address": _("Hide Address"),
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


class TicketingSetupForm(forms.ModelForm):
    """
    Event ticketing setup form
    """

    class Meta:
        model = Event
        fields = [
            "sales_start",
            "sales_end",
            "total_capacity",
            "waiting_queue_enabled",
        ]

        widgets = {
            "sales_start": forms.DateTimeInput(
                format="%Y-%m-%dT%H:%M",
                attrs={
                    "id": "sales_start",
                    "class": "form-control",
                    "type": "datetime-local",
                },
            ),
            "sales_end": forms.DateTimeInput(
                format="%Y-%m-%dT%H:%M",
                attrs={
                    "id": "sales_end",
                    "class": "form-control",
                    "type": "datetime-local",
                },
            ),
            "total_capacity": forms.NumberInput(
                attrs={
                    "min": 1,
                    "placeholder": _("Total Venue Capacity"),
                }
            ),
        }
        labels = {
            "sales_start": _("Ticket Sales Start"),
            "sales_end": _("Ticket Sales End"),
            "waiting_queue_enabled": _("Turn on Waitlist"),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make sure the edit form populates with the start and end dates
        if self.instance.pk:
            if self.instance.sales_start:
                self.initial["sales_start"] = self.instance.sales_start.strftime(
                    "%Y-%m-%dT%H:%M"
                )
            if self.instance.sales_end:
                self.initial["sales_end"] = self.instance.sales_end.strftime(
                    "%Y-%m-%dT%H:%M"
                )


class TicketTierForm(forms.ModelForm):
    """
    Ticket tier form
    """

    class Meta:
        model = TicketTier
        fields = [
            "name", "capacity", "max_per_person", "allowed_guests",
            "guest_supply", "hidden_from_public", "hidden_availability", "additional_information",
        ]
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "placeholder": _(
                        "Short name for free ticket tier e.g. General Admission"
                    )
                }
            ),
            "capacity": forms.NumberInput(attrs={"min": 1}),
            "max_per_person": forms.NumberInput(attrs={"min": 1}),
            "allowed_guests": forms.NumberInput(attrs={"min": 0}),
            "guest_supply": forms.NumberInput(
                attrs={
                    "min": 0,
                    "placeholder": _("Total number of guests allowed."),
                }
            ),
            "additional_information": forms.TextInput(
                attrs={
                    "placeholder": _(
                        "Additional information for this tier provided by the host."
                    )
                }
            ),
        }
        labels = {
            "name": _("Name of ticket tier"),
            "capacity": _("Capacity"),
            "max_per_person": _("Max per person"),
            "allowed_guests": _("Max guest(s) allowed per ticket"),
            "hidden_from_public": _("Hide tier from public"),
            "hidden_availability": _("Hide tickets available from public"),
        }


class TierAssetOwnershipForm(TicketTierForm):
    """
    Ticket tier asset ownership form
    """

    class Meta:
        model = TicketTier
        fields = TicketTierForm.Meta.fields + [
            "balance_required",
            "network",
            "token_address",
            "token_id",
        ]
        widgets = {
            **TicketTierForm.Meta.widgets,
            **{
                "token_address": forms.TextInput(
                    attrs={"placeholder": _("e.g. 0xb53...4394n")}
                ),
                "token_id": forms.TextInput(attrs={"placeholder": _("e.g. 1,2,3,4,5")}),
                "balance_required": forms.NumberInput(attrs={"min": 1}),
            }
        }
        labels = {
            **TicketTierForm.Meta.labels,
            **{
                "token_address": _("NFT Collection Token Address"),
                "balance_required": _("Balance Required"),
                "token_id": _("OPTIONAL: Token IDs Required"),
            }
        }

    def clean_token_address(self):
        token_address = self.cleaned_data["token_address"]

        if not is_address(token_address):
            raise forms.ValidationError("The token address is not valid")

        return token_address


class TierFiatForm(TicketTierForm):
    """
    Ticket tier fiat form
    """

    class Meta:
        model = TicketTier
        fields = TicketTierForm.Meta.fields + [
            "price_per_ticket",
        ]
        widgets = {
            **TicketTierForm.Meta.widgets,
            **{
                "price_per_ticket": forms.NumberInput(
                    attrs={
                        "placeholder": _("Price of one ticket"),
                        "step": "0.01",
                        "min": "0.01",
                    }
                ),
            }
        }
        labels = {
            **TicketTierForm.Meta.labels,
            **{
                "price_per_ticket": _("Price/ticket"),
            }
        }


class RSVPCreateTicketsForm(forms.Form):
    """
    Bulk tickets create form for the RSVP system.
    """

    ticket_tier = forms.ModelChoiceField(queryset=TicketTier.objects.none())
    allowed_guests = forms.IntegerField(
        widget=forms.NumberInput(
            attrs={
                "min": 0,
                "max": 100,
            }
        ),
        initial=0,
    )
    customer_emails = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": _("john@example.com, jane@example.com, jack.example.com")
            }
        ),
    )


class MessageBatchForm(forms.ModelForm):
    """
    Form to create a message batch
    """

    class Meta:
        model = MessageBatch
        fields = ["ticket_tier", "subject", "message"]
        widgets = {
           "subject": forms.TextInput(attrs={"placeholder": _("Subject of the email")}),
           "message": forms.Textarea(
               attrs={
                   "placeholder": _("Message of the email"),
                   "rows": 3,
               }
           ),
        }


class ManualAttendeesForm(forms.Form):
    """
    Bulk create manual attendees.
    """

    names_or_emails = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": _("John Doe, jane@example.com, Jack, kevin@example.com")
            }
        ),
    )
