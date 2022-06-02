from django.views.generic import FormView


class AvoidRessubmissionFormViewMixin(FormView):

    def get_form_kwargs(self):
        """Adds request to form kwargs"""
        kw = super().get_form_kwargs()
        kw['request'] = self.request
        return kw
