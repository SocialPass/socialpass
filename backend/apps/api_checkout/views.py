from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.api_checkout import serializers
from apps.root.models import Event


class EventView(ReadOnlyModelViewSet):
    """list and retrieve Event view"""

    queryset = Event.objects.all().order_by("-created")
    serializer_class = serializers.EventSerializer
    input_serializer = None
    output_serializer = serializer_class
    lookup_field = "public_id"
    paginate_by = 15

    def get_serializer_class(self):
        if self.action in ("ticket_tiers",):
            return serializers.TicketTierSerializer
        return super().get_serializer_class()

    @swagger_auto_schema(
        request_body=input_serializer,
        responses={200: output_serializer},
    )
    def retrieve(self, request, *args, **kwargs):
        """
        retrieve an event
        """
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=input_serializer,
        responses={200: output_serializer},
    )
    def list(self, request):
        """
        list paginated events
        """
        return super().list(request)

    @swagger_auto_schema(
        request_body=input_serializer,
        responses={200: serializers.TicketTierSerializer},
    )
    @action(methods=["get"], detail=True)
    def ticket_tiers(self, request, *args, **kwargs):
        """
        list ticket tiers from event
        """
        ticket_tiers_qs = self.get_object().ticket_tiers.all()
        serializer = self.get_serializer(ticket_tiers_qs, many=True)
        return Response(serializer.data)
