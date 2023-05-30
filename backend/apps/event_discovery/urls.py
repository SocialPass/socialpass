from django.urls import path, re_path

from . import views

app_name = "discovery"

urlpatterns = [
    path(
        "get-tickets/<uuid:checkout_session_public_id>",
        views.GetTickets.as_view(),
        name="get_tickets",
    ),
    path(
        "e/<int:event_id>/<slug:event_slug>/",
        views.CheckoutPageOne.as_view(),
        name="checkout_one",
    ),
    re_path(
        r"e/(?P<event_id>\d+)/(?P<event_slug>[-\w]+)/(?P<checkout_type>free|fiat|crypto|nft)/",
        views.CheckoutPageOne.as_view(),
        name="checkout_one",
    ),
    path(
        "checkout-two/<uuid:checkout_session_public_id>/",
        views.CheckoutPageTwo.as_view(),
        name="checkout_two",
    ),
    path(
        "checkout-success/<uuid:checkout_session_public_id>/",
        views.CheckoutPageSuccess.as_view(),
        name="checkout_success",
    ),
]
