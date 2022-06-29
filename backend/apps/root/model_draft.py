from django.core import exceptions as dj_exceptions
from django.db.models import CharField, TextField


def change_draft_validation_message(field, valitation_msg):
    # TODO this would be a nice to have feature.
    field._draft_validation_message = valitation_msg
    return field


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
        exc = None
        try:
            super().clean()
        except dj_exceptions.ValidationError as _exc:
            exc = _exc

        if exc:
            # exc can be twinkered for change_draft_validation_message
            raise exc

        if self.is_draft:
            return

        # check for required fields if not draft
        errors_dict = {}
        for field in self._meta.get_fields():
            if not getattr(field, "_required_if_not_draft", False):
                continue

            value = getattr(self, field.name)

            if value is None and not field._null_original:
                errors_dict[field.name] = dj_exceptions.ValidationError(
                    field.error_messages["null"], code="null"
                )

            if not field._blank_original and value in field.empty_values:
                errors_dict[field.name] = dj_exceptions.ValidationError(
                    field.error_messages["blank"], code="blank"
                )

        if errors_dict:
            raise dj_exceptions.ValidationError(errors_dict)
