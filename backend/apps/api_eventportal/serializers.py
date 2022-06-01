from rest_framework import serializers

from apps.root.models import BlockchainOwnership, Event
from apps.services import ticket_service


class EventPortalRetrieveSerializer(serializers.ModelSerializer):
    """
    Model serializer for Event
    Method fields for grouping together main information
    """

    organizer_info = serializers.SerializerMethodField()
    ticket_info = serializers.SerializerMethodField()
    event_info = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "organizer_info",
            "ticket_info",
            "event_info",
        ]

    def get_ticket_info(self, obj):
        return {
            "total_capacity": obj.capacity,
            "total_tickets_issued": obj.tickets.count(),
            "limit_per_person": ticket_service.get_tickets_to_issue(
                event=obj,
                tickets_requested=obj.limit_per_person
            )
        }

    def get_organizer_info(self, obj):
        return {
            "name": obj.team.name,
            "url": "",
            "profile_image": obj.team.image.url if obj.team.image else None,
        }

    def get_event_info(self, obj):
        return {
            "title": obj.title,
            "description": obj.description,
            "requirements": obj.requirements,
            "date": obj.date,
            "timezone": obj.timezone,
            "location": obj.location,
        }


class RequestAccessBlockchain(serializers.ModelSerializer):
    signing_message = serializers.SerializerMethodField()

    class Meta:
        model = BlockchainOwnership
        fields = [
            "id",
            "signing_message",
        ]

    def get_signing_message(self, obj):
        return obj.signing_message


class BlockchainOwnershipSerializer(serializers.Serializer):
    wallet_address = serializers.CharField(required=True)
    signed_message = serializers.CharField(required=True)
    blockchain_ownership_id = serializers.CharField(required=True)
    tickets_requested = serializers.IntegerField(required=True)
