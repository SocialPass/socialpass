from django.urls import path

from . import views

urlpatterns = [
    path(
        "ticketed-event/retrieve/<str:public_id>/",
        views.TicketedEventRetrieve.as_view(),
        name="ticketedevent-retrieve",
    ),
    path(
        "ticketed-event/request-access/<str:public_id>",
        views.TicketedEventRequestAccess.as_view(),
        name="ticketedevent-request-access",
    ),
    path(
        "ticketed-event/grant-access/<str:public_id>",
        views.TicketedEventGrantAccess.as_view(),
        name="ticketedevent-grant-access",
    ),
]
