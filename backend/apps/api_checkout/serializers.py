import copy

from django.templatetags.static import static
from rest_framework import serializers

from apps.root.models import (
    CheckoutItem,
    CheckoutSession,
    Event,
    Team,
    Ticket,
    TicketTier,
    TxAssetOwnership,
    TxBlockchain,
    TxFiat,
)


class TeamReadSerializer(serializers.ModelSerializer):
    """
    Team serializer
    """

    class Meta:
        model = Team
        fields = ["name", "image", "theme"]

    image = serializers.SerializerMethodField()
    theme = serializers.SerializerMethodField()

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            image_url = obj.image.url
            return request.build_absolute_uri(image_url)
        else:
            return None

    def get_theme(self, obj):
        request = self.context.get("request")
        theme = copy.deepcopy(obj.theme)

        # theme does not exist
        # return None
        if not theme:
            return None

        if "logo" in obj.theme:
            theme["logo"] = request.build_absolute_uri(static(obj.theme["logo"]))

        if "favicon" in obj.theme:
            theme["favicon"] = request.build_absolute_uri(static(obj.theme["favicon"]))

        if "css_theme" in obj.theme:
            theme["css_theme"] = request.build_absolute_uri(
                static(obj.theme["css_theme"])
            )

        return theme


class EventReadSerializer(serializers.ModelSerializer):
    """
    Event serializer
    """

    class Meta:
        model = Event
        fields = [
            "public_id",
            "team",
            "title",
            "description",
            "start_date",
            "timezone",
            "localized_address_display",
            "ticket_count",
            "cover_image",
        ]

    ticket_count = serializers.SerializerMethodField()
    start_date = serializers.DateTimeField(format="%A, %B %d, %Y | %H:%M%p")
    team = TeamReadSerializer()

    def get_ticket_count(self, obj):
        # TODO: should change to ticket_tier quantity_sold sum
        return Ticket.objects.filter(event=obj).count()


class TicketTierReadSerializer(serializers.ModelSerializer):
    """
    TicketTier model serializer
    """

    class Meta:
        model = TicketTier
        fields = [
            "created",
            "modified",
            "public_id",
            "event_public_id",
            "ticket_type",
            "capacity",
            "max_per_person",
            "tier_fiat",
            "tier_blockchain",
            "tier_asset_ownership",
            "quantity_sold",
        ]

    event_public_id = serializers.UUIDField(source="event.public_id")


class CheckoutItemReadSerializer(serializers.ModelSerializer):
    """
    CheckoutItem model read serializer
    """

    class Meta:
        model = CheckoutItem
        fields = [
            "created",
            "modified",
            "public_id",
            "quantity",
            "ticket_tier",
            "checkout_session",
        ]

    ticket_tier = TicketTierReadSerializer()
    checkout_session = serializers.UUIDField(source="checkout_session.public_id")


class CheckoutItemCreateSerializer(serializers.ModelSerializer):
    """
    CheckoutItem model create serializer
    """

    class Meta:
        model = CheckoutItem
        fields = [
            "created",
            "modified",
            "public_id",
            "quantity",
            "ticket_tier",
            "checkout_session",
        ]
        read_only_fields = [
            "created",
            "modified",
            "public_id",
        ]

    ticket_tier = serializers.UUIDField(write_only=True)
    checkout_session = serializers.UUIDField(write_only=True)


class CheckoutItemUpdateSerializer(serializers.ModelSerializer):
    """
    CheckoutItems model update serializer
    """

    class Meta:
        model = CheckoutItem
        fields = [
            "created",
            "modified",
            "public_id",
            "quantity",
            "ticket_tier",
            "checkout_session",
        ]
        read_only_fields = [
            "created",
            "modified",
            "public_id",
            "ticket_tier",
            "checkout_session",
        ]

    ticket_tier = serializers.UUIDField(source="ticket_tier.public_id", read_only=True)
    checkout_session = serializers.UUIDField(
        source="checkout_session.public_id", read_only=True
    )


class CheckoutSessionReadSerializer(serializers.ModelSerializer):
    """
    CheckoutItems model read serializer
    """

    class Meta:
        model = CheckoutSession
        fields = [
            "created",
            "modified",
            "public_id",
            "expiration",
            "name",
            "email",
            "cost",
            "tx_type",
            "tx_status",
            "tx_type",
            "event",
            "checkout_items",
        ]

    event = serializers.UUIDField(source="event.public_id")
    checkout_items = CheckoutItemReadSerializer(
        source="checkoutitem_set", many=True, allow_null=True
    )


