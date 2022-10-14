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
from apps.root.exceptions import TooManyTicketsRequestedError
from apps.root.models import CheckoutItem, CheckoutSession, Event, TicketTier


class EventView(GenericViewSet, RetrieveModelMixin):
    """
    Generic Viewset for the Event API.
    Responsible for retrieving event & its ticket tiers
    """

    queryset = Event.objects.all().order_by("-created")
    lookup_field = "public_id"
    lookup_url_kwarg = "event_public_id"

    def get_serializer_class(self):
        """
        get serializer class
        """
        match self.action:
            case "retrieve":
                return serializers.EventSerializer
            case "ticket_tiers":
                return serializers.TicketTierSerializer
            case _:
                return serializers.EventSerializer
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
        ticket_tiers_qs = self.get_object().tickettier_set.all()
        serializer = self.get_serializer(ticket_tiers_qs, many=True)
        return Response(serializer.data)


class CheckoutItemView(
    GenericViewSet,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    RetrieveModelMixin,
):
    queryset = CheckoutItem.objects.all().order_by("-created")
    lookup_field = "public_id"
    lookup_url_kwarg = "checkoutitem_public_id"

    def get_serializer_class(self):
        """
        get serializer class
        """
        match self.action:
            case "create":
                return serializers.CheckoutItemCreateSerializer
            case "update":
                return serializers.CheckoutItemUpdateSerializer
            case _:
                return serializers.CheckoutItemReadSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        """
        creates a new item.
        """
        # get `ticket_tier` and `checkout_session` objects.
        # if either one does not exist, returns 404
        try:
            ticket_tier = TicketTier.objects.get(public_id=request.data["ticket_tier"])
            checkout_session = CheckoutSession.objects.get(
                public_id=request.data["checkout_session"]
            )
        except TicketTier.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    "code": "public-id-not-found",
                    "message": "The ticket_tier does not exist.",
                },
            )
        except CheckoutSession.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    "code": "public-id-not-found",
                    "message": "The checkout_session does not exist.",
                },
            )

        # serialize data
        # raise exceptions on is_valid
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # save serialized data
        # throw exception on quantity error
        try:
            checkout_item = serializer.save(
                ticket_tier=ticket_tier, checkout_session=checkout_session
            )
        except TooManyTicketsRequestedError:
            return Response(
                status=status.HTTP_409_CONFLICT,
                data={
                    "code": "item-quantity-exceed",
                    "message": "This Item quantity is not available.",
                },
            )

        # return serialized checkout item
        headers = self.get_success_headers(serializer.data)
        result = serializers.CheckoutItemReadSerializer(checkout_item)
        return Response(result.data, status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        """
        retrieve an event
        """
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """
        update an item.
        if quantity > quantity available, returns 409
        """
        try:
            return super().update(request, *args, **kwargs)
        except TooManyTicketsRequestedError:
            return Response(
                status=status.HTTP_409_CONFLICT,
                data={
                    "code": "item-quantity-exceed",
                    "message": "This Item quantity is not available.",
                },
            )

    def destroy(self, request, *args, **kwargs):
        """
        delete an item
        """
        return super().destroy(request, *args, **kwargs)
