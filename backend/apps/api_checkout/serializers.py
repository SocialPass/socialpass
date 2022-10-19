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


class TeamSerializer(serializers.ModelSerializer):
    """
    Team serializer
    """

    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            image_url = obj.image.url
            return request.build_absolute_uri(image_url)
        else:
            return None

    theme = serializers.SerializerMethodField()

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

    class Meta:
        model = Team
        fields = ["name", "image", "theme"]


class EventSerializer(serializers.ModelSerializer):
    """
    Event serializer
    """

    ticket_count = serializers.SerializerMethodField()
    start_date = serializers.DateTimeField(format="%A, %B %d, %Y | %H:%M%p")
    team = TeamSerializer()

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

    def get_ticket_count(self, obj):
        # TODO: should change to ticket_tier quantity_sold sum
        return Ticket.objects.filter(event=obj).count()


class TicketTierSerializer(serializers.ModelSerializer):
    """
    TicketTier model serializer
    """

    event_public_id = serializers.UUIDField(source="event.public_id")

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


class CheckoutItemReadSerializer(serializers.ModelSerializer):
    """
    CheckoutItem model read serializer
    """

    ticket_tier = TicketTierSerializer()
    checkout_session = serializers.UUIDField(source="checkout_session.public_id")

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
        read_only_fields = ["created", "modified", "public_id"]


class CheckoutItemCreateSerializer(serializers.ModelSerializer):
    """
    CheckoutItem model create serializer
    """

    ticket_tier = serializers.UUIDField(write_only=True)
    checkout_session = serializers.UUIDField(write_only=True)

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


class CheckoutItemUpdateSerializer(serializers.ModelSerializer):
    """
    CheckoutItems model update serializer
    """

    ticket_tier = serializers.UUIDField(source="ticket_tier.public_id", read_only=True)
    checkout_session = serializers.UUIDField(
        source="checkout_session.public_id", read_only=True
    )

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


class CheckoutSessionReadSerializer(serializers.ModelSerializer):
    """
    CheckoutItems model read serializer
    """

    event = serializers.UUIDField(source="event.public_id")
    checkout_items = CheckoutItemReadSerializer(
        source="checkoutitem_set", many=True, allow_null=True
    )

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
            "event",
            "checkout_items",
        ]


class CheckoutSessionItemsCreateSerializer(serializers.ModelSerializer):
    """
    CheckoutItems model create serializer
    """

    ticket_tier = serializers.UUIDField(write_only=True)

    class Meta:
        model = CheckoutItem
        fields = [
            "created",
            "modified",
            "public_id",
            "quantity",
            "ticket_tier",
        ]


class CheckoutSessionCreateSerializer(serializers.ModelSerializer):
    """
    CheckoutSession model create serializer with nested CheckoutItems
    """

    event = serializers.UUIDField(write_only=True)
    checkout_items = CheckoutSessionItemsCreateSerializer(
        source="checkoutitem_set", many=True, allow_null=True, required=False
    )
    cost = serializers.CharField(read_only=True)

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


class TransactionSerializer(serializers.Serializer):
    """
    Transaction serializer
    """

    tx_type = serializers.ChoiceField(CheckoutSession.TransactionType, write_only=True)
    created = serializers.DateTimeField(read_only=True)
    modified = serializers.DateTimeField(read_only=True)
    public_id = serializers.UUIDField(read_only=True)

    def create(self, validated_data):
        """
        create and return a new transaction based on the tx_type requested
        """
        match validated_data["tx_type"]:
            case "FIAT":
                return TxFiat.objects.create()
            case "BLOCKCHAIN":
                return TxBlockchain.objects.create()
            case "ASSET_OWNERSHIP":
                return TxAssetOwnership.objects.create()

    def update_session_tx(self, checkout_session, tx):
        """
        update a checkout_session with a transaction
        """
        match self.validated_data["tx_type"]:
            case "FIAT":
                checkout_session.tx_fiat = tx
            case "BLOCKCHAIN":
                checkout_session.tx_blockchain = tx
            case "ASSET_OWNERSHIP":
                checkout_session.tx_asset_ownership = tx
        checkout_session.save()
