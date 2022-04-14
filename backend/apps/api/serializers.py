from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from apps.root.models import Signature, Team, Ticket, TicketGate


#
# MISC ////////////////////////////////////////////////////////////////////////////////////
#
class TeamSerializer(serializers.ModelSerializer):
    """
    Team serializer
    """

    class Meta:
        model = Team
        fields = ["name", "image"]


class AccessGateSerializer(serializers.Serializer):
    """
    Serializes /access request for all token gates
    Accepts a signed message & corresponding wallet address,
    as well related 'public_id'
    """

    address = serializers.CharField()
    signed_message = serializers.CharField()
    tokengate_id = serializers.CharField()
    signature_id = serializers.CharField()


#
# TICKETGATES ////////////////////////////////////////////////////////////////////////////////////
#
class TicketGateDetailSerializer(serializers.ModelSerializer):
    """
    Serializes Ticket token gates for detail views.
    Most notably, generates new signature
    """

    team = TeamSerializer()
    signature = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TicketGate
        fields = [
            "team",
            "title",
            "general_type",
            "description",
            "requirements",
            "signature",
            "limit_per_person",
            "date",
            "location",
            "capacity",
        ]

    def get_signature(self, gate):
        return gate.generate_signature_request()


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
            "temporary_download_url",
            "tokengate",
            "signature",
        ]



#
# TOKENGATES ////////////////////////////////////////////////////////////////////////////////////
#
class TicketGateSerializer(serializers.ModelSerializer):
    """
    Serializes Ticket token gates for list views.
    """

    class Meta:
        model = TicketGate
        fields = [
            "title",
            "general_type",
            "description",
            "requirements",
            "limit_per_person",
            "date",
            "location",
            "capacity",
        ]


class TokenGatePolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        TicketGate: TicketGateSerializer,
    }

class TokenGateDetailPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        TicketGate: TicketGateDetailSerializer,
    }
