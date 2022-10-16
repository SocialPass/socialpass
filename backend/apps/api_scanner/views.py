import json
import uuid

from django.http import Http404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.root import exceptions
from apps.root.models import Ticket, TicketRedemptionKey

from . import serializers


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
    input_serializer = None
    output_serializer = serializer_class

    def get_object(self, *args, **kwargs):
        return self.event

    @swagger_auto_schema(
        request_body=input_serializer,
        responses={200: output_serializer},
    )
    def get(self, request, *args, **kwargs):
        try:
            self.set_event_and_redemption_access_key(kwargs["access_key"])
        except Http404 as exc:
            return Response(status=404, data=exc.args[0])

        return super().get(request, *args, **kwargs)


class ScanTicket(SetAccessKeyAndEventMixin, GenericAPIView):
    """
    POST view for redeem a ticket for the given redemption_access_key.
    """

    permission_classes = (AllowAny,)
    serializer_class = serializers.ScanTicketOutputSerializer
    input_serializer = serializers.ScanTicketInputSerializer
    output_serializer = serializer_class

    @swagger_auto_schema(
        request_body=input_serializer,
        responses={200: output_serializer},
    )
    def post(self, request, *args, access_key: uuid.UUID, **kwargs):
        self.set_event_and_redemption_access_key(access_key)

        # Parse input to get embed-code
        input_serializer = self.input_serializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        embed_code = input_serializer.validated_data["embed_code"]

        # Retrieve ticket
        try:
            ticket = Ticket.objects.get(embed_code=embed_code)
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
            ticket.redeem_ticket(self.redemption_access_key)
        except exceptions.ForbiddenRedemptionError:
            return Response(
                status=403,
                data={
                    "code": "redemption-access-key-unauthorized",
                    "message": "Redemption access key has no access to this Event.",
                },
            )
        except exceptions.AlreadyRedeemed:
            return Response(
                status=409,
                data={
                    "code": "ticket-already-redeemed",
                    "message": "Ticket has already been redeemed.",
                },
            )

        output_serializer = self.get_serializer(ticket)
        return Response(output_serializer.data)


class TicketsListView(SetAccessKeyAndEventMixin, ListAPIView):
    """
    GET view for list tickets for the given redemption_access_key.
    """

    permission_classes = (AllowAny,)
    serializer_class = serializers.TicketSerializer
    input_serializer = None
    output_serializer = serializer_class
    queryset = Ticket.objects.all().order_by("-id")  # order_by prevent unordeing warning

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(checkout_item__ticket_tier__event=self.event, **self.filter_kwargs)
        )

    @swagger_auto_schema(
        request_body=input_serializer,
        responses={200: output_serializer},
        manual_parameters=[
            openapi.Parameter(
                "redeemed",
                openapi.IN_QUERY,
                type=openapi.TYPE_BOOLEAN,
            )
        ],
    )
    def get(self, request, *args, **kwargs):
        self.set_event_and_redemption_access_key(kwargs["access_key"])

        self.filter_kwargs = {}
        if "redeemed" in request.GET:
            try:
                self.filter_kwargs["redeemed"] = json.loads(request.GET["redeemed"])
                assert isinstance(self.filter_kwargs["redeemed"], bool)
            except (json.decoder.JSONDecodeError, AssertionError):
                return Response("redeemed query param must be 'true'|'false'", 400)

        return super().get(request, *args, **kwargs)
