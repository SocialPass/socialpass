from django.urls import path

from . import views

app_name = "root"
urlpatterns = [
    path(
        "tokengates/retrieve/<str:public_id>/",
        views.TokenGateRetrieve.as_view(),
        name="ticketgate-retrieve",
    ),
    path(
        "ticketgates/request-access/<str:public_id>",
        views.TicketGateRequestAccess.as_view(),
        name="tokengate-request-access",
    ),
    path(
        "ticketgates/grant-access/<str:public_id>",
        views.TicketGateGrantAccess.as_view(),
        name="tokengate-grant-access",
    ),
]
