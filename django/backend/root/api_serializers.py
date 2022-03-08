from rest_framework import serializers

from .models import Airdrop, AirdropGate, Signature, Team, Ticket, TicketGate


class TeamSerializer(serializers.ModelSerializer):
    """
    Team serializer
    """

    class Meta:
        model = Team
        fields = ["name", "image"]


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
            "general_type",
            "description",
            "requirements",
            "signature",
            "limit_per_person"
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
            "end_date",
        ]


class AirdropSerializer(serializers.ModelSerializer):
    """
    Serializes Airdrop.
    """

    tokengate = serializers.PrimaryKeyRelatedField(
        queryset=AirdropGate.objects.all(), write_only=True
    )
    signature = serializers.PrimaryKeyRelatedField(
        queryset=Signature.objects.all(), write_only=True
    )

    class Meta:
        model = Airdrop
        fields = ["tokengate", "signature", "wallet_address", "transaction_hash"]


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
        ]


class TicketSerializer(serializers.ModelSerializer):
    """
    Serializes Ticket.
    """

    tokengate = serializers.PrimaryKeyRelatedField(
        queryset=TicketGate.objects.all(), write_only=True
    )
    signature = serializers.PrimaryKeyRelatedField(
        queryset=Signature.objects.all(), write_only=True
    )

    class Meta:
        model = Ticket
        fields = ["wallet_address", "download_url", "tokengate", "signature"]
