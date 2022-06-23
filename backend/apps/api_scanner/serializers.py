from rest_framework import serializers

from apps.dashboard.models import Team
from apps.root.models import Event, Ticket


#
# MODEL SERIALIZERS ////////////////////////////////////////////////////////////////////////////////
#
class TeamSerializer(serializers.ModelSerializer):
    """
    Team serializer
    """

    class Meta:
        model = Team
        fields = ["name", "image"]


class EventSerializer(serializers.ModelSerializer):
    """
    Serializes Ticketed events
    """

    ticket_count = serializers.IntegerField(source="tickets.count", read_only=True)
    redemeed_count = serializers.SerializerMethodField()
    date = serializers.DateTimeField(format="%A, %B %d | %H:%M%p")
    team = TeamSerializer()

    class Meta:
        model = Event
        fields = [
            "team",
            "title",
            "description",
            "requirements",
            "limit_per_person",
            "date",
            "timezone",
            "location",
            "capacity",
            "ticket_count",
            "redemeed_count",
        ]

    def get_redemeed_count(self, obj):
        return obj.tickets.filter(redeemed=True).count()


class TicketSerializer(serializers.ModelSerializer):
    """
    Serializes Ticketed events Tickets
    """

    wallet_address = serializers.CharField(source="blockchain_ownership.wallet_address")

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
