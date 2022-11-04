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
            "passcode",
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


class CheckoutItemQuantitySerializer(serializers.ModelSerializer):
    ticket_tier = TicketTierReadSerializer(read_only=True)

    class Meta:
        model = CheckoutItem
        fields = [
            "ticket_tier",
            "quantity",
        ]


class ConfirmationSerializer(serializers.ModelSerializer):
    """
    Confirmation serializer
    """

    class Meta:
        model = CheckoutSession
        fields = ["tx_status", "tickets_summary"]

    tickets_summary = serializers.SerializerMethodField()

    def get_tickets_summary(self, obj):
        """
        returns CheckoutItems quantity
        """
        if obj.tx_status != CheckoutSession.OrderStatus.FULFILLED:
            return None

        quantity_serializer = CheckoutItemQuantitySerializer(
            obj.checkoutitem_set, many=True
        )
        return quantity_serializer.data
