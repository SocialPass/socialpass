from django.urls import path

from . import views

app_name = "api_checkout"
urlpatterns = [
    path(
        "event/<uuid:event_public_id>/",
        views.EventView.as_view({"get": "retrieve"}),
        name="event_retrieve",
    ),
    path(
        "event/<uuid:event_public_id>/ticket_tiers/",
        views.EventView.as_view({"get": "ticket_tiers"}),
        name="event_ticket_tiers",
    ),
    path(
        "item/",
        views.CheckoutItemView.as_view({"post": "create"}),
        name="item_create",
    ),
    path(
        "item/<uuid:checkoutitem_public_id>/",
        views.CheckoutItemView.as_view(
            {"get": "retrieve", "put": "update", "delete": "destroy"}
        ),
        name="item_details",
    ),
]
