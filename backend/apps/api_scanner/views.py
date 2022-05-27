import uuid

from django.http import Http404

from rest_framework import serializers as drf_serializers
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
import urllib3

from apps.root.models import RedemptionAccessKey, Ticket
from apps.services import ticketing_service

from . import serializers


class SetAccessKeyAndTicketedEventMixin:
    """
    Custom helper class to set ticketed_event based on url kwargs
    """
    lookup_field = 'redemption_access_key'

    redemption_access_key = None
    ticketed_event = None

    def set_ticketed_event_and_redemption_access_key(
        self, redemption_access_key: uuid.UUID
    ):
        try:
            self.redemption_access_key = RedemptionAccessKey.objects.get(
                id=redemption_access_key
            )
            self.ticketed_event = self.redemption_access_key.ticketed_event
        except Exception:
            raise Http404({
                "code": "redemption-access-key-invalid",
                "message": "Redemption access key does not exist."
            })


class TicketedEventRetrieve(APIView, SetAccessKeyAndTicketedEventMixin):
    """
    Returns ticketed_event for the given redemption_access_key.
    """

    permission_classes = (AllowAny,)

    def get(self, request, *args, access_key: uuid.UUID, **kwargs):
        self.set_ticketed_event_and_redemption_access_key(access_key)
        try:
            serializer = serializers.TicketedEventSerializer(self.ticketed_event)
        except Http404 as exc:
            return Response(
                status=404,
                data=exc.args[0]
            )

        return Response(serializer.data)


class ScanTicket(APIView, SetAccessKeyAndTicketedEventMixin):
    """
    Redeem a ticket for the given redemption_access_key.
    """

    OutputSerializer = serializers.TicketSerializer

    class InputSerializer(drf_serializers.Serializer):
        embed_code = drf_serializers.CharField()

    permission_classes = (AllowAny,)

    def post(self, request, *args, access_key: uuid.UUID, **kwargs):
        self.set_ticketed_event_and_redemption_access_key(access_key)

        # Parse input to get embed-code
        input_serializer = self.InputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        embed_code = input_serializer.validated_data['embed_code']

        # Retrieve ticket
        try:
            ticket = ticketing_service.get_ticket_from_embedded_qr_code(embed_code)
        except ticketing_service.InvalidEmbedCodeError:
            return Response(
                status=404,
                data={
                    "code": "embed-code-invalid",
                    "message": "Invalid embedcode format."
                })
        except Ticket.DoesNotExist:
            return Response(
                status=404,
                data={
                    "code": "embed-code-not-found",
                    "message": "Ticket with given embed code does not exist."
                })

        # Redeem ticket
        try:
            ticketing_service.redeem_ticket(ticket, self.redemption_access_key)
        except ticketing_service.ForbiddenRedemptionError:
            return Response(
                status=403,
                data={
                    "code": "redemption-access-key-unauthorized",
                    "message": "Redemption access key has no access to this TicketedEvent."
                })
        except ticketing_service.AlreadyRedeemed:
            return Response(
                status=409,
                data={
                    "code": "ticket-already-redeemed",
                    "message": "Ticket has already been redeemed."
                })

        output_serializer = self.OutputSerializer(ticket)
        return Response(output_serializer.data)
