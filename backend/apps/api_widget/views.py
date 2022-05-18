from django.http import Http404
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.gates import Blockchain
from apps.root.models import Signature, Ticket, TicketedEvent

from .serializers import BlockchainGrantAccessInput, BlockchainRequestAccessInput, TicketedEventSerializer


class TicketedEventRetrieve(RetrieveAPIView):
    """
    RetrieveAPIView for retrieving tokengate by `public_id`
    """

    lookup_field = "public_id"
    queryset = TicketedEvent.objects.all()
    serializer_class = TicketedEventSerializer
    permission_classes = [AllowAny]


class TicketedEventRequestAccess(APIView):
    """
    Subclass TicketGateRequestAccess for requesting access
    Ticketgate specific
    """

    signature = None  # signature model
    tokengate = None  #
    request_access_data = None

    def set_ticketed_event(self, *args, **kwargs):
        """
        SET_TOKENGATE sets tokengate
        """
        try:
            self.tokengate = TicketedEvent.objects.get(public_id=kwargs["public_id"])
        except Exception:
            raise Http404

    def post(self, request, *args, **kwargs):
        """
        POST calls blockchain or fiat, depending on 'type' query string
        """
        # set tokengate
        self.set_ticketed_event(*args, **kwargs)

        # Serialize data
        serialized = BlockchainRequestAccessInput(data=request.data)
        serialized.is_valid(raise_exception=True)

        # Generate Signature (to be signed by client)
        self.signature = Signature.objects.create(
            tokengate=self.tokengate,
            wallet_address=serialized.data.get("address"),
        )

        # fetch blockchain checkout options
        checkout_options = (
            Blockchain.Utilities.fetch_checkout_options_against_requirements(
                requirements=self.tokengate.requirements,
                wallet_address=serialized.data.get("address"),
            )
        )

        if not checkout_options:
            return Response("No available assets to verify", status=403)

        # return web3 checkout options, signature message, and signature ID
        self.request_access_data = {
            "signature_message": self.signature.signing_message,
            "signature_id": self.signature.unique_code,
            "checkout_options": checkout_options,
        }

        return Response(self.request_access_data)


class TicketedEventGrantAccess(APIView):
    """
    Subclass TicketedEventGrantAccess for granting access
    Ticketgate specific
    """

    signature = None  # signature model
    tokengate = None  # tokengate model
    wallet_address = None  # wallet address (from signature)
    checkout_selections = None  # checkout selections

    def set_ticketed_event(self, *args, **kwargs):
        try:
            self.tokengate = TicketedEvent.objects.get(public_id=kwargs["public_id"])
        except Exception:
            raise Http404

    def set_signature(self, pk):
        """
        Helper method to get the related signature model via request PK.
        """
        # get related signature by pk
        try:
            self.signature = Signature.objects.get(unique_code=pk)
        except Exception:
            raise Http404

    def post(self, request, *args, **kwargs):
        # set tokengate
        self.set_ticketed_event(*args, **kwargs)

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

        # loop over TicketedEventGrantAccess.checkout_selections & create Ticket
        ticket_data = []
        for obj in self.checkout_selections:
            ticket, created = Ticket.objects.get_or_create(
                wallet_address=self.wallet_address,
                tokengate=self.tokengate,
                requirement=obj["requirement"],
                option=obj["option"],
            )

            # set data after getting / creating
            ticket.populate_data(signature=self.signature)

            # append ticket download URL to ticket_data
            ticket_data.append(ticket.temporary_download_url)

        # return
        return Response(ticket_data, status=200)
