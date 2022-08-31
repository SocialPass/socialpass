import json
import uuid

from django.http import Http404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.root.models import Ticket, TicketRedemptionKey

from . import serializers, services


class SetAccessKeyAndEventMixin:
    """
    Custom helper class to set event based on url kwargs
    """

    lookup_field = "redemption_access_key"

    redemption_access_key = None
    event = None

    def set_event_and_redemption_access_key(self, redemption_access_key: uuid.UUID):
        try:
            self.redemption_access_key = TicketRedemptionKey.objects.get(
                public_id=redemption_access_key
            )
            self.event = self.redemption_access_key.event
        except Exception:
            raise Http404(
                {
                    "code": "redemption-access-key-invalid",
                    "message": "Redemption access key does not exist.",
                }
            )


class EventRetrieve(SetAccessKeyAndEventMixin, RetrieveAPIView):
    """
    GET view for retrieving Event  for the given redemption_access_key
    Overrides get_object to use self.event from SetAccessKeyAndEventMixin
    """

    permission_classes = (AllowAny,)
    serializer_class = serializers.EventSerializer

    def get_object(self, *args, **kwargs):
        return self.event

    def get(self, request, *args, **kwargs):
        try:
            self.set_event_and_redemption_access_key(kwargs["access_key"])
        except Http404 as exc:
            return Response(status=404, data=exc.args[0])

        return super().get(request, *args, **kwargs)


class ScanTicket(APIView, SetAccessKeyAndEventMixin):
    """
    Redeem a ticket for the given redemption_access_key.
    """

    permission_classes = (AllowAny,)

    @swagger_auto_schema(
        responses={200: serializers.ScanTicketOutputSerializer},
        request_body=serializers.ScanTicketInputSerializer,
    )
    def post(self, request, *args, access_key: uuid.UUID, **kwargs):
        self.set_event_and_redemption_access_key(access_key)

        # Parse input to get embed-code
        input_serializer = serializers.ScanTicketInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        embed_code = input_serializer.validated_data["embed_code"]

        # Retrieve ticket
        try:
            ticket = services.get_ticket_from_embedded_qr_code(embed_code)
        except services.InvalidEmbedCodeError:
            return Response(
                status=422,
                data={
                    "code": "embed-code-invalid",
                    "message": "Invalid embedcode format.",
                },
            )
        except Ticket.DoesNotExist:
            return Response(
                status=404,
                data={
                    "code": "embed-code-not-found",
                    "message": "Ticket with given embed code does not exist.",
                },
            )

        # Redeem ticket
        try:
            services.redeem_ticket(ticket, self.redemption_access_key)
        except services.ForbiddenRedemptionError:
            return Response(
                status=403,
                data={
                    "code": "redemption-access-key-unauthorized",
                    "message": "Redemption access key has no access to this Event.",
                },
            )
        except services.AlreadyRedeemed:
            return Response(
                status=409,
                data={
                    "code": "ticket-already-redeemed",
                    "message": "Ticket has already been redeemed.",
                },
            )

        output_serializer = serializers.ScanTicketOutputSerializer(ticket)
        return Response(output_serializer.data)


class TicketsListView(APIView, SetAccessKeyAndEventMixin):
    """
    Returns event for the given redemption_access_key.
    """

    permission_classes = (AllowAny,)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "redeemed", in_=openapi.IN_QUERY, type=openapi.TYPE_BOOLEAN
            )
        ],
        responses={200: serializers.TicketSerializer},
    )
    def get(self, request, *args, access_key: uuid.UUID, **kwargs):
        self.set_event_and_redemption_access_key(access_key)

        filter_kwargs = {}
        if "redeemed" in request.GET:
            try:
                filter_kwargs["redeemed"] = json.loads(request.GET["redeemed"])
                assert isinstance(filter_kwargs["redeemed"], bool)
            except (json.decoder.JSONDecodeError, AssertionError):
                return Response("redeemed query param must be 'true'|'false'", 400)

        tickets = Ticket.objects.filter(event=self.event, **filter_kwargs)
        output_serializer = serializers.TicketSerializer(tickets, many=True)
        return Response(output_serializer.data)
