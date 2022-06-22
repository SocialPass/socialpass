from rest_framework import serializers

from apps.dashboard.models import Team
from apps.root.models import BlockchainOwnership, Event, Ticket


class TeamSerializer(serializers.ModelSerializer):
    """
    Team serializer
    """

    class Meta:
        model = Team
        fields = ["name", "image"]


class EventSerializer(serializers.ModelSerializer):
    """
    Event serializer
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


class BlockchainOwnershipSerializer(serializers.ModelSerializer):
    """
    BlockchainOwnership serializer
    """

    signing_message = serializers.SerializerMethodField()

    class Meta:
        model = BlockchainOwnership
        fields = [
            "id",
            "signing_message",
        ]

    def get_signing_message(self, obj):
        return obj.signing_message


class TicketSerializer(serializers.ModelSerializer):
    """
    Ticket serializer
    """

    temporary_download_url = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            "temporary_download_url",
        ]

    def get_temporary_download_url(self, obj):
        return obj.temporary_download_url


class VerifyBlockchainOwnershipSerializer(serializers.Serializer):
    wallet_address = serializers.CharField(required=True)
    signed_message = serializers.CharField(required=True)
    blockchain_ownership_id = serializers.CharField(required=True)
    tickets_requested = serializers.IntegerField(required=True)
