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
        )
    )
