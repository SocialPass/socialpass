from django.conf import settings
from rest_framework import serializers

from apps.dashboard.models import Team
from apps.root.models import BlockchainOwnership, Event, Ticket


class TeamSerializer(serializers.ModelSerializer):
    """
    Team serializer
    """

    image = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ["name", "image"]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            image_url = obj.image.url
            return request.build_absolute_uri(image_url)
        else:
            return None


class EventSerializer(serializers.ModelSerializer):
    """
    Event serializer
    """

    ticket_count = serializers.IntegerField(source="tickets.count", read_only=True)
    start_date = serializers.DateTimeField(format="%A, %B %d, %Y | %H:%M%p")
    team = TeamSerializer()

    class Meta:
        model = Event
        fields = [
            "team",
            "title",
            "description",
            "requirements",
            "limit_per_person",
            "start_date",
            "timezone",
            "timezone_offset",
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

    download_url = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            "download_url",
        ]

    def get_download_url(self, obj):
        return obj.download_url


class VerifyBlockchainOwnershipSerializer(serializers.Serializer):
    wallet_address = serializers.CharField(required=True)
    signed_message = serializers.CharField(required=True)
    blockchain_ownership_id = serializers.CharField(required=True)
    tickets_requested = serializers.IntegerField(required=True)
