import copy

from django.templatetags.static import static
from rest_framework import serializers

from apps.root.models import Event, Team, Ticket


class TeamSerializer(serializers.ModelSerializer):
    """
    Team serializer
    """

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
        ref_name = "Scanner Event"
        fields = ["name", "image", "theme"]


class EventSerializer(serializers.ModelSerializer):
    """
    Serializes Ticketed events
    """

    ticket_count = serializers.IntegerField(source="tickets.count", read_only=True)
    redeemed_count = serializers.SerializerMethodField()
    start_date = serializers.DateTimeField(format="%A, %B %d | %H:%M%p")
    team = TeamSerializer()
    capacity = serializers.SerializerMethodField()

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
            "capacity",
            "ticket_count",
            "redeemed_count",
        ]

    def get_capacity(self, obj):
        return obj.capacity

    def get_redeemed_count(self, obj):
        return Ticket.get_claimed_tickets(obj).count()


class TicketSerializer(serializers.ModelSerializer):
    """
    Serializes Ticketed events Tickets
    """

    wallet_address = serializers.SerializerMethodField()
    created = serializers.DateTimeField(format="%A, %B %d | %H:%M%p")
    redeemed_at = serializers.DateTimeField(format="%A, %B %d | %H:%M%p")

    class Meta:
        model = Ticket
        fields = [
            "public_id",
            "created",
            "redeemed",
            "redeemed_at",
            "redeemed_by",
            "wallet_address",
        ]

    def get_wallet_address(self, obj):
        return "TODOTHISPR"


class ScanTicketOutputSerializer(serializers.ModelSerializer):
    """
    Serializes Redeemed Tickets
    """

    ticket_count = serializers.SerializerMethodField()
    redeemed_count = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = ["id", "filename", "ticket_count", "redeemed_count"]

    def get_redeemed_count(self, obj):
        return Ticket.get_claimed_tickets(event=obj.event).count()

    def get_ticket_count(self, obj):
        # TODO: should change to ticket_tier quantity_sold sum
        return Ticket.objects.filter(checkout_item__ticket_tier__event=obj.event).count()


class ScanTicketInputSerializer(serializers.Serializer):
    embed_code = serializers.CharField()
