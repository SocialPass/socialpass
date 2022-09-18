from django.shortcuts import get_object_or_404
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api_checkout import serializers, services
from apps.root.models import BlockchainOwnership, Event


class EventMixin:
    """
    Mixin for checkoutportal flow
    """

    event = None

    def dispatch(self, request, *args, **kwargs):
        """
        Get Event by public ID path argument
        """
        self.event = get_object_or_404(Event, public_id=self.kwargs["public_id"])
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """To be overridden by parent"""
        raise MethodNotAllowed(method="POST")

    def get(self, request, *args, **kwargs):
        """To be overridden by parent"""
        raise MethodNotAllowed(method="GET")


class CheckoutPortalRetrieve(EventMixin, APIView):
    """
    GET view for retrieving Event
    """

    def get(self, request, *args, **kwargs):
        """
        Retrieve serialized Event
        """
        serialized_data = serializers.EventSerializer(
            self.event, context={"request": request}
        ).data
        return Response(serialized_data)


class CheckoutPortalRequest(EventMixin, APIView):
    """
    POST view for requesting Event checkout
    """

    def post(self, request, *args, **kwargs):
        """
        Route to method based on QS
        """
        # get QS and pass to respective method
        checkout_type = request.GET.get("checkout_type")
        if not checkout_type:
            return Response('"checkout_type" query paramter not provided', status=401)

        if checkout_type == "blockchain_ownership":
            return self.checkout_blockchain_ownership(request, *args, **kwargs)

    def checkout_blockchain_ownership(self, request, *args, **kwargs):
        """
        Request a checkout via blockchain asset ownership
        Create blockchain_ownership DB record to be signed by client
        """
        self.input_serializer = None
        self.output_serializer = serializers.BlockchainOwnershipSerializer

        # Create blockchain ownership record
        blockchain_ownership = BlockchainOwnership.objects.create(event=self.event)

        # Serialize and return
        serialized_data = self.output_serializer(blockchain_ownership).data
        return Response(serialized_data)


class CheckoutPortalProcess(EventMixin, APIView):
    """
    POST view for processing Event checkout
    """

    def post(self, request, *args, **kwargs):
        """
        Route to method based on QS
        """
        checkout_type = request.GET.get("checkout_type")
        if not checkout_type:
            return Response('"checkout_type" query paramter not provided', status=401)

        if checkout_type == "blockchain_ownership":
            return self.checkout_blockchain_ownership(request, *args, **kwargs)

    def checkout_blockchain_ownership(self, request, *args, **kwargs):
        """
        Process a checkout via blockchain asset ownership
        Validate wallet address blockchain_ownership record
        Verify ticket selection
        Issue tickets based on wallet address and related blockchain asset ownership
        """
        self.input_serializer = serializers.VerifyBlockchainOwnershipSerializer
        self.output_serializer = serializers.TicketSerializer

        # 1. Serialize Data
        blockchain_serializer = self.input_serializer(data=request.data)
        blockchain_serializer.is_valid(raise_exception=True)

        # 2. Get wallet blockchain_ownership
        blockchain_ownership = get_object_or_404(
            BlockchainOwnership,
            id=blockchain_serializer.data["blockchain_ownership_id"],
            event=self.event,
        )

        # 3. validate wallet blockchain_ownership
        (
            wallet_validated,
            response_msg,
        ) = services.validate_blockchain_wallet_ownership(
            event=self.event,
            blockchain_ownership=blockchain_ownership,
            signed_message=blockchain_serializer.data["signed_message"],
            wallet_address=blockchain_serializer.data["wallet_address"],
        )
        if not wallet_validated:
            return Response(response_msg, status=403)

        # 4. Get # of tickets available
        try:
            tickets_to_issue = services.get_available_tickets(
                event=self.event,
                tickets_requested=blockchain_serializer.data["tickets_requested"],
            )
        except (
            services.TooManyTicketsRequestedError,
            services.TooManyTicketsIssuedError,
            services.TicketsSoldOutError,
        ) as e:
            return Response(str(e), status=403)

        # 5. try to create & return tickets based on blockchain ownership
        try:
            tickets = services.create_tickets_blockchain_ownership(
                event=self.event,
                blockchain_ownership=blockchain_ownership,
                tickets_to_issue=tickets_to_issue,
            )
            return Response(self.output_serializer(tickets, many=True).data)
        except (
            services.ZeroBlockchainAssetsError,
            services.PartialBlockchainAssetError,
        ) as e:
            return Response(str(e), status=403)
