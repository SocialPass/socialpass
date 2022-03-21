from django.urls import path

from .api_views import TicketGateAccess, TicketGateRetrieve

app_name = "root"
urlpatterns = [
    # ticketing
    path(
        "ticketgates/retrieve/<str:public_id>/",
        TicketGateRetrieve.as_view(),
        name="ticketgate-retrieve",
    ),
    path("ticketgates/access/", TicketGateAccess.as_view(), name="ticketgate-access"),
]
