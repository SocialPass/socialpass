from django.urls import path

from . import views

app_name = "root"
urlpatterns = [
    path(
        "event-portal/retrieve/<str:public_id>/",
        views.TicketedEventRetrieve.as_view(),
        name="ticketgate-retrieve",
    ),
    path(
        "event-portal/request-access/<str:public_id>",
        views.TicketedEventRequestAccess.as_view(),
        name="tokengate-request-access",
    ),
    path(
        "event-portal/grant-access/<str:public_id>",
        views.TicketedEventGrantAccess.as_view(),
        name="tokengate-grant-access",
    ),
]
