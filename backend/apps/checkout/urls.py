from django.urls import path, re_path

from . import views

app_name = "checkout"

urlpatterns = [
    # Preserve old URLs
    path(
        "event/<slug:event_slug>/",
        views.CheckoutPageOneRedirect.as_view(),
        name="checkout_one_redirect",
    ),
    path(
        "event-2/<uuid:event_uuid_slug>/",
        views.CheckoutPageOneRedirect.as_view(),
        name="checkout_one_redirect",
    ),
    path(
        "events/<int:event_pk_slug>/<slug:extra>/",
        views.CheckoutPageOneRedirect.as_view(),
        name="checkout_one_redirect",
    ),

    # Main checkout flow
    path(
        "e/<slug:team_slug>/<slug:event_slug>/",
        views.CheckoutPageOne.as_view(),
        name="checkout_one",
    ),
    re_path(
        r"e/(?P<team_slug>[-\w]+)/(?P<event_slug>[-\w]+)/(?P<checkout_type>free|fiat|crypto|nft)/",
        views.CheckoutPageOne.as_view(),
        name="checkout_one",
    ),
    path(
        "e/<slug:team_slug>/<slug:event_slug>/checkout/<uuid:checkout_session_public_id>/",
        views.CheckoutPageTwo.as_view(),
        name="checkout_two",
    ),
    path(
        "e/<slug:team_slug>/<slug:event_slug>/checkout-fiat/<uuid:checkout_session_public_id>/",
        views.CheckoutFiat.as_view(),
        name="checkout_fiat",
    ),
    path(
        "e/<slug:team_slug>/<slug:event_slug>/stripe-cancel/<uuid:checkout_session_public_id>/<str:token>/",
        views.StripeCheckoutCancel.as_view(),
        name="stripe_checkout_cancel",
    ),
    path(
        "e/<slug:team_slug>/<slug:event_slug>/stripe-success/<uuid:checkout_session_public_id>/<str:token>/",
        views.StripeCheckoutSuccess.as_view(),
        name="stripe_checkout_success",
    ),
    path(
        "e/<slug:team_slug>/<slug:event_slug>/success/<uuid:checkout_session_public_id>/",
        views.CheckoutPageSuccess.as_view(),
        name="checkout_success",
    ),
    path(
        "joined-waiting-queue/<uuid:checkout_session_public_id>/",
        views.JoinedWaitingQueue.as_view(),
        name="joined_waiting_queue",
    ),

    # Tickets download
    path(
        "get-tickets/<uuid:checkout_session_public_id>",
        views.GetTickets.as_view(),
        name="get_tickets",
    ),
]
