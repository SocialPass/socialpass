from rest_framework import serializers

from .models import AirdropGate, Airdrop, TicketGate, Ticket, Team

class TeamSerializer(serializers.ModelSerializer):
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

class VerifyGateSerializer(serializers.Serializer):
    """
    Serializes /access request for all token gates
    """
    address = serializers.CharField()
    signed_message = serializers.CharField()
    tokengate_id = serializers.CharField()
    signature_id = serializers.CharField()

class TicketSerializer(serializers.ModelSerializer):
    """
    Serializes Ticket.
    """
    class Meta:
        model = Ticket
        fields = "__all__"


class AirdropSerializer(serializers.ModelSerializer):
    """
    Serializes Airdrop.
    """
    class Meta:
        model = Airdrop
        fields = "__all__"
