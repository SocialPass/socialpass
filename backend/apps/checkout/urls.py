from django.urls import path, re_path

from . import views

app_name = "checkout"

urlpatterns = [
    path(
        "get-tickets/<uuid:checkout_session_public_id>",
        views.GetTickets.as_view(),
        name="get_tickets",
    ),
    path(
        "event/<slug:event_slug>/",
        views.CheckoutPageOne.as_view(),
        name="checkout_one",
    ),
    re_path(
        r"event/(?P<event_slug>[-\w]+)/(?P<checkout_type>free|fiat|crypto|nft)/",
        views.CheckoutPageOne.as_view(),
        name="checkout_one",
    ),
    path(
        "event/<slug:event_slug>/checkout/<uuid:checkout_session_public_id>/",
        views.CheckoutPageTwo.as_view(),
        name="checkout_two",
    ),
    path(
        "event/<slug:event_slug>/checkout-fiat/<uuid:checkout_session_public_id>/",
        views.CheckoutFiat.as_view(),
        name="checkout_fiat",
    ),
    path(
        "event/<slug:event_slug>/success/<uuid:checkout_session_public_id>/",
        views.CheckoutPageSuccess.as_view(),
        name="checkout_success",
    ),
]
