from django import forms

class PasscodeForm(forms.Form):
    """
    Form to handle the passcode
    """
    passcode = forms.CharField(
        max_length=6,
        widget=forms.TextInput(
            attrs={"placeholder": "Enter your 6-character passcode"}
        )
    )
