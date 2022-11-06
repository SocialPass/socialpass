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
    DestroyModelMixin,
    RetrieveModelMixin,
):
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
    create and retrieve CheckoutSession view
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

    def _perform_create(self, serializer, event, checkoutitem_set):
        """
        _perform_create method. used for creating a model
        utilized in CheckoutSessionView.create()
        """
        validated_data = serializer.validated_data
        del validated_data["checkoutitem_set"], validated_data["event"]

        # create CheckoutSession and CheckoutItems
        checkout_session = CheckoutSession.objects.create(**validated_data, event=event)
        try:
            for checkout_item in checkoutitem_set:
                checkout_item = CheckoutItem(
                    checkout_session=checkout_session, **checkout_item
                )
                checkout_item.clean()
                checkout_item.save()
        except exceptions.TooManyTicketsRequestedError as e:
            raise ValidationError(code="item-quantity-exceed", detail=e)
        except exceptions.DuplicatesTiersRequestedError as e:
            raise ValidationError(code="repeated-ticket-tier", detail=e)
        except exceptions.ConflictingTiersRequestedError as e:
            raise ValidationError(code="not-supported-ticket-tier", detail=e)

        return checkout_session

    def _perform_create_transaction(self, checkout_session: CheckoutSession):
        """
        _perform_create_transaction method.
        create and return a new transaction based on the tx_type requested
        """
        tx_types = CheckoutSession.TransactionType

        match checkout_session.tx_type:
            case tx_types.FIAT:
                tx = TxFiat.objects.create()
                tx.process()
                return tx
            case tx_types.BLOCKCHAIN:
                tx = TxBlockchain.objects.create()
                tx.process()
                return tx
            case tx_types.ASSET_OWNERSHIP:
                tx = TxAssetOwnership.objects.create()
                tx.process()
                return tx

    def _perform_update_session_tx(self, checkout_session, tx):
        """
        _perform_update_session_tx method.
        used for updating a session transaction (CheckoutSession.tx_*)
        update a checkout_session with a transaction
        once updated, mark as PROCESSING
        """
        tx_types = CheckoutSession.TransactionType

        match checkout_session.tx_type:
            case tx_types.FIAT:
                checkout_session.tx_fiat = tx
            case tx_types.BLOCKCHAIN:
                checkout_session.tx_blockchain = tx
            case tx_types.ASSET_OWNERSHIP:
                checkout_session.tx_asset_ownership = tx

        # change tx_status to PROCESSING here
        checkout_session.tx_status = CheckoutSession.OrderStatus.PROCESSING
        checkout_session.save()

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

    def retrieve(self, request, *args, **kwargs):
        """
        retrieve a CheckoutSession
        """
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        """
        creates a CheckoutSession with CheckoutItems related
        """
        # get `event` and `ticket_tiers` objects.
        # if either one does not exist, returns 404
        try:
            event = Event.objects.get(public_id=request.data["event"])
        except Event.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    "code": "public-id-not-found",
                    "message": "The event does not exist.",
                },
            )

        items = []
        for data in request.data["checkout_items"]:
            try:
                items.append(
                    {
                        "ticket_tier": TicketTier.objects.get(
                            public_id=data["ticket_tier"]
                        ),
                        "quantity": data["quantity"],
                    }
                )
            except TicketTier.DoesNotExist:
                return Response(
                    status=status.HTTP_404_NOT_FOUND,
                    data={
                        "code": "public-id-not-found",
                        "message": (
                            f"The ticket_tier `{data['ticket_tier']}` does not exist."
                        ),
                    },
                )

        # serialize and create data
        # raise exceptions on errors
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        checkout_session = self._perform_create(
            serializer=serializer, event=event, checkoutitem_set=items
        )

        # return serialized checkout session
        headers = self.get_success_headers(serializer.data)
        result = serializers.CheckoutSessionReadSerializer(checkout_session)
        return Response(result.data, status=status.HTTP_201_CREATED, headers=headers)

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
        create Transaction and update CheckoutSession (CheckoutSession.tx_*)
        """
        checkout_session = self.get_object()
        tx = self._perform_create_transaction(checkout_session)
        self._perform_update_session_tx(checkout_session, tx)
        serializer = self.get_serializer(tx)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=["get"], detail=True)
    def confirmation(self, request, *args, **kwargs):
        """
        get tx_type and perform confirmation
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        self._perform_confirmation(instance)
        return Response(serializer.data)
