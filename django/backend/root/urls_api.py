from rest_framework.routers import DefaultRouter, SimpleRouter

from django.conf import settings

from .views_api import AirdropGateViewSet, AirdropListViewSet, TicketGateViewSet, TicketListViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()


# Register the routes

router.register(r"airdropgates", AirdropGateViewSet, basename="airdropgates")

router.register(
    r"airdropgates/(?P<tokengate_id>\d+)/airdroplists",
    AirdropListViewSet,
    basename="airdroplists",
)

router.register(r"ticketgates", TicketGateViewSet, basename="ticketgates")

router.register(
    r"ticketgates/(?P<tokengate_id>\d+)/ticketlists",
    TicketListViewSet,
    basename="ticketlists",
)


app_name = "root"
urlpatterns = router.urls
