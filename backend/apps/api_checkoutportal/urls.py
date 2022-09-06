from django.urls import path

from . import views

app_name = "api_checkoutportal"
urlpatterns = [
    path(
        "get/<uuid:event_public_id>/",
        views.CheckoutPortalRetrieve.as_view(),
        name="retrieve",
    ),
]
