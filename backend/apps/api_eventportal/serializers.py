from rest_framework import serializers

from apps.root.models import Signature, Team, TicketedEvent


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


class SignatureSerializer(serializers.ModelSerializer):
    """
    Signature serializer
    """
    signing_message = serializers.CharField(read_only=True)

    class Meta:
        model = Signature
        fields = ["signing_message"]


class TicketedEventSerializer(serializers.ModelSerializer):
    """
    Serializes Ticketed events
    """

    ticket_count = serializers.IntegerField(source="tickets.count", read_only=True)
    date = serializers.DateTimeField(format="%A, %B %d | %H:%M%p")
    team = TeamSerializer()

    class Meta:
        model = TicketedEvent
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


#
# VIEW SERIALIZERS ////////////////////////////////////////////////////////////////////////////////
#
class TicketedEventVerifyAccessSerializer(serializers.Serializer):
    """
    Serializes data for TokenGateGrantBlockchainAccess
    - Wallet address
    - Signed message (Signature model)
    - Signature id
    """

    wallet_address = serializers.CharField(required=True)
    signed_message = serializers.CharField(required=True)
    signature_id = serializers.CharField(required=True)
