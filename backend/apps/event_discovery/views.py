from django.conf import settings
from django.views.generic import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from apps.root.models import Event


class EventDiscoveryIndex(TemplateView):
    template_name = "event_discovery/index.html"

    def get_context_data(self, **kwargs):
        """
        featured events
        """
        context = super().get_context_data(**kwargs)
        featured_events = Event.objects.filter_featured()[:3]
        context.update({"featured_events": featured_events})
        return context


class EventDiscoveryBrowse(ListView):
    model = Event
    paginate_by = 15
    ordering = ["-modified"]
    context_object_name = "events"
    template_name = "event_discovery/browse_events.html"

    def get_queryset(self):
        # Get public, published event queryset
        qs = super().get_queryset().filter_publicly_accessible()

        # Filter by available querystings
        query_title = self.request.GET.get("title", "")
        if query_title:
            qs = qs.filter(title__icontains=query_title)

        return qs


class EventDiscoveryDetails(DetailView):
    model = Event
    slug_field = "public_id"
    slug_url_kwarg = "event_public_id"
    context_object_name = "event"
    template_name = "event_discovery/event_details.html"

    def get_queryset(self):
        qs = super().get_queryset().filter_publicly_accessible()
        return qs.filter(public_id=self.kwargs["event_public_id"])

    def get_context_data(self, **kwargs):
        """
        Fetch ticket info
        """
        context = super().get_context_data(**kwargs)
        ticket_count = self.object.tickets.count()
        tickets_remaining = self.object.capacity - ticket_count
        context.update(
            {
                "ticket_count": ticket_count,
                "tickets_remaining": tickets_remaining,
                "checkoutportal_base_url": settings.CHECKOUT_PORTAL_BASE_URL,
            }
        )
        return context
