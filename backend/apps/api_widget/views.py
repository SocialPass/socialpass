from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.root.models import Signature, Team, Ticket, TicketGate, TokenGate
from django.http import Http404

from .serializers import (
    TokenGatePolymorphicSerializer,
    BlockchainRequestAccessInput,
    BlockchainRequestAccessOutput

)
from apps.utilities import Blockchain


class TokenGateRetrieve(RetrieveAPIView):
    """
    RetrieveAPIView for retrieving tokengate by `public_id`
    """
    lookup_field = "public_id"
    queryset = TokenGate.objects.all()
    serializer_class = TokenGatePolymorphicSerializer
    permission_classes = [AllowAny]


class TokenGateRequestAccess(APIView):
    """
    View requests access into tokengate.
    Can either be type "BLOCKCHAIN" or type "FIAT"

    BLOCKCHAIN type
        - Request includes tokengate ID
        - Response includes `Signature` and redeemable assets (NFT only)

    FIAT type TBD
    """
    signature = None # related signature model
    tokengate = None # related tokengate model

    def get_object(self):
        # use .get if you are really sure it can only be one shopping cart per user
        try:
            self.tokengate = TokenGate.objects.get(public_id=self.kwargs['public_id'])
        except TokenGate.DoesNotExist:
            raise Http404

    def blockchain(self, request, *args, **kwargs):
        # Serialize data
        serialized = BlockchainRequestAccessInput(data=request.data)
        serialized.is_valid(raise_exception=True)

        # Generate Signature (to be signed)
        self.signature = Signature.objects.create(
            wallet_address=serialized.data.get("address"),
            tokengate=self.tokengate
        )

        # Serialize data
        print(self.signature)
        return Response("ok")

        serialized = BlockchainRequestAccessOutput(data=self.signature)
        serialized.is_valid(raise_exception=True)
        return Response(serialized.data)

    def post(self, request, *args, **kwargs):
        """
        POST calls blockchain or fiat, depending on 'type' query string
        """
        # get tokengate
        self.get_object()

        # check type
        type = request.query_params.get("type")
        if not type:
            raise Http404

        if type == 'blockchain':
            return self.blockchain(request, *args, **kwargs)


class TokenGateGrantAccess(APIView):
    """
    View grants access into tokengate.
    Can either be type "BLOCKCHAIN" or type "FIAT"

    BLOCKCHAIN type
        - Request includes tokengate ID
        - Response includes `Signature` and redeemable assets (NFT only)

    FIAT type TBD
    """
    def blockchain(self, request, *args, **kwargs):
        return Response("Not yet implemented")

    def post(self, request,  *args, **kwargs):
        """
        POST calls blockchain or fiat, depending on 'type' query string
        """
        # handle type
        type = self.request.query_params.get("type")
        if not type:
            raise Http404

        if type == 'blockchain':
            return blockchain(self, request, *args, **kwargs)


class TicketGateRequestAccess(TokenGateRequestAccess):
    """
    Subclass TicketGateRequestAccess for requesting access
    Ticketgate specific
    """
    def post(self, request, *args, **kwargs):
        """
        POST
        """
        return super().post(request, *args, **kwargs)


class TicketGateGrantAccess(TokenGateGrantAccess):
    """
    Subclass TokenGateGrantAccess for granting access
    Ticketgate specific
    """
    def post(self, request, *args, **kwargs):
        """
        POST
        """
        return super().post(request, *args, **kwargs)
