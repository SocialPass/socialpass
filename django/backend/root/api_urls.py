from django.urls import include, path
from rest_framework.routers import DefaultRouter, SimpleRouter
from .api_views import (
    AirdropGateRetrieve,
    AirdropGateAccess,
    TicketGateRetrieve,
    TicketGateAccess
)

app_name = "root"
urlpatterns = [
    #airdrop
    path("airdropgates/retrieve/<str:public_id>/", AirdropGateRetrieve.as_view(), name='airdropgate-retrieve'),
    path("airdropgates/access/", AirdropGateAccess.as_view(), name='airdropgate-access'),
    #ticketing
    path("ticketgates/retrieve/<str:public_id>/", TicketGateRetrieve.as_view(), name='ticketgate-retrieve'),
    path("ticketgates/access/", TicketGateAccess.as_view(), name='ticketgate-access'),
]