class CheckoutSessionItemsCreateSerializer(serializers.ModelSerializer):
    """
    CheckoutItems model create serializer
    """

    class Meta:
        model = CheckoutItem
        fields = [
            "created",
            "modified",
            "public_id",
            "quantity",
            "ticket_tier",
        ]

    ticket_tier = serializers.UUIDField(write_only=True)


class CheckoutSessionCreateSerializer(serializers.ModelSerializer):
    """
    CheckoutSession model create serializer with nested CheckoutItems
    """

    class Meta:
        model = CheckoutSession
        fields = [
            "created",
            "modified",
            "public_id",
            "expiration",
            "name",
            "email",
            "cost",
            "tx_status",
            "tx_type",
            "event",
            "checkout_items",
        ]
        read_only_fields = ["created", "modified", "public_id", "cost"]

    event = serializers.UUIDField(write_only=True)
    checkout_items = CheckoutSessionItemsCreateSerializer(
        source="checkoutitem_set", many=True, allow_null=True, required=False
    )

    def create(self, validated_data):
        """
        override create method from ModelSerializer
        create CheckoutSession and CheckoutItem
        """
        checkout_items = validated_data.pop("checkoutitem_set")
        checkout_session = CheckoutSession.objects.create(**validated_data)

        for item in checkout_items:
            checkout_item = CheckoutItem(checkout_session=checkout_session, **item)
            checkout_item.save()

        return checkout_session


class CheckoutSessionUpdateSerializer(serializers.ModelSerializer):
    """
    CheckoutItems model update serializer
    """

    class Meta:
        model = CheckoutSession
        fields = [
            "created",
            "modified",
            "public_id",
            "expiration",
            "name",
            "email",
            "cost",
            "tx_status",
            "tx_type",
            "event",
        ]
        read_only_fields = [
            "created",
            "modified",
            "public_id",
            "expiration",
            "cost",
            "tx_status",
            "tx_type",
        ]

    event = serializers.UUIDField(source="event.public_id", read_only=True)


class TransactionCreateSerializer(serializers.Serializer):
    """
    Transaction serializer
    """

    created = serializers.DateTimeField(read_only=True)
    modified = serializers.DateTimeField(read_only=True)
    public_id = serializers.UUIDField(read_only=True)

    def create(self, validated_data):
        """
        create and return a new transaction based on the tx_type requested
        """
        checkout_session = self.context["checkout_session"]
        tx_types = CheckoutSession.TransactionType

        match checkout_session.tx_type:
            case tx_types.FIAT:
                return TxFiat.objects.create()
            case tx_types.BLOCKCHAIN:
                return TxBlockchain.objects.create()
            case tx_types.ASSET_OWNERSHIP:
                return TxAssetOwnership.objects.create()

    def update_session_tx(self, tx):
        """
        update a checkout_session with a transaction
        once updated, mark as PROCESSING
        """
        checkout_session = self.context["checkout_session"]
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


class ConfirmationSerializer(serializers.ModelSerializer):
    """
    Confirmation serializer
    """

    class Meta:
        model = CheckoutSession
        fields = ["tx_status", "tickets_summary"]

    tickets_summary = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # tickets_summary only available if OrderStatus.COMPLETED
        checkout_session = kwargs["context"]["view"].get_object()
        if not checkout_session.tx_status == CheckoutSession.OrderStatus.COMPLETED:
            del self.fields["tickets_summary"]

    def confirmation(self):
        """
        - perform the confirmation
        - case tx_status == "COMPLETED" create tickets
            update checkout_session.tx_status to FULFILLED
        return tx_status
        """
        checkout_session = self.instance

        match checkout_session.tx_status:
            case CheckoutSession.OrderStatus.COMPLETED:
                checkout_session.create_items_tickets()
                # TODO: `checkout_session.send_tickets_to_email()` method
                checkout_session.tx_status = CheckoutSession.OrderStatus.FULFILLED
                checkout_session.save()
                return checkout_session.tx_status
            case _:
                return checkout_session.tx_status

    def get_tickets_summary(self, obj):
        """
        returns tickets_summary for general and deluxe admission
        """
        return {
            "general_admission": {
                "quantity": Ticket.objects.filter(
                    checkout_item__checkout_session=obj
                ).count(),
                "price": None,
            },
            "deluxe_admission": {"quantity": None, "price": None},
        }
