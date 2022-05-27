from django.urls import path

from . import views

urlpatterns = [
    path(
        "ticketed-event/<uuid:access_key>",
        views.TicketedEventRetrieve.as_view(),
        name="ticketedevent-retrieve",
    ),
    path(
        "ticketed-event/<uuid:access_key>/scan-ticket",
        views.ScanTicket.as_view(),
        name="scan-ticket",
    ),
]
