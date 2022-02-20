from rest_framework import serializers

from .models import AirdropGate, AirdropList, TicketGate, TicketList


class AirdropGateSerializer(serializers.ModelSerializer):
    """
    Serializes Airdrop token gates.
    """
    signature = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AirdropGate
        fields = "__all__"

    def get_signature(self, gate):
        return gate.generate_signature_request()


class TicketGateSerializer(serializers.ModelSerializer):
    """
    Serializes Ticket token gates.
    """
    signature = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TicketGate
        fields = "__all__"

    def get_signature(self, gate):
        return gate.generate_signature_request()
