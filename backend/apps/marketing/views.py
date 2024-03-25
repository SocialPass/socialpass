from django.views.generic import TemplateView

class MarketingIndex(TemplateView):
    template_name = "landing/index.html"


"""
class MarketingHostIndex(TemplateView):
    template_name = "marketing/landing/index_host.html"
"""

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
