import copy

from django.templatetags.static import static
from rest_framework import serializers

from apps.root.models import Event, Team, Ticket, TicketTier


class TeamSerializer(serializers.ModelSerializer):
    """
    Team serializer
    """

    class Meta:
        model = Team
        ref_name = "Scanner Event"
        fields = ["name", "image", "theme"]

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


class EventSerializer(serializers.ModelSerializer):
    """
    Serializes Ticketed events
    """

    class Meta:
        model = Event
        ref_name = "Scanner Event"
        fields = [
            "team",
            "title",
            "description",
            "start_date",
            "timezone",
            "localized_address_display",
            "ticket_count",
            "redeemed_count",
        ]

    redeemed_count = serializers.SerializerMethodField()
    ticket_count = serializers.SerializerMethodField()
    start_date = serializers.DateTimeField(format="%A, %B %d | %H:%M%p")
    team = TeamSerializer()

    def get_redeemed_count(self, obj):
        return obj.quantity_total_redeemed

    def get_ticket_count(self, obj):
        return obj.quantity_total_sold


class TicketTierSerializer(serializers.ModelSerializer):
    """
    Serializes Ticket Tier
    """

    class Meta:
        model = TicketTier
        fields = [
            "event",
            "tier_fiat",
            "tier_blockchain",
            "tier_asset_ownership",
            "ticket_type",
            "allowed_guests",
        ]


class TicketSerializer(serializers.ModelSerializer):
    """
    Serializes Ticketed events Tickets
    """

    class Meta:
        model = Ticket
        fields = [
            "created",
            "redeemed",
            "embed_code",
            "redeemed_at",
            "redeemed_by",
            "ticket_tier",
        ]

    created = serializers.DateTimeField(format="%A, %B %d | %H:%M%p")
    redeemed_at = serializers.DateTimeField(format="%A, %B %d | %H:%M%p")
    ticket_tier = TicketTierSerializer()


class ScanTicketOutputSerializer(serializers.ModelSerializer):
    """
    Serializes Redeemed Tickets
    """

    class Meta:
        model = Ticket
        fields = [
            "id",
            "ticket_count",
            "redeemed_count",
            "ticket_tier",
            "party_size",
        ]

    ticket_count = serializers.SerializerMethodField()
    redeemed_count = serializers.SerializerMethodField()
    ticket_tier = TicketTierSerializer()

    def get_redeemed_count(self, obj):
        return obj.event.quantity_total_redeemed

    def get_ticket_count(self, obj):
        return obj.event.quantity_total_sold


class ScanTicketInputSerializer(serializers.Serializer):
    embed_code = serializers.UUIDField()
