from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from apps.root.models import Event


class EventDiscoveryIndex(TemplateView):
    template_name = "event_discovery/index.html"


class EventDiscoveryBrowse(ListView):
    model = Event
    context_object_name = "events"
    template_name = "event_discovery/browse_events.html"

    def get_queryset(self):
        qs = Event.objects.filter_published().filter_public()
        return qs


class EventDiscoveryDetails(DetailView):
    model = Event
    context_object_name = "event"
    template_name = "event_discovery/event_details.html"
