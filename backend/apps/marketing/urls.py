from django.urls import path

from . import views

app_name = "marketing"

urlpatterns = [
    path("", views.EventDiscoveryIndex.as_view(), name="index"),
    path("host/", views.EventDiscoveryHostIndex.as_view(), name="index_host"),
    # path("events/browse", views.EventDiscoveryBrowse.as_view(), name="browse"),
    path(
        "events/<int:event_id>",
        views.EventDiscoveryDetails.as_view(),
        name="details",
    ),
    path(
        "events/<int:event_id>/<slug:event_optional_slug>",
        views.EventDiscoveryDetails.as_view(),
        name="details",
    ),
]
