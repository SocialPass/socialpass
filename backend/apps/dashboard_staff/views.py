from io import BytesIO
import base64
import datetime
import statistics
import qrcode
from django.http import Http404
from django.shortcuts import render
from django.views.generic import View
from django.views.generic.base import TemplateView
from django.views.generic.list import ListView
from django.db.models.functions import ExtractWeek
from django.db.models import Avg, F, Count
from apps.root.models import Event, Team, User, Ticket, CheckoutSession


class StatsPageView(TemplateView):
    template_name = "dashboard_staff/stats.html"
    """
    - Total Organizer Signups
    - Total Events Created
    - Total Tickets Sold
    - Total Attendees
    - Average Tickets (per event)
    - Average Attendees (per event)
    - Average Time to Ticket
    """

    def get_total_sum(self, data=[]):
        """
        Returns total sum given a list of values
        Return in float
        """
        total = [float(i) for i in data]
        return sum(total)

    def get_monthly_sum(self, data=[]):
        """
        Returns a monthly sum given a list
        Return in float
        """
        monthly = data[-4] or data
        monthly = [float(i) for i in monthly]
        return sum(monthly)

    def get_total_avg(self, data=[]):
        """
        Returns total sum given a list of values
        Return in float
        """
        total = []
        for i in data:
            total.append(float(i))
        return statistics.mean(total)

    def get_monthly_avg(self, data=[]):
        """
        Returns a monthly sum given a list
        Return in float
        """
        monthly = data[-4] or data
        monthly = []
        for i in data:
            monthly.append(float(i))
        return statistics.mean(monthly)

    def get_context_data(self):
        context = super().get_context_data()

        ## Get week number, used in future queries
        current_week = datetime.datetime.now().isocalendar()[1]
        weeks = [i + 1 for i in range(0, current_week)]
        context["weeks"] = [
            datetime.date.fromisocalendar(2023, week, 1).strftime("%b %d")
            for week in weeks
        ]  # (YWD)

        ## Organizer Sign Ups
        organizers_weekly = list(
            User.objects.annotate(week=ExtractWeek("date_joined"))
            .values("week")
            .annotate(total=Count("id"))
            .values("week", "total")
        )
        context["organizers_weekly"] = {}
        for week in weeks:
            context["organizers_weekly"][week] = "0"
            for i in organizers_weekly:
                if week == i["week"]:
                    context["organizers_weekly"][week] = str(i["total"])
        organizers_weekly = list(context["organizers_weekly"].values())
        context["organizers_weekly"] = organizers_weekly
        context["organizers_monthly"] = self.get_monthly_sum(data=organizers_weekly)
        context["organizers_total"] = self.get_total_sum(data=organizers_weekly)

        ## Events Created
        events_weekly = list(
            Event.objects.annotate(week=ExtractWeek("created"))
            .values("week")
            .annotate(total=Count("id"))
            .values("week", "total")
        )
        context["events_weekly"] = {}
        for week in weeks:
            context["events_weekly"][week] = "0"
            for i in events_weekly:
                if week == i["week"]:
                    context["events_weekly"][week] = str(i["total"])
        events_weekly = list(context["events_weekly"].values())
        context["events_weekly"] = events_weekly
        context["events_monthly"] = self.get_monthly_sum(data=events_weekly)
        context["events_total"] = self.get_total_sum(data=events_weekly)

        ## Tickets Sold
        tickets_weekly = list(
            Ticket.objects.annotate(week=ExtractWeek("created"))
            .values("week")
            .annotate(total=Count("id"))
            .values("week", "total")
        )
        context["tickets_weekly"] = {}
        for week in weeks:
            context["tickets_weekly"][week] = "0"
            for i in tickets_weekly:
                if week == i["week"]:
                    context["tickets_weekly"][week] = str(i["total"])
        tickets_weekly = list(context["tickets_weekly"].values())
        context["tickets_weekly"] = tickets_weekly
        context["tickets_monthly"] = self.get_monthly_sum(data=tickets_weekly)
        context["tickets_total"] = self.get_total_sum(data=tickets_weekly)

        ## Attendees (Tickets Scanned)
        attendees_weekly = list(
            Ticket.objects.filter(redeemed_at__isnull=False)
            .annotate(week=ExtractWeek("created"))
            .values("week")
            .annotate(total=Count("id"))
            .values("week", "total")
        )
        context["attendees_weekly"] = {}
        for week in weeks:
            context["attendees_weekly"][week] = "0"
            for i in attendees_weekly:
                if week == i["week"]:
                    context["attendees_weekly"][week] = str(i["total"])
        attendees_weekly = list(context["attendees_weekly"].values())
        context["attendees_weekly"] = attendees_weekly
        context["attendees_monthly"] = self.get_monthly_sum(data=attendees_weekly)
        context["attendees_total"] = self.get_total_sum(data=attendees_weekly)

        ## Average Time to Ticket
        ticket_time_weekly = (
            Ticket.objects.annotate(week=ExtractWeek("created"))
            .values("week")
            .annotate(total=Avg(F("created") - F("checkout_session__created")))
            .values("week", "total")
        )
        context["ticket_time_weekly"] = {}
        for week in weeks:
            context["ticket_time_weekly"][week] = "0"
            for i in ticket_time_weekly:
                if week == i["week"]:
                    context["ticket_time_weekly"][week] = str(
                        i["total"].total_seconds()
                    )
        ticket_time_weekly = list(context["ticket_time_weekly"].values())
        context["ticket_time_weekly"] = ticket_time_weekly
        context["ticket_time_monthly"] = self.get_monthly_avg(data=ticket_time_weekly)
        context["ticket_time_total"] = self.get_total_avg(data=ticket_time_weekly)
        return context


