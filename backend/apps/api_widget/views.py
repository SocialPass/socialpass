from django.http import Http404
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.gates import Blockchain
from apps.root.models import Signature, TokenGate, Ticket

from .serializers import BlockchainGrantAccessInput, BlockchainRequestAccessInput, TokenGatePolymorphicSerializer


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
    signature = None  # related signature model
    tokengate = None

    def blockchain(self, request, *args, **kwargs):
        # Serialize data
        serialized = BlockchainRequestAccessInput(data=request.data)
        serialized.is_valid(raise_exception=True)

        # Generate Signature (to be signed by client)
        self.signature = Signature.objects.create(
            tokengate=super().get_object(),
            wallet_address=serialized.data.get("address"),
        )

        # fetch blockchain checkout options
        checkout_options = (
            Blockchain.Utilities.fetch_checkout_options_against_requirements(
                requirements=self.tokengate.requirements,
                wallet_address=serialized.data.get("address"),
            )
        )

        # return web3 checkout options, signature message, and signature ID
        return Response(
            {
                "signature_message": self.signature.signing_message,
                "signature_id": self.signature.unique_code,
                "checkout_options": checkout_options,
            }
        )

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

        if type == "blockchain":
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

    lookup_field = "public_id"
    queryset = TokenGate.objects.all()
    signature = None  # related signature model
    tokengate = None
    wallet_address = None
    checkout_selections = None

    def set_signature(self, pk):
        """
        Helper method to get the related signature model via request PK.
        """
        # get related signature by pk
        try:
            self.signature = Signature.objects.get(unique_code=pk)
        except Exception:
            raise Http404

    def blockchain(self, request, *args, **kwargs):
        # Serialize data
        serialized = BlockchainGrantAccessInput(data=request.data)
        serialized.is_valid(raise_exception=True)

        # Get signature from data
        self.set_signature(serialized.data.get("signature_id"))

        # Validate signature
        signature_success, signature_msg = Blockchain.Utilities.validate_signature(
            signature=self.signature,
            address=serialized.data.get("address"),
            signed_message=serialized.data.get("signed_message"),
            tokengate_id=self.tokengate.public_id,
        )
        if not signature_success:
            return Response(signature_msg, status=401)

        # validate blockchain checkout options against requirements
        (
            web3_validated_sucess,
            web3_validated_msg,
        ) = Blockchain.Utilities.validate_checkout_selections_against_requirements(
            wallet_address=serialized.data.get("address"),
            limit_per_person=self.tokengate.limit_per_person,
            requirements=self.tokengate.requirements,
            requirements_with_options=serialized.data.get("access_data"),
        )

        if not web3_validated_sucess:
            return Response(web3_validated_msg, status=403)

        # set class data
        self.checkout_selections = web3_validated_msg
        self.wallet_address = serialized.data.get("address")

    def post(self, request, *args, **kwargs):
        """
        POST calls blockchain or fiat, depending on 'type' query string
        """
        # get tokengate
        self.tokengate = self.get_object()

        # handle type
        type = self.request.query_params.get("type")
        if not type:
            raise Http404

        if type == "blockchain":
            return self.blockchain(request, *args, **kwargs)


class TicketGateRequestAccess(TokenGateRequestAccess):
    """
    Subclass TicketGateRequestAccess for requesting access
    Ticketgate specific
    """

    def post(self, request, *args, **kwargs):
        # TokenGateRequestAccess.post
        response = super().post(request, *args, **kwargs)
        if response:
            return response


class TicketGateGrantAccess(TokenGateGrantAccess):
    """
    Subclass TokenGateGrantAccess for granting access
    Ticketgate specific
    """

    def post(self, request, *args, **kwargs):
        # TokenGateGrantAccess.post
        response = super().post(request, *args, **kwargs)
        if response:
            return response

        # loop over TokenGateGrantAccess.checkout_selections & create Ticket
        ticket_data = []
        for obj in self.checkout_selections:
            ticket, created = Ticket.objects.get_or_create(
                wallet_address=self.wallet_address,
                tokengate=self.tokengate,
                requirement=obj['requirement'],
                option=obj['option']
            )

            # set data after getting / creating
            ticket.populate_data(signature=self.signature)

            # append ticket download URL to ticket_data
            ticket_data.append(ticket.temporary_download_url)

        # return
        return Response(ticket_data, status=200)


