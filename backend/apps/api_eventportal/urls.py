from django.urls import path

from . import views

urlpatterns = [
    path(
        "retrieve/<str:public_id>/",
        views.EventPortalRetrieve.as_view(),
        name="eventportal_retrieve",
    ),
    path(
        "request-access/<str:public_id>",
        views.EventPortalRequestAccess.as_view(),
        name="eventportal_request",
    ),
    path(
        "verify-access/<str:public_id>",
        views.EventPortalVerifyAccess.as_view(),
        name="eventportal_verify",
    ),
    path(
        "grant-access/<str:public_id>",
        views.EventPortalIssueTickets.as_view(),
        name="eventportal_-grant-access",
    ),
]
