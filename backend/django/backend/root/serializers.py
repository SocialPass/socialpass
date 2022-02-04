from rest_framework import serializers

from .models import AirdropGate, AirdropList, TicketGate, TicketList


class AirdropGateSerializer(serializers.ModelSerializer):
    """
    Serializes Airdrop token gates.
    """

    class Meta:
        model = AirdropGate
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at", "user", "general_type"]

    def create(self, validated_data):
        # Create the token gate
        airdropgate = AirdropGate.objects.create(
            user=self.context["request"].user, general_type="AIRDROP", **validated_data
        )
        return airdropgate


class AirdropListSerializer(serializers.ModelSerializer):
    """
    Serializes airdrop lists.
    """

    class Meta:
        model = AirdropList
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at", "tokengate"]


class TicketGateSerializer(serializers.ModelSerializer):
    """
    Serializes Ticket token gates.
    """

    class Meta:
        model = TicketGate
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at", "user", "general_type"]

    def create(self, validated_data):
        # Create the token gate
        ticketgate = TicketGate.objects.create(
            user=self.context["request"].user, general_type="TICKET", **validated_data
        )
        return ticketgate


class TicketListSerializer(serializers.ModelSerializer):
    """
    Serializes ticket lists.
    """

    class Meta:
        model = TicketList
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at", "tokengate"]