class EventListView(ListView):
    model = Event
    paginate_by = 25
    ordering = ["-start_date"]
    template_name = "dashboard_staff/list_events.html"


class TeamListView(ListView):
    model = Team
    paginate_by = 25
    ordering = ["-modified"]
    template_name = "dashboard_staff/list_teams.html"


class CheckoutSessionListView(ListView):
    model = CheckoutSession
    paginate_by = 25
    template_name = "dashboard_staff/list_sessions.html"

    def get_queryset(self):
        return (
            CheckoutSession.objects.select_related("event")
            .prefetch_related("checkoutitem_set", "checkoutitem_set__ticket_tier")
            .filter(order_status=CheckoutSession.OrderStatus.FULFILLED)
        )


class CheckoutSessionTicketDownloadView(View):
    """
    Get tickets for a checkout session
    """

    def get_object(self):
        try:
            return CheckoutSession.objects.select_related(
                "event",
                "event__team",
                "event__team__whitelabel",
            ).get(
                public_id=self.kwargs["checkout_session_public_id"],
            )
        except Exception as e:
            print(e)
            raise Http404()

    def get(self, *args, **kwargs):
        """
        override get view to handle passcode
        """
        checkout_session = self.get_object()
        ctx = {
            "current_team": checkout_session.event.team,
            "checkout_session": checkout_session,
        }
        ctx["checkout_items"] = checkout_session.checkoutitem_set.select_related(
            "ticket_tier"
        ).all()
        tickets = Ticket.objects.select_related("ticket_tier").filter(
            checkout_session=checkout_session
        )
        ctx["tickets"] = []
        for ticket in tickets:
            # QR code
            img = qrcode.make(ticket.embed_code)
            stream = BytesIO()
            img.save(stream, format="PNG")

            # Add ticket to context
            ctx["tickets"].append(
                {
                    "object": ticket,
                    "qrcode": "data:image/png;base64,"
                    + base64.b64encode(stream.getvalue()).decode("utf-8"),
                }
            )
        return render(self.request, "checkout/get_tickets.html", ctx)
