from django.urls import path

from . import views

app_name = "api_scanner"
urlpatterns = [
    path(
        "<uuid:access_key>/event/",
        views.EventRetrieve.as_view(),
        name="event_scan_info",
    ),
    path(
        "<str:access_key>/claim-ticket/",
        views.ScanTicket.as_view(),
        name="claim_ticket",
    ),
    path(
        "<uuid:access_key>/tickets/",
        views.TicketsListView.as_view(),
        name="tickets",
    ),
]
