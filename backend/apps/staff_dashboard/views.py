import datetime
from django.views.generic.base import TemplateView
from django.views.generic.list import ListView
from django.db.models.functions import ExtractWeek
from django.db.models import Count
from apps.root.models import Event, Team, User


class StatsPageView(TemplateView):
    template_name = "staff_dashboard/stats.html"
    """
    - Total Organizer Signups
    - Total Events Created
    - Total Tickets Sold
    - Total Attendees
    - Average Tickets (per event)
    - Average Attendees (per event)
    - Average Time to Ticket
    """

    def get_context_data(self):
        context = super().get_context_data()

        # Get week number, used in future queries
        current_week = datetime.datetime.now().isocalendar()[1]
        context["weeks"] = [i + 1 for i in range(0, current_week)]

        # Organizer Stats
        organizers_weekly = list(
            User.objects.annotate(week=ExtractWeek("date_joined"))
            .values("week")
            .annotate(total=Count("id"))
            .values("week", "total")
        )
        context["organizers_weekly"] = {}
        for week in context["weeks"]:
            context["organizers_weekly"][week] = "0"
            for i in organizers_weekly:
                if week == i["week"]:
                    context["organizers_weekly"][week] = str(i["total"])
        context["organizers_weekly"] = list(context["organizers_weekly"].values())
        return context


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
