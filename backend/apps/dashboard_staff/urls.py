from django.urls import path
from django.contrib.admin.views.decorators import staff_member_required

from . import views

app_name = "dashboard_staff"

urlpatterns = [
    path("", staff_member_required(views.StatsPageView.as_view()), name="stats"),
    path(
        "events/", staff_member_required(views.EventListView.as_view()), name="events"
    ),
    path("teams/", staff_member_required(views.TeamListView.as_view()), name="teams"),
    path(
        "overflow-sessions/",
        staff_member_required(views.OverflowSessionsListView.as_view()),
        name="overflow_sessions",
    ),
]
