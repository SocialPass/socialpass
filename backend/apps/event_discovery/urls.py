from django.urls import path

from . import views

app_name = "discovery"

urlpatterns = [
    path("", views.EventDiscoveryIndex.as_view(), name="index"),
    path("events/browse", views.EventDiscoveryBrowse.as_view(), name="browse"),
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
    path(
        "get-tickets/<uuid:checkout_session_public_id>",
        views.GetTickets.as_view(),
        name="get_tickets",
    ),
    path(
        "download_pdf/<uuid:ticket_public_id>",
        views.DownloadPDFView.as_view(),
        name="ticket_pdf",
    ),
    path(
        "download_apple_pass/<uuid:ticket_public_id>",
        views.DownloadApplePassView.as_view(),
        name="ticket_apple",
    ),
    path(
        "google_pass/<uuid:ticket_public_id>",
        views.GooglePassView.as_view(),
        name="ticket_google",
    ),
]
