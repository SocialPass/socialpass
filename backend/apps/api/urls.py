from django.urls import path

from . import views

app_name = "root"
urlpatterns = [
    # hosted page
    path("hostedpage/", views.HostedPageRetrieve.as_view()),
    # tokengates
    path(
        "tokengates/retrieve/<str:public_id>/",
        views.TokenGateRetrieve.as_view(),
        name="ticketgate-retrieve",
    ),
    # ticketing
    path(
        "ticketgates/access/",
        views.TicketGateAccess.as_view(),
        name="ticketgate-access",
    ),
    path(
        "ticketgates/scan/",
        views.TicketGateScanner.as_view(),
        name="ticketgate-scan"
    )
]
