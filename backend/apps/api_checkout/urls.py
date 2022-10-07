from django.urls import path

from . import views

app_name = "api_checkout"
urlpatterns = [
    path(
        "event/",
        views.EventView.as_view({"get": "list"}),
        name="event_list",
    ),
    path(
        "event/<uuid:public_id>/",
        views.EventView.as_view({"get": "retrieve"}),
        name="event_retrieve",
    ),
    path(
        "event/<uuid:public_id>/ticket_tiers/",
        views.EventView.as_view({"get": "ticket_tiers"}),
        name="event_ticket_tiers",
    ),
]
