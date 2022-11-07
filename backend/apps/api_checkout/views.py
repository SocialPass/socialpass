from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
)
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.api_checkout import serializers
from apps.root import exceptions
from apps.root.models import (
    CheckoutItem,
    CheckoutSession,
    Event,
    TicketTier,
    TxAssetOwnership,
    TxBlockchain,
    TxFiat,
)


class EventView(GenericViewSet, RetrieveModelMixin):
    """
    Event ViewSet
    Routes
    - @retrieve: Event Retrieval
    - @ticket_tiers: Event TicketTier's retrieval
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
                return serializers.EventReadSerializer
            case "ticket_tiers":
                return serializers.TicketTierReadSerializer
            case _:
                return serializers.EventReadSerializer

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
    RetrieveModelMixin,
    DestroyModelMixin,
):
    """
    CheckoutItem ViewSet
    Routes:
    - @create: CheckoutItem Creation
    - @retrieve: CheckoutItem Retrieval
    - @update: CheckoutItem Update
    - @destroy: CheckoutItem Deletion
    """

    queryset = (
        CheckoutItem.objects.select_related("checkout_session")
        .all()
        .order_by("-created")
    )
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

    def create(self, request, *args, **kwargs):
        """
        create a CheckoutItem.
        """
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """
        retrieve a CheckoutItem
        """
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """
        update a CheckoutItem
        if quantity > quantity available, returns 409
        """
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        delete a CheckoutItem
        """
        return super().destroy(request, *args, **kwargs)


class CheckoutSessionView(
    GenericViewSet, CreateModelMixin, UpdateModelMixin, RetrieveModelMixin
):
    """
    CheckoutSession Viewset
    Routes:
    - @create: Create CheckoutSession
    - @retrieve: Retrieve CheckoutSession
    - @update: Update CheckoutSession
    - @items: List CheckoutItems from CheckoutSession
    - @transaction: Create Transaction and update CheckoutSession transaction
    - @confirmation: Get tx_type and perform confirmation
    """

    queryset = (
        CheckoutSession.objects.prefetch_related("checkoutitem_set")
        .all()
        .order_by("-created")
    )
    lookup_field = "public_id"
    lookup_url_kwarg = "checkoutsession_public_id"

    def get_serializer_class(self):
        match self.action:
            case "items":
                return serializers.CheckoutItemReadSerializer
            case "create":
                return serializers.CheckoutSessionCreateSerializer
            case "update":
                return serializers.CheckoutSessionUpdateSerializer
            case "transaction":
                return serializers.TransactionCreateSerializer
            case "confirmation":
                return serializers.ConfirmationSerializer
            case _:
                return serializers.CheckoutSessionReadSerializer

    def _perform_confirmation(self, checkout_session):
        """
        _perform_confirmation method.
        used for creating tickets and send email
        - perform the confirmation
        - case tx_status == "COMPLETED" create tickets
            update checkout_session.tx_status to FULFILLED
        return tx_status
        """

        match checkout_session.tx_status:
            case CheckoutSession.OrderStatus.COMPLETED:
                checkout_session.create_items_tickets()
                checkout_session.send_confirmation_email()
                checkout_session.tx_status = CheckoutSession.OrderStatus.FULFILLED
                checkout_session.save()
                return checkout_session.tx_status
            case _:
                return checkout_session.tx_status

    def create(self, request, *args, **kwargs):
        """
        creates a CheckoutSession with CheckoutItems related
        """
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """
        retrieve a CheckoutSession
        """
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """
        update a CheckoutSession
        """
        return super().update(request, *args, **kwargs)

    @action(methods=["get"], detail=True)
    def items(self, request, *args, **kwargs):
        """
        list CheckoutItems from CheckoutSession
        """
        checkout_items_qs = self.get_object().checkoutitem_set.all()
        serializer = self.get_serializer(checkout_items_qs, many=True)
        return Response(serializer.data)

    @action(methods=["post"], detail=True)
    def transaction(self, request, *args, **kwargs):
        """
        process transaction
        """
        return Response("TODO", status=status.HTTP_201_CREATED)

    @action(methods=["get"], detail=True)
    def confirmation(self, request, *args, **kwargs):
        """
        get tx_type and perform confirmation
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        self._perform_confirmation(instance)
        return Response(serializer.data)
