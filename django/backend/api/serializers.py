from rest_framework import serializers
from root.models import Signature, Team, Ticket, TicketGate

#
# TEAM ////////////////////////////////////////////////////////////////////////////////////
#
class TeamSerializer(serializers.ModelSerializer):
    """
    Team serializer
    """

    class Meta:
        model = Team
        fields = ["name", "image"]


#
# BASE GATES ////////////////////////////////////////////////////////////////////////////////////
#
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

class ListGateSerializer(serializers.ModelSerializer):
    """
    Base token gate serializer
    """
    team = TeamSerializer()

    class Meta:
        fields = [
            "team",
            "title",
            "general_type",
            "description",
            "requirements",
            "limit_per_person",
        ]


class DetailGateSerializer(serializers.ModelSerializer):
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
            "limit_per_person",
        ]

    def get_signature(self, gate):
        return gate.generate_signature_request()

#
# TICKETGATES ////////////////////////////////////////////////////////////////////////////////////
#
class TicketGateListSerializer(serializers.ModelSerializer):
    """
    Serializes Ticket token gates for list views.
    """

    class Meta:
        model = TicketGate
        fields = ListGateSerializer.Meta.fields + [
            "date",
            "location",
            "capacity",
        ]


class TicketGateDetailSerializer(DetailGateSerializer):
    """
    Serializes Ticket token gates for detail views.
    """

    class Meta:
        model = TicketGate
        fields = DetailGateSerializer.Meta.fields + [
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
        fields = [
            "wallet_address",
            "token_id",
            "download_url",
            "tokengate",
            "signature",
        ]
