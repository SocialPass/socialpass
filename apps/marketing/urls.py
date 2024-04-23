from django.urls import path

from . import views

app_name = "marketing"

urlpatterns = [
    path("", views.MarketingIndex.as_view(), name="index")
    # path("host/", views.MarketingHostIndex.as_view(), name="index_host"),
    # path("events/browse", views.EventDiscoveryBrowse.as_view(), name="browse"),
]
