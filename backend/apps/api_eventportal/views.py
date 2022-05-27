from django.http import Http404
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.services import blockchain_service, ticket_service
from apps.root.models import Signature, Ticket, TicketedEvent
from . import serializers


class SetTicketedEvent():
    """
    Custom helper class to set ticketed_event based on url kwargs
    """
    ticketed_event = None

    def set_ticketed_event(self, public_id):
        try:
            self.ticketed_event = TicketedEvent.objects.get(public_id=public_id)
        except Exception:
            raise Http404


class TicketedEventRetrieve(RetrieveAPIView):
    """
    Returns ticketed_event by `public_id`
    """
    lookup_field = "public_id"
    queryset = TicketedEvent.objects.all()
    serializer_class = serializers.TicketedEventSerializer
    permission_classes = [AllowAny]


class TicketedEventRequestAccess(SetTicketedEvent, CreateAPIView):
    """
    Creates & returns one-time Signature model for an EVM client to sign.
    This signature is used as authentication in further views for accessing a Ticketed Event
    """
    serializer_class = serializers.SignatureSerializer

    def perform_create(self, serializer, *args, **kwargs):
        self.set_ticketed_event(public_id=self.kwargs["public_id"])
        serializer.save(ticketed_event=self.ticketed_event)


class TicketedEventVerifyAccess(SetTicketedEvent, APIView):
    """
    Verify Signature.signed_message, originating from TicketedEventRequestAccess,
    and mark Signature.is_verified as true
    A. Success: Return available ticket options, based on asset ownership of Signature.wallet_address
    B. Failure: Return 401 if unable to verify signature, 403 if unable to verify assets

    Note: Uses signature.unique_code as authentication (check for verified & redeemed)
    """
    def post(self, request, *args, **kwargs):
        # set ticketed_event
        self.set_ticketed_event(public_id=self.kwargs["public_id"])

        # Serialize data
        serialized = serializers.TicketedEventVerifyAccessSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)

        # Get signature from data
        try:
            self.signature = Signature.objects.get(ticketed_event=self.ticketed_event, unique_code=serialized.data.get("signature_id"))
        except Exception:
            raise Http404

        # Validate signature
        signature_success, signature_msg = blockchain_service.verify_signature(
            signature=self.signature,
            wallet_address=serialized.data.get("wallet_address"),
            signed_message=serialized.data.get("signed_message"),
            ticketed_event_id=self.ticketed_event.public_id,
        )
        if not signature_success:
            return Response(signature_msg, status=401)

        # TODO: return ticket options based on asset ownership of wallet_address
        ticketing_service.get_ticket_options(
            ticketed_event=self.ticketed_event,
            wallet_address=serialized.data.get("wallet_address")
        )
        return Response("OK")


class TicketedEventIssueTickets(SetTicketedEvent, APIView):
    """
    Issue selected ticket options, originating from TicketedEventVerifyAccess
    A. Success: Create & return selected tickets
    B. Failure: Return 401 if unable to verify signature.unique_code, 403 if unable to verify ticket selections

    Note: Uses signature.unique_code as authentication (check for verified & redeemed)
    """
    pass
