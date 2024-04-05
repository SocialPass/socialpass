import json
from django import forms
from django.core.exceptions import ValidationError


class PasscodeForm(forms.Form):
    """
    Form to handle the passcode
    """

    passcode = forms.CharField(
        min_length=6,
        max_length=6,
        widget=forms.TextInput(attrs={"placeholder": "Enter your 6-character passcode"}),
    )


class CheckoutForm(forms.Form):
    checkout_type = forms.CharField(
        widget=forms.HiddenInput(),
    )
    ticket_tier_data = forms.CharField(
        widget=forms.HiddenInput(),
    )
    name = forms.CharField(
        widget=forms.TextInput(attrs={"placeholder": "Name"}),
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={"placeholder": "Email Address"}),
    )

    def __init__(self, *args, **kwargs):
        self.event = kwargs.pop("event", None)
        self.tiers_all = kwargs.pop("tiers_all", None)
        super().__init__(*args, **kwargs)

    def clean(self):
        # Check valid JSON format
        cleaned_data = super().clean()
        ticket_tier_data = json.loads(cleaned_data["ticket_tier_data"])
        if not isinstance(ticket_tier_data, list):
            raise ValidationError("Something went wrong.")

        # Clean Form Inputs against Ticket Tier Data
        # Max Per Person, Amount, Extra Party
        # Note: Recursion to avoid duplicate queries
        for item in ticket_tier_data:
            for tier in self.tiers_all:
                if int(item["id"]) == tier.id:
                    amount = int(item["amount"])
                    selected_guests = int(item["selected_guests"])

                    # 1. Max Per Person
                    if amount > tier.max_per_person:
                        raise ValidationError(
                            f"Only {tier.max_per_person} per person is available."
                        )

                    # 2. Amount
                    # Don't check if waiting queue is enabled
                    if not self.event.waitlist_enabled:
                        total_selected = amount
                        available = tier.capacity - tier.tickets_sold_count
                        if total_selected > available:
                            raise ValidationError(f"Only {available} is available.")

                    # 3. Extra Party
                    if selected_guests > tier.guests_allowed:
                        raise ValidationError(
                            f"Only {tier.guests_allowed} guest(s) allowed."
                        )

        # OK
        return cleaned_data


class CheckoutFormFree(forms.Form):
    name = forms.CharField(
        widget=forms.TextInput(attrs={"placeholder": "Name", "readonly": "readonly"}),
    )
    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={"placeholder": "Email Address", "readonly": "readonly"}
        ),
    )


class CheckoutFormAssetOwnership(forms.Form):
    wallet_address = forms.CharField(widget=forms.HiddenInput())
    signed_message = forms.CharField(widget=forms.HiddenInput())
    delegated_wallet = forms.BooleanField(required=False, label="Use delegated wallet")
    name = forms.CharField(
        widget=forms.TextInput(attrs={"placeholder": "Name", "readonly": "readonly"}),
    )
    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={"placeholder": "Email Address", "readonly": "readonly"}
        ),
    )


class CheckoutFormFiat(forms.Form):
    name = forms.CharField(
        widget=forms.TextInput(attrs={"placeholder": "Name", "readonly": "readonly"}),
    )
    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={"placeholder": "Email Address", "readonly": "readonly"}
        ),
    )
