from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from apps.root.models import Signature, Team, Ticket, TicketGate


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


class TicketGateSerializer(serializers.ModelSerializer):
        """
        Serializes Ticket token gates
        """
        team = TeamSerializer()

        class Meta:
            model = TicketGate
            fields = [
                "team",
                "title",
                "general_type",
                "description",
                "requirements",
                "limit_per_person",
                "date",
                "location",
                "capacity",
            ]
#
# TOKENGATES ////////////////////////////////////////////////////////////////////////////////////
#
class TokenGatePolymorphicSerializer(PolymorphicSerializer):
    """
    Polymorphic serializer
    Switches serializer on content type
    """
    model_serializer_mapping = {
        TicketGate: TicketGateSerializer,
    }


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
    access_data = serializers.JSONField(required=False)
