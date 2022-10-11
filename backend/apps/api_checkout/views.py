from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
)
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.api_checkout import serializers
from apps.root.models import CheckoutItem, CheckoutSession, Event, TicketTier


class EventView(GenericViewSet, RetrieveModelMixin):
    """list and retrieve Event view"""

    queryset = Event.objects.all().order_by("-created")
    serializer_class = serializers.EventSerializer
    lookup_field = "public_id"

    def get_serializer_class(self):
        if self.action in ("ticket_tiers",):
            return serializers.TicketTierSerializer
        return super().get_serializer_class()

    def retrieve(self, request, *args, **kwargs):
        """
        retrieve an event
        """
        return super().retrieve(request, *args, **kwargs)

    @action(methods=["get"], detail=True)
    def ticket_tiers(self, request, *args, **kwargs):
        """
        list ticket tiers from event
        """
        ticket_tiers_qs = self.get_object().ticket_tiers.all()
        serializer = self.get_serializer(ticket_tiers_qs, many=True)
        return Response(serializer.data)


class CheckoutItemView(
    GenericViewSet,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    RetrieveModelMixin,
):
    """
    create and retrieve CheckoutItem view
    """

    queryset = CheckoutItem.objects.all().order_by("-created")
    serializer_class = serializers.CheckoutItemReadSerializer
    input_serializer = serializer_class
    output_serializer = serializer_class
    lookup_field = "public_id"
    paginate_by = 15

    def get_serializer_class(self):
        if self.action in ("update",):
            return serializers.CheckoutItemUpdateSerializer
        elif self.action in ("create",):
            return serializers.CheckoutItemCreateSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer) -> None:
        return serializer.save()

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=input_serializer,
        responses={200: output_serializer},
    )
    def create(self, request, *args, **kwargs):
        try:
            ticket_tier = TicketTier.objects.get(public_id=request.data["ticket_tier"])
            checkout_session = CheckoutSession.objects.get(
                public_id=request.data["checkout_session"]
            )
        except (TicketTier.DoesNotExist, CheckoutSession.DoesNotExist) as e:  # noqa
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    "code": "public-id-invalid-not-found",
                    "message": "The ticket_tier or checkout_session does not exist.",
                },
            )

        request.data["ticket_tier"] = ticket_tier.pk
        request.data["checkout_session"] = checkout_session.pk
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        checkout_item = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        result = serializers.CheckoutItemReadSerializer(checkout_item)
        return Response(result.data, status=status.HTTP_201_CREATED, headers=headers)
