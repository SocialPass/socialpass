from django.urls import path

from . import views

urlpatterns = [
    path(
        "<uuid:access_key>/scan-landing",
        views.TicketedEventRetrieve.as_view(),
        name="scan-landing",
    ),
    path(
        "<uuid:access_key>/scan-ticket",
        views.ScanTicket.as_view(),
        name="scan-ticket",
    ),
]
