from django.urls import path

from . import views

app_name = "api_checkoutportal"
urlpatterns = [
    path(
        "retrieve/<uuid:public_id>/",
        views.CheckoutPortalRetrieve.as_view(),
        name="retrieve",
    ),
    path(
        "request/<uuid:public_id>/",
        views.CheckoutPortalOwnershipRequest.as_view(),
        name="request",
    ),
    path(
        "verify/<uuid:public_id>/",
        views.CheckoutPortalOwnershipVerify.as_view(),
        name="verify",
    ),
    path(
        "confirmation/<uuid:public_id>/",
        views.CheckoutPortalConfirmation.as_view(),
        name="confirmation",
    ),
]
