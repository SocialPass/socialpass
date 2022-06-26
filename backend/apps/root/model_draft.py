from django.core import exceptions as dj_exceptions
from django.db.models import CharField, TextField


def required_if_not_draft(field):

    field._required_if_not_draft = True
    field._null_original = field.null
    field._blank_original = field.blank
    if not isinstance(field, (TextField, CharField)):
        # https://docs.djangoproject.com/en/1.11/ref/models/fields/#django.db.models.Field.null
        field.null = True
    field.blank = True

    return field


class AllowDraft:
    def is_draft(self):
        raise NotImplementedError("is_draft")

    def clean(self):
        super().clean()

        if self.is_draft:
            return

        # check for required fields if not draft
        for field in self._meta.get_fields():
            if not getattr(field, "_required_if_not_draft", False):
                continue

            value = getattr(self, field.name)

            if value is None and not field._null_original:
                raise dj_exceptions.ValidationError(
                    f"{field.name}: {field.error_messages['null']}", code="null"
                )

            if not field._blank_original and value in self.empty_values:
                raise dj_exceptions.ValidationError(
                    f"{field.name}: {field.error_messages['blank']}", code="blank"
                )
