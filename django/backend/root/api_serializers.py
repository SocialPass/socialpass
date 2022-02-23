from rest_framework import serializers

from .models import AirdropGate, Airdrop, TicketGate, Ticket, Team

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['name']


class AirdropGateSerializer(serializers.ModelSerializer):
    """
    Serializes Airdrop token gates.
    """
    #team = TeamSerializer()
    signature = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AirdropGate
        fields = [
            "team",
            "title",
            "description",
            "signature",
            "requirements",
            "asset_address",
            "asset_type",
            "chain",
            "end_date"
        ]

    def get_signature(self, gate):
        return gate.generate_signature_request()

class TicketGateSerializer(serializers.ModelSerializer):
    """
    Serializes Ticket token gates.
    """
    team = TeamSerializer()
    signature = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TicketGate
        fields = [
            "team",
            "title",
            "description",
            "signature",
            "requirements",
            "date",
            "location",
            "capacity",
            "deadline"
        ]

    def get_signature(self, gate):
        return gate.generate_signature_request()

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
