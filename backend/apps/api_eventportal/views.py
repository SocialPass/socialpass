from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import MethodNotAllowed, NotFound
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.root.models import BlockchainOwnership, Event
from apps.services import blockchain_service
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
           return self.blockchain_ownership(request, *args, **kwargs)


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

    def blockchain_ownership(self, request, *args, **kwargs):
        signature = BlockchainOwnership.objects.create(event=self.event)
        blockchain_serializer = serializers.RequestAccessBlockchain(signature)
        return Response(blockchain_serializer.data)


class EventPortalProcessCheckout(EventMixin, APIView):
    """
    POST view for granting access into eventportal
    """
    def get(self, request, *args, **kwargs):
        raise MethodNotAllowed(method='GET')

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def blockchain_ownership(self, request, *args, **kwargs):
        # 1. Serialize Data
        blockchain_serializer = serializers.BlockchainOwnershipSerializer(data=request.data)
        blockchain_serializer.is_valid(raise_exception=True)

        # 2. Get wallet signature
        self.signature = get_object_or_404(
            BlockchainOwnership,
            unique_code=blockchain_serializer.data['signature_id'],
            event=self.event
        )

        # 3. validate wallet signature
        validated, response_msg = blockchain_service.validate_signature(
            signature=self.signature,
            event=self.event,
            signed_message=blockchain_serializer.data['signed_message'],
            wallet_address=blockchain_serializer.data['wallet_address'],
        )
        if not validated:
            return Response(response_msg, status=403)

        # 4. Verify ticket selection valid
        # 5. Verify ticket against blockchain ownership
        # 6. Issue Tickets
