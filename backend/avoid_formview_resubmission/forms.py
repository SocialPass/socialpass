from uuid import uuid4, UUID

from django import forms
from django.apps import apps

# TODO: general refactor and code clean-up
# TODO: Create some more abstraction layers to decouple it from forms


def get_afr_metadata(request, uuid: UUID) -> dict:
    return request.session['_afr_metadata'][str(uuid)]


def get_or_create_afr_metadata(request, uuid: UUID = None) -> tuple[dict, UUID, bool]:
    _afr_metadata = request.session.get('_afr_metadata', {})
    if not _afr_metadata:
        request.session['_afr_metadata'] = _afr_metadata

    try:
        return get_afr_metadata(request, uuid), uuid, False
    except KeyError:
        pass

    if not isinstance(uuid, UUID):
        try:
            uuid = UUID(uuid)
        except Exception:
            uuid = uuid4()

    _afr_metadata[str(uuid)] = {}
    request.session.modified = True
    return _afr_metadata[str(uuid)], uuid, True


def update_afr_metadata(request, uuid: UUID, data: dict):
    _afr_metadata = get_afr_metadata(request, uuid)
    _afr_metadata.update(data)
    request.session.modified = True


def set_value_to_afr_metadata(request, uuid: UUID, key: str, value: str):
    _afr_metadata = get_afr_metadata(request, uuid)
    _afr_metadata[str(uuid)][key] = value
    request.session.modified = True


class AvoidRessubmissionFormMixin(forms.ModelForm):
    """
    This form is used to avoid resubmission of a form when browser back button is used.

    It creates an UUID field that is used to identify the form.
    If the browser back button is used, the UUID will not change since the backend was never hit, and it will populate
    the input from the browser's cache. Thus when the form is resubmited, the view will instance a new form but there
    will be already a form instanced with the same UUID.

    Glossary:
    - afr stands for Avoid Form Resubmission.
    """

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request')
        ret = super().__init__(*args, **kwargs)
        self.fields['_afr_uuid'] = forms.fields.UUIDField(widget=forms.HiddenInput())
        self.instantiate_afr_metadata()
        return ret

    @property
    def request(self):
        try:
            return self.__request
        except AttributeError:
            raise RuntimeError(
                "Misuse of AvoidRessubmissionFormMixin. The form must be instantiated with a request."
                + "\nSee usage examples in the documentation."
            )

    @request.setter
    def request(self, request):
        self.__request = request

    def instantiate_afr_metadata(self):
        self._afr_meta, self._afr_uuid, created = get_or_create_afr_metadata(
            self.request, self.data.get('_afr_uuid', None)
        )

        self.fields['_afr_uuid'].initial = self._afr_uuid
        if not created and self._afr_meta:
            instance = self.get_instance_from_afr_metadata()
            if instance is None:
                self.safe_bust_afr_metadata()
                self.instantiate_afr_metadata()
            else:
                self.instance = instance

    def get_instance_from_afr_metadata(self):
        Model = apps.get_model(
            self._afr_meta['model_app'], self._afr_meta['model_name']
        )
        try:
            instance = Model.objects.get(pk=self._afr_meta['pk'])
        except Model.objects.DoesNotExist:
            instance = None

        return instance

    def safe_bust_afr_metadata(self):
        try:
            del self.request.session['_afr_metadata']
        except KeyError:
            pass

    def set_instance_to_afr_metadata(self, instance):
        update_afr_metadata(self.request, self._afr_uuid, {
            'pk': instance.pk,
            'model_name': instance.__class__.__name__,
            'model_app': instance._meta.app_label
        })

    def save(self, commit: bool = ...):
        instance = super().save(commit)
        self.set_instance_to_afr_metadata(instance)
        return instance
