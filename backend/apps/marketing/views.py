from django.views.generic import TemplateView
from apps.root.models import Event


class MarketingIndex(TemplateView):
    template_name = "landing/index.html"

    def get_context_data(self, **kwargs):
        """
        featured event
        """
        context = super().get_context_data(**kwargs)
        featured_top = Event.objects.filter(is_featured_top=True)[:1]
        if featured_top.count() > 0:
            featured_event = featured_top[0]
        else:
            featured_event = False
        context.update({"featured_event": featured_event})
        return context


class MarketingHostIndex(TemplateView):
    template_name = "marketing/landing/index_host.html"


"""
class EventDiscoveryBrowse(ListView):
	model = Event
	paginate_by = 15
	ordering = ["-modified"]
	context_object_name = "events"
	template_name = "marketing/browse_events.html"

	def get_queryset(self):
		# Get public, published event queryset
		qs = super().get_queryset().filter_active()

		# Filter by available querystings
		query_title = self.request.GET.get("title", "")
		if query_title:
			qs = qs.filter(title__icontains=query_title)

		return qs
"""
