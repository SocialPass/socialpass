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


class TicketedEventSerializer(serializers.ModelSerializer):
    """
    Serializes Ticketed events
    """
    ticket_count = serializers.IntegerField(
        source='tickets.count',
        read_only=True
    )
    date = serializers.DateTimeField(format="%A, %B %d | %H:%M%p")

    team = TeamSerializer()

    class Meta:
        model = TicketedEvent
        fields = [
            "team",
            "title",
            "general_type",
            "description",
            "requirements",
            "limit_per_person",
            "date",
            "timezone",
            "location",
            "capacity",
            "ticket_count"
        ]


#
# CHECKOUT - WEB3 ///////////////////////////////////////////////////////////////////////////////
#
class BlockchainRequestAccessInput(serializers.Serializer):
    """
    Serializes data for TokenGateRequestBlockchainAccess input
    - Signature model to be signed
    - Redeemable assets (if applicable)
    """

    address = serializers.CharField()


class BlockchainRequestAccessOutput(serializers.ModelSerializer):
    """
    Serializes data for TokenGateRequestBlockchainAccess output
    - Signature model to be signed
    """

    class Meta:
        model = Signature
        fields = ["signing_message"]


class BlockchainGrantAccessInput(serializers.Serializer):
    """
    Serializes data for TokenGateGrantBlockchainAccess
    - Wallet address
    - Signed message (Signature model)
    - Signature id
    """

    address = serializers.CharField()
    signed_message = serializers.CharField()
    signature_id = serializers.CharField()
    access_data = serializers.JSONField(required=False, default=[])
