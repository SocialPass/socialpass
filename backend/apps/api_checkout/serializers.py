import copy

from django.templatetags.static import static
from rest_framework import serializers

from apps.root import exceptions
from apps.root.models import (
    CheckoutItem,
    CheckoutSession,
    Event,
    Team,
    TicketTier,
    TierAssetOwnership,
    TxAssetOwnership,
    TxBlockchain,
    TxFiat,
)


class BaseModelSerializer(serializers.ModelSerializer):
    """
    Base model serializer
    Most notably, calls .clean() method in save()
    """

    def save(self):
        try:
            self.instance = super().save()
            self.instance.clean()
        except (exceptions.BaseValidationError) as e:
            raise serializers.ValidationError(e.message_dict)


class TeamReadSerializer(BaseModelSerializer):
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


class EventReadSerializer(BaseModelSerializer):
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
            "cover_image",
        ]

    start_date = serializers.DateTimeField(format="%A, %B %d, %Y | %H:%M%p")
    team = TeamReadSerializer()


class TierAssetOwnershipReadSerializer(BaseModelSerializer):
    """
    AssetOwnership model serializer
    """

    class Meta:
        model = TierAssetOwnership
        fields = [
            "blockchain",
            "network",
            "asset_type",
            "token_address",
            "token_id",
        ]

    blockchain = serializers.CharField(source="get_blockchain_display")
    network = serializers.CharField(source="get_network_display")


class TicketTierReadSerializer(BaseModelSerializer):
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
    tier_asset_ownership = TierAssetOwnershipReadSerializer()


class CheckoutItemReadSerializer(BaseModelSerializer):
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


class CheckoutItemCreateSerializer(BaseModelSerializer):
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

    ticket_tier = serializers.SlugRelatedField(
        slug_field="public_id", queryset=TicketTier.objects.all()
    )
    checkout_session = serializers.SlugRelatedField(
        slug_field="public_id", queryset=CheckoutSession.objects.all()
    )


class CheckoutItemUpdateSerializer(BaseModelSerializer):
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


class CheckoutSessionItemsCreateSerializer(BaseModelSerializer):
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

    ticket_tier = serializers.SlugRelatedField(
        slug_field="public_id", queryset=TicketTier.objects.all()
    )


class TxAssetOwnershipWriteSerializer(serializers.ModelSerializer):
    """
    TxAssetOwnership model read serializer
    """

    class Meta:
        model = TxAssetOwnership
        fields = ["wallet_address", "signed_message"]


class TxAssetOwnershipReadSerializer(serializers.ModelSerializer):
    """
    TxAssetOwnership model read serializer
    """

    class Meta:
        model = TxAssetOwnership
        fields = ["created", "modified", "public_id", "unsigned_message"]


class TxBlockchainReadSerializer(serializers.ModelSerializer):
    """
    TxAssetOwnership model read serializer
    """

    class Meta:
        model = TxBlockchain
        fields = [
            "created",
            "modified",
            "public_id",
        ]


class TxFiatReadSerializer(serializers.ModelSerializer):
    """
    TxAssetOwnership model read serializer
    """

    class Meta:
        model = TxFiat
        fields = [
            "created",
            "modified",
            "public_id",
        ]


class CheckoutSessionCreateSerializer(BaseModelSerializer):
    """
    CheckoutSession model create serializer with nested CheckoutItems
    """

    class Meta:
        model = CheckoutSession
        fields = [
            "created",
            "modified",
            "public_id",
            "name",
            "email",
            "expiration",
            "tx_status",
            "tx_type",
            "tx_asset_ownership",
            "tx_blockchain",
            "tx_fiat",
            "event",
            "checkout_items",
        ]
        read_only_fields = ["created", "modified", "public_id", "expiration"]

    event = serializers.SlugRelatedField(
        slug_field="public_id",
        queryset=Event.objects.all(),
        write_only=True,
    )
    checkout_items = CheckoutSessionItemsCreateSerializer(
        source="checkoutitem_set",
        many=True,
    )
    tx_asset_ownership = TxAssetOwnershipReadSerializer(required=False, write_only=True)
    tx_blockchain = TxBlockchainReadSerializer(required=False, write_only=True)
    tx_fiat = TxFiatReadSerializer(required=False, write_only=True)

    def create(self, validated_data):
        """
        custom create method to handle nested writeable serializer
        www.django-rest-framework.org/api-guide/relations/#writable-nested-serializers
        """
        # create CheckoutItem's
        # note: we pop checkoutitem_set as to create it manually
        checkout_items = validated_data.pop("checkoutitem_set")
        checkout_session = CheckoutSession.objects.create(**validated_data)
        for item in checkout_items:
            CheckoutItem.objects.create(
                checkout_session=checkout_session, **item
            ).clean()

        # create Transaction
        # also save tx to the CheckoutSession
        match checkout_session.tx_type:
            case CheckoutSession.TransactionType.FIAT:
                tx = TxFiat.objects.create()
                checkout_session.tx_fiat = tx
            case CheckoutSession.TransactionType.BLOCKCHAIN:
                tx = TxBlockchain.objects.create()
                checkout_session.tx_blockchain = tx
            case CheckoutSession.TransactionType.ASSET_OWNERSHIP:
                tx = TxAssetOwnership.objects.create()
                checkout_session.tx_asset_ownership = tx
        checkout_session.save()

        # return parent CheckoutSession
        return checkout_session


class CheckoutSessionReadSerializer(BaseModelSerializer):
    """
    CheckoutItems model read serializer
    """

    get_tickets_link = serializers.SerializerMethodField()

    def get_get_tickets_link(self, obj):
        return obj.get_tickets_link

    class Meta:
        model = CheckoutSession
        fields = [
            "created",
            "modified",
            "public_id",
            "name",
            "email",
            "expiration",
            "tx_status",
            "tx_type",
            "tx_asset_ownership",
            "tx_blockchain",
            "tx_fiat",
            "event",
            "checkout_items",
            "passcode",
            "get_tickets_link",
        ]
        read_only_fields = ["created", "modified", "public_id", "expiration"]

    event = serializers.SlugRelatedField(
        slug_field="public_id",
        queryset=Event.objects.all(),
    )
    checkout_items = CheckoutSessionItemsCreateSerializer(
        source="checkoutitem_set",
        many=True,
        allow_null=True,
        required=False,
    )
    tx_asset_ownership = TxAssetOwnershipReadSerializer(required=False)
    tx_blockchain = TxBlockchainReadSerializer(required=False)
    tx_fiat = TxFiatReadSerializer(required=False)


class CheckoutSessionUpdateSerializer(BaseModelSerializer):
    """
    CheckoutItems model update serializer
    """

    class Meta:
        model = CheckoutSession
        fields = [
            "created",
            "modified",
            "public_id",
            "name",
            "email",
            "expiration",
            "tx_status",
            "tx_type",
            "event",
        ]
        read_only_fields = [
            "created",
            "modified",
            "public_id",
            "tx_status",
            "tx_type",
            "expiration",
        ]

    event = serializers.UUIDField(source="event.public_id", read_only=True)


class CheckoutItemQuantitySerializer(BaseModelSerializer):
    ticket_tier = TicketTierReadSerializer(read_only=True)

    class Meta:
        model = CheckoutItem
        fields = [
            "ticket_tier",
            "quantity",
        ]


class ConfirmationSerializer(BaseModelSerializer):
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
