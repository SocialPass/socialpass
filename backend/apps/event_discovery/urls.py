from django.urls import path

from . import views

app_name = "discovery"

urlpatterns = [
    path("", views.EventDiscoveryIndex.as_view(), name="index"),
    path("events/browse", views.EventDiscoveryBrowse.as_view(), name="browse"),
    path(
        "events/<uuid:event_public_id>",
        views.EventDiscoveryDetails.as_view(),
        name="details",
    ),
]
