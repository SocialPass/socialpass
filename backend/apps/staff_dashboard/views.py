import datetime
from django.views.generic.base import TemplateView
from django.views.generic.list import ListView
from django.db.models.functions import ExtractWeek
from django.db.models import Count
from apps.root.models import Event, Team, User, Ticket


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

        ## Organizer Sign Ups
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

        ## Events Created
        events_weekly = list(
            Event.objects.annotate(week=ExtractWeek("created"))
            .values("week")
            .annotate(total=Count("id"))
            .values("week", "total")
        )
        context["events_weekly"] = {}
        for week in context["weeks"]:
            context["events_weekly"][week] = "0"
            for i in events_weekly:
                if week == i["week"]:
                    context["events_weekly"][week] = str(i["total"])
        context["events_weekly"] = list(context["events_weekly"].values())

        ## Tickets Sold
        tickets_weekly = list(
            Ticket.objects.annotate(week=ExtractWeek("created"))
            .values("week")
            .annotate(total=Count("id"))
            .values("week", "total")
        )
        context["tickets_weekly"] = {}
        for week in context["weeks"]:
            context["tickets_weekly"][week] = "0"
            for i in tickets_weekly:
                if week == i["week"]:
                    context["tickets_weekly"][week] = str(i["total"])
        context["tickets_weekly"] = list(context["tickets_weekly"].values())

        # Attendees (Tickets Scanend)
        attendees_weekly = list(
            Ticket.objects.filter(redeemed=True)
            .annotate(week=ExtractWeek("created"))
            .values("week")
            .annotate(total=Count("id"))
            .values("week", "total")
        )
        context["attendees_weekly"] = {}
        for week in context["weeks"]:
            context["attendees_weekly"][week] = "0"
            for i in attendees_weekly:
                if week == i["week"]:
                    context["attendees_weekly"][week] = str(i["total"])
        context["attendees_weekly"] = list(context["attendees_weekly"].values())

        # Average Tickets (per event)

        # Average Attendees (per event)

        # Average Time to Ticket
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
