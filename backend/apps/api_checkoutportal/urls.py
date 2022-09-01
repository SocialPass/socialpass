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
        views.CheckoutPortalRequest.as_view(),
        name="request",
    ),
    path(
        "process/<uuid:public_id>/",
        views.CheckoutPortalProcess.as_view(),
        name="process",
    ),
]
