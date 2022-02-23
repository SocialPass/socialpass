from rest_framework import serializers

from .models import AirdropGate, Airdrop, TicketGate, Ticket, Team

class TeamSerializer(serializers.ModelSerializer):
    """
    Team serializer
    """
    class Meta:
        model = Team
        fields = ['name', 'image']


class BaseGateSerializer(serializers.ModelSerializer):
    """
    Base token gate serializer
    """
    team = TeamSerializer()
    signature = serializers.SerializerMethodField(read_only=True)

    class Meta:
        fields = [
            "team",
            "title",
            "description",
            "requirements",
            "signature",
        ]
    def get_signature(self, gate):
        return gate.generate_signature_request()

class VerifyGateSerializer(serializers.Serializer):
    """
    Serializes /access request for all token gates
    Accepts a signed message & corresponding wallet address,
    as well related 'public_id'
    """
    address = serializers.CharField()
    signed_message = serializers.CharField()
    tokengate_id = serializers.CharField()
    signature_id = serializers.CharField()

class AirdropGateSerializer(BaseGateSerializer):
    """
    Serializes Airdrop token gates.
    """
    class Meta:
        model = AirdropGate
        fields = BaseGateSerializer.Meta.fields + [
            "asset_address",
            "asset_type",
            "chain",
            "end_date"
        ]

class AirdropSerializer(serializers.ModelSerializer):
    """
    Serializes Airdrop.
    """
    class Meta:
        model = Airdrop
        fields = ["wallet_address", "transaction_hash"]


class TicketGateSerializer(BaseGateSerializer):
    """
    Serializes Ticket token gates.
    """
    class Meta:
        model = TicketGate
        fields = BaseGateSerializer.Meta.fields + [
            "date",
            "location",
            "capacity",
            "deadline"
        ]

class TicketSerializer(serializers.ModelSerializer):
    """
    Serializes Ticket.
    """
    class Meta:
        model = Ticket
        fields = ["wallet_address", "ticket_url"]
