from django.urls import path, re_path

from . import views

app_name = "discovery"

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
    path(
        "get-tickets/<uuid:checkout_session_public_id>",
        views.GetTickets.as_view(),
        name="get_tickets",
    ),
    path(
        "nft-checkout/",
        views.NFTCheckout.as_view(),
        name="nft_checkout",
    ),
    path(
        "e/<int:event_id>/<slug:event_slug>/",
        views.EventDetails.as_view(),
        name="event_detals"
    ),
    path(
        "e/<int:event_id>/<slug:event_slug>/",
        views.EventDetails.as_view(),
        name="event_detals"
    ),
    re_path(
        r"e/(?P<event_id>\d+)/(?P<event_slug>[-\w]+)/(?P<checkout_type>free|fiat|crypto|nft)/",
        views.EventDetails.as_view(),
        name="event_detals"
    ),
    path("checkout-two/", views.CheckoutPageTwo.as_view(), name="checkout_two"),
]
