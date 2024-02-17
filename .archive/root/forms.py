from django import forms
from apps.root.models import Invite


class AlreadyInvited(Exception):
    """User has a valid, pending invitation"""

    pass


class AlreadyAccepted(Exception):
    """User has already accepted an invitation"""

    pass


class CleanEmailMixin:
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

    def clean_email(self):
        email = self.cleaned_data["email"]

        errors = {
            "already_invited": "This e-mail address has already been invited.",
            "already_accepted": "This e-mail address has already accepted an invite.",
        }
        try:
            self.validate_invitation(email)
        except AlreadyInvited:
            raise forms.ValidationError(errors["already_invited"])
        except AlreadyAccepted:
            raise forms.ValidationError(errors["already_accepted"])
        return email


class InviteAdminAddForm(forms.ModelForm, CleanEmailMixin):
    email = forms.EmailField(
        label="E-mail",
        required=True,
        widget=forms.TextInput(attrs={"type": "email", "size": "30"}),
    )

    class Meta:
        model = Invite
        fields = ("email", "inviter", "team")

    def save(self, *args, **kwargs):
        cleaned_data = super().clean()
        email = cleaned_data.get("email")
        params = {"email": email}
        if cleaned_data.get("inviter"):
            params["inviter"] = cleaned_data.get("inviter")
            if cleaned_data.get("team"):
                params["team"] = cleaned_data.get("team")
            instance = Invite.create(**params)
            instance.send_invitation(self.request)
            super().save(*args, **kwargs)
            return instance


class InviteAdminChangeForm(forms.ModelForm):
    class Meta:
        model = Invite
        fields = "__all__"