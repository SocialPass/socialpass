from django.views.generic.base import TemplateView
from django.views.generic.list import ListView
from apps.root.models import Event, Team


class StatsPageView(TemplateView):
    template_name = "staff_dashboard/stats.html"


class EventListView(ListView):
    model = Event
    template_name = "staff_dashboard/list_events.html"


class TeamListView(ListView):
    model = Team
    template_name = "staff_dashboard/list_teams.html"
