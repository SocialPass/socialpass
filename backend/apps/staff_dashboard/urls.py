from django.urls import path

from . import views

app_name = "staff_dashboard"

urlpatterns = [
    path("", views.StatsPageView.as_view(), name="stats"),
    path("events/", views.EventListView.as_view(), name="events"),
    path("teams/", views.TeamListView.as_view(), name="teams"),
]
