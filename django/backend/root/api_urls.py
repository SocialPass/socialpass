from django.urls import include, path
from rest_framework.routers import DefaultRouter, SimpleRouter
from .api_views import (
    AirdropGateRetrieve,
    AirdropGateAccess,
)

app_name = "root"
urlpatterns = [
   path("airdropgates/retrieve/<str:public_id>/", AirdropGateRetrieve.as_view(), name='airdropgate-retrieve'),
   path("airdropgates/access/", AirdropGateAccess.as_view(), name='airdropgate-access'),
]
