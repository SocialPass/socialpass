from rest_framework import serializers

from apps.root.models import Event, Team, Ticket


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
        ]


class TicketSerializer(serializers.ModelSerializer):
    """
    Serializes Tickets
    """

    class Meta:
        model = Ticket
        fields = ["id", "filename"]
