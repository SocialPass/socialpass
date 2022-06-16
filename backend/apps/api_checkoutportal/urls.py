from django.urls import path

from . import views

urlpatterns = [
    path(
        "retrieve/<str:public_id>/",
        views.CheckoutPortalRetrieve.as_view(),
        name="checkoutportal_retrieve",
    ),
    path(
        "request/<str:public_id>/",
        views.CheckoutPortalRequest.as_view(),
        name="checkoutportal_request",
    ),
    path(
        "process/<str:public_id>/",
        views.CheckoutPortalProcess.as_view(),
        name="checkoutportal_process",
    ),
]
