from django import forms


class PasscodeForm(forms.Form):
    """
    Form to handle the passcode
    """

    passcode = forms.CharField(
        min_length=6,
        max_length=6,
        widget=forms.TextInput(
            attrs={"placeholder": "Enter your 6-character passcode"}
        ),
    )


class CheckoutForm(forms.Form):

    checkout_type = forms.CharField(
        widget=forms.TextInput(
            attrs={"class": "form-control"}
        ),
    )
    ticket_tier_data = forms.CharField(
        #widget=forms.HiddenInput()
        widget=forms.TextInput(
            attrs={"class": "form-control"}
        )
    )
    name = forms.CharField(
        widget=forms.TextInput(
            attrs={"placeholder": "Name"}
        ),
    )
    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={"placeholder": "Email Address"}
        ),
    )


class CheckoutForm2(forms.Form):

    wallet_address = forms.CharField(
        widget=forms.HiddenInput()
    )
    signed_message = forms.CharField(
        widget=forms.HiddenInput()
    )
    name = forms.CharField(
        widget=forms.TextInput(
            attrs={"placeholder": "Name"}
        ),
    )
    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={"placeholder": "Email Address"}
        ),
    )


class NFTCheckoutForm(forms.Form):

    wallet_address = forms.CharField(
        widget=forms.TextInput(
            attrs={"placeholder": "Wallet address"}
        ),
    )
    signed_message = forms.CharField(
        widget=forms.TextInput(
            attrs={"placeholder": "Signed message"}
        ),
    )
    ticket_tier_data = forms.CharField(
        widget=forms.Textarea(
            attrs={"rows": "5"}
        )
    )
