from django.urls import path

from . import views

urlpatterns = [
    path(
        "retrieve/<str:public_id>/",
        views.EventPortalRetrieve.as_view(),
        name="ticketgate-retrieve",
    ),
    path(
        "request-access/<str:public_id>",
        views.EventPortalRequestAccess.as_view(),
        name="tokengate-request-access",
    ),
    path(
        "grant-access/<str:public_id>",
        views.EventPortalGrantAccess.as_view(),
        name="tokengate-grant-access",
    ),
]
