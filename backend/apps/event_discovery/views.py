import base64
import qrcode
from io import BytesIO

from django.conf import settings
from django.http import Http404, HttpResponseRedirect
from django.views.generic import TemplateView, View
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from apps.root.models import Event, CheckoutSession, Ticket


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
        qs = super().get_queryset().filter_active()

        # Filter by available querystings
        query_title = self.request.GET.get("title", "")
        if query_title:
            qs = qs.filter(title__icontains=query_title)

        return qs


class EventDiscoveryDetails(View):

    def get(self, *args, **kwargs):
        event_public_id = str(self.kwargs["event_public_id"])
        return HttpResponseRedirect(settings.CHECKOUT_PORTAL_BASE_URL + "/" + event_public_id)


class GetTickets(DetailView):
    model = CheckoutSession
    slug_field = "public_id"
    slug_url_kwarg = "checkout_session_public_id"
    context_object_name = "checkout_session"
    template_name = "event_discovery/get_tickets.html"

    def get_queryset(self):
        try:
            return CheckoutSession.objects.select_related("event").filter(
                public_id=self.kwargs["checkout_session_public_id"],
                passcode=self.request.GET.get("passcode", "-1"),
            )
        except Exception:
            raise Http404()

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        tickets = Ticket.objects.select_related("ticket_tier").filter(
            checkout_session=self.get_object()
        )
        context["tickets"] = []
        for ticket in tickets:
            img = qrcode.make(ticket.embed_code)
            stream = BytesIO()
            img.save(stream, format="PNG")
            context["tickets"].append({
                "object": ticket,
                "qrcode": "data:image/png;base64,"+base64.b64encode(stream.getvalue()).decode("utf-8"),
            })
        return context
