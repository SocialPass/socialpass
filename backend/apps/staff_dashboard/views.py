from django.views.generic.base import TemplateView
from django.views.generic.list import ListView
from apps.root.models import Event, Team


class StatsPageView(TemplateView):
    template_name = "staff_dashboard/stats.html"


class EventListView(ListView):
    model = Event
    paginate_by = 25
    ordering = ["-start_date"]
    template_name = "staff_dashboard/list_events.html"


class TeamListView(ListView):
    model = Team
    paginate_by = 25
    ordering = ["-modified"]
    template_name = "staff_dashboard/list_teams.html"
