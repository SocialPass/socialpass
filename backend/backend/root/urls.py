from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from .views import AirdropGateViewSet, AirdropListViewSet, TicketGateViewSet


if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()


# Register the routes

router.register(r"airdropgates", AirdropGateViewSet, basename="airdropgates")

router.register(
	r"airdropgates/(?P<tokengate_id>\d+)/airdroplists",
	AirdropListViewSet,
	basename="airdroplists"
)

router.register(r"ticketgates", TicketGateViewSet, basename="ticketgates")


app_name = "root"
urlpatterns = router.urls
