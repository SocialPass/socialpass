from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import MethodNotAllowed, NotFound
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.root.models import BlockchainOwnership, Event
from apps.services import blockchain_service, ticket_service
from . import serializers


class EventMixin:
    """
    Mixin for eventportal flow
    DISPATCH: Get ticketed event by public ID
    GET: Serialize / Return ticketed event
    POST: Based on 'checkout_type' query string, call respective method:
    """
    event = None

    def dispatch(self, request, *args, **kwargs):
        # get ticketed event associated
        self.event = get_object_or_404(Event, public_id=self.kwargs['public_id'])
        # success, proceed with dispatch
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        # return serialized event
        return Response(serializers.EventPortalRetrieveSerializer(self.event).data)

    def post(self, request, *args, **kwargs):
        # get QS and pass to respective method
        checkout_type = request.GET.get("checkout_type")
        if not checkout_type:
           return Response('"checkout_type" query paramter not provided', status=401)

        if checkout_type == "blockchain_ownership":
           return self.checkout_blockchain_ownership(request, *args, **kwargs)


class EventPortalRetrieve(EventMixin, APIView):
    """
    GET view for retrieving eventportal
    """
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        raise MethodNotAllowed(method='POST')


class EventPortalRequestCheckout(EventMixin, APIView):
    """
    POST view for requesting access into eventportal
    Based on query string, routed to respective method
    """
    def get(self, request, *args, **kwargs):
        raise MethodNotAllowed(method='GET')

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def checkout_blockchain_ownership(self, request, *args, **kwargs):
        blockchain_ownership = BlockchainOwnership.objects.create(event=self.event)
        blockchain_serializer = serializers.RequestAccessBlockchain(blockchain_ownership)
        return Response(blockchain_serializer.data)


class EventPortalProcessCheckout(EventMixin, APIView):
    """
    POST view for granting access into eventportal
    """
    def get(self, request, *args, **kwargs):
        raise MethodNotAllowed(method='GET')

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def checkout_blockchain_ownership(self, request, *args, **kwargs):
        # 1. Serialize Data
        blockchain_serializer = serializers.BlockchainOwnershipSerializer(data=request.data)
        blockchain_serializer.is_valid(raise_exception=True)

        # 2. Get wallet blockchain_ownership
        blockchain_ownership = get_object_or_404(
            BlockchainOwnership,
            id=blockchain_serializer.data['blockchain_ownership_id'],
            event=self.event
        )

        # 3. validate wallet blockchain_ownership
        wallet_validated, response_msg = blockchain_service.validate_blockchain_wallet_ownership(
            event=self.event,
            blockchain_ownership=blockchain_ownership,
            signed_message=blockchain_serializer.data['signed_message'],
            wallet_address=blockchain_serializer.data['wallet_address'],
        )
        if wallet_validated:
            return Response(response_msg, status=403)

        # 4. Get # of tickets available
        tickets_to_issue = ticket_service.get_tickets_to_issue(
            event=self.event,
            tickets_requested=blockchain_serializer.data['tickets_requested']
        )
        if tickets_to_issue == 0:
            return Response("Sold out :/", status=403)

        # 5. Issue tickets based on blockchain ownership
        tickets = ticket_service.issue_tickets_blockchain_ownership(
            event=self.event,
            blockchain_ownership=blockchain_ownership,
            tickets_to_issue=tickets_to_issue
        )
        if not tickets:
            return Response("Could not generate tickets based on blockchain asset ownership.", status=403)

        return Response(tickets)
