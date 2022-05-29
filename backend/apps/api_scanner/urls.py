from django.urls import path

from . import views

urlpatterns = [
    path(
        "landing/<uuid:access_key>/",
        views.TicketedEventRetrieve.as_view(),
        name="scanner_landing",
    ),
    path(
        "scan-ticket/<uuid:access_key>/",
        views.ScanTicket.as_view(),
        name="scanner_ticket",
    ),
]
