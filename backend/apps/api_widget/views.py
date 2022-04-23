from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.root.models import Signature, Team, Ticket, TicketGate, TokenGate
from django.http import Http404
from .serializers import (
    TokenGatePolymorphicSerializer,
    BlockchainRequestAccessInput,
    BlockchainGrantAccessInput
)

class TokenGateRetrieve(RetrieveAPIView):
    """
    RetrieveAPIView for retrieving tokengate by `public_id`
    """
    lookup_field = "public_id"
    queryset = TokenGate.objects.all()
    serializer_class = TokenGatePolymorphicSerializer
    permission_classes = [AllowAny]


class TokenGateRequestAccess(RetrieveAPIView):
    """
    Base of RetrieveAPIView for fetching associated Tokengate

    View requests access into tokengate.
    Can either be type "BLOCKCHAIN" or type "FIAT"

    BLOCKCHAIN type
        - Empty request (aside from path / query params)
        - Response includes `Signature`
    """
    lookup_field = "public_id"
    queryset = TokenGate.objects.all()
    signature = None # related signature model

    def blockchain(self, request, *args, **kwargs):
        # Serialize data
        serialized = BlockchainRequestAccessInput(data=request.data)
        serialized.is_valid(raise_exception=True)

        # Generate Signature (to be signed by client)
        self.signature = Signature.objects.create(
            tokengate=super().get_object(),
            wallet_address=serialized.data.get("address")
        )

        # Get Web3 checkout options (available assets per requirement)
        checkout_options = self.tokengate.fetch_options_against_requirements(
            wallet_address=serialized.data.get("address")
        )

        # return web3 checkout options, signature message, and signature ID
        return Response({
            "signature_message":self.signature.signing_message,
            "signature_id": self.signature.unique_code,
            "checkout_options": checkout_options
        })

    def post(self, request, *args, **kwargs):
        """
        POST calls blockchain or fiat, depending on 'type' query string
        """
        # get tokengate
        self.tokengate = self.get_object()

        # check type
        type = request.query_params.get("type")
        if not type:
            raise Http404

        if type == 'blockchain':
            return self.blockchain(request, *args, **kwargs)


class TokenGateGrantAccess(RetrieveAPIView):
    """
    Base of RetrieveAPIView for fetching associated Tokengate

    View grants access into tokengate.
    Can either be type "BLOCKCHAIN" or type "FIAT"

    BLOCKCHAIN type
        - Request includes tokengate ID
        - Response includes `Signature` and redeemable assets (NFT only)
    """

    def get_signature(self, pk):
        """
        Helper method to get the related signature model via request PK.
        """
        # get related signature by pk
        try:
            return Signature.objects.get(unique_code=pk)
        except Exception:
            raise Http404

    def blockchain(self, request, *args, **kwargs):
        # Serialize data
        serialized = BlockchainGrantAccessInput(data=request.data)
        serialized.is_valid(raise_exception=True)

        # Get signature from data
        signature = self.get_signature(serialized.data.get("signature_id"))

        # Validate signature
        sig_success, sig_code, sig_msg = signature.validate(
            address=serialized.data.get("address"),
            signed_message=serialized.data.get("signed_message"),
            tokengate_id=self.tokengate.public_id
        )
        if not sig_success:
            return Response(sig_msg, status=sig_code)

        # todo: validate requirements / checkout selection
        validated = self.tokengate.validate_choices_against_requirements(
            wallet_address=serialized.data.get("address"),
            selected_choices=[]
        )

        if not validated:
            return Response('Your blockchain checkout selection could not be validated', status=403)

        return Response('OK')

    def post(self, request,  *args, **kwargs):
        """
        POST calls blockchain or fiat, depending on 'type' query string
        """
        # get tokengate
        self.tokengate = self.get_object()

        # handle type
        type = self.request.query_params.get("type")
        if not type:
            raise Http404

        if type == 'blockchain':
            return self.blockchain(request, *args, **kwargs)


class TicketGateRequestAccess(TokenGateRequestAccess):
    """
    Subclass TicketGateRequestAccess for requesting access
    Ticketgate specific
    """
    def post(self, request, *args, **kwargs):
        # TokenGateRequestAccess.post
        return super().post(request, *args, **kwargs)


class TicketGateGrantAccess(TokenGateGrantAccess):
    """
    Subclass TokenGateGrantAccess for granting access
    Ticketgate specific
    """
    def post(self, request, *args, **kwargs):
        # TokenGateGrantAccess.post
        x = super().post(request, *args, **kwargs)

        # todo: issue tickets
        return x
