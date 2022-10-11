from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.api_checkout import serializers
from apps.root.models import Event


class EventView(ReadOnlyModelViewSet):
    """list and retrieve Event view"""

    queryset = Event.objects.all().order_by("-created")
    serializer_class = serializers.EventSerializer
    lookup_field = "public_id"
    paginate_by = 15

    def get_serializer_class(self):
        if self.action in ("ticket_tiers",):
            return serializers.TicketTierSerializer
        return super().get_serializer_class()

    def retrieve(self, request, *args, **kwargs):
        """
        retrieve an event
        """
        return super().retrieve(request, *args, **kwargs)

    def list(self, request):
        """
        list paginated events
        """
        return super().list(request)

    @action(methods=["get"], detail=True)
    def ticket_tiers(self, request, *args, **kwargs):
        """
        list ticket tiers from event
        """
        ticket_tiers_qs = self.get_object().ticket_tiers.all()
        serializer = self.get_serializer(ticket_tiers_qs, many=True)
        return Response(serializer.data)
