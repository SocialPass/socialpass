from django.views.generic import CreateView

from . import object_tracker


class AvoidRessubmissionCreateViewMixin(CreateView):

    """View to avoid form resubmission. Starts a new tracking UUID and binds it to the form instance
    in case it is saved.
    If the browser is resubmitting the form, the uuid field's value will map to the previously bound object.
    Thus, an update is performed instead of a new object creation."""

    tracker_backend = object_tracker.ModelObjectTracker

    def get(self, request, *args, **kwargs):
        self.afr_uuid = self.tracker_backend.start_new_tracking(request)
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        try:
            self.afr_uuid = request.POST['_afr_uuid']
        except KeyError:
            raise RuntimeError(
                "_afr_uuid parameter is not being sent on POST request."
                + " Plase check if your form includes the {% afr_uuid %} templatag."
            )
        self.obj_tracker = self.tracker_backend(request, self.afr_uuid)
        return super().post(request, *args, **kwargs)

    def get_form(self, *args, **kwargs):
        form = super().get_form(*args, **kwargs)

        if hasattr(self, 'obj_tracker') and self.obj_tracker.has_bound_object():
            form.instance = self.obj_tracker.bound_object

        return form

    def form_valid(self, form):
        ret = super().form_valid(form)
        self.obj_tracker.bind(self.object)
        return ret

    def get_context_data(self, **kwargs):
        return dict(
            **super().get_context_data(**kwargs),
            **{
                'afr_uuid_': self.afr_uuid
            }
        )
