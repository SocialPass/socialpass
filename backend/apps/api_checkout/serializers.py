import copy

from django.templatetags.static import static
from rest_framework import serializers

from apps.root.models import CheckoutItem, Event, Team, Ticket, TicketTier


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
            "price",
            "capacity",
            "max_per_person",
            "tier_fiat",
            "tier_blockchain",
            "tier_asset_ownership",
        ]


class CheckoutItemReadSerializer(serializers.ModelSerializer):
    ticket_tier = serializers.UUIDField(source="ticket_tier.public_id")
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
