from django.urls import path

from . import views

app_name = "root"
urlpatterns = [
    # tokengate widget
    path(
        "tokengates/retrieve/<str:public_id>/",
        views.TokenGateRetrieve.as_view(),
        name="ticketgate-retrieve",
    ),
    path(
        "tokengates/request-access/",
        views.TokenGateRequestAccess.as_view(),
        name="ticketgate-access",
    ),
    path(
        "ticketgates/grant-access/",
        views.TicketGateGrantAccess.as_view(),
        name="ticketgate-access",
    ),
    # ticketing
    path(
        "ticketgates/scan/",
        views.TicketGateScanner.as_view(),
        name="ticketgate-scan"
    ),
    # explore
    path(
        "explore/",
        views.ExplorePageRetrieve.as_view(),
        name="explore"
    ),
]
