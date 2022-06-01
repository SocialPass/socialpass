from rest_framework import serializers

from apps.root.models import Signature, Event


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
        # TODO: This method probably belongs in a service in itself.
        current_ticket_count = obj.tickets.count()
        if current_ticket_count + obj.limit_per_person > obj.capacity:
            ticket_limit = obj.capacity - current_ticket_count
        else:
            ticket_limit = obj.limit_per_person

        return {
            "total_capacity": obj.capacity,
            "total_tickets_issued": current_ticket_count,
            "limit_per_person": ticket_limit,
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
    class Meta:
        model = Signature
        fields = [
            "unique_code",
            "signing_message",
        ]


class BlockchainOwnershipSerializer(serializers.Serializer):
    wallet_address = serializers.CharField(required=True)
    signed_message = serializers.CharField(required=True)
    signature_id = serializers.CharField(required=True)

