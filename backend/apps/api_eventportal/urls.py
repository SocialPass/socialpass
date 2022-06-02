from django.urls import path

from . import views

urlpatterns = [
    path(
        "retrieve/<str:public_id>/",
        views.EventPortalRetrieve.as_view(),
        name="eventportal_retrieve",
    ),
    path(
        "request-checkout/<str:public_id>/",
        views.EventPortalRequestCheckout.as_view(),
        name="eventportal_request_checkout",
    ),
    path(
        "process-checkout/<str:public_id>/",
        views.EventPortalProcessCheckout.as_view(),
        name="eventportal_process_checkout",
    ),
]
