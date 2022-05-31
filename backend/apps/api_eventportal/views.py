from django.http import Http404
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.services import blockchain_service
from apps.root.models import Signature, Ticket, TicketedEvent
from . import serializers


class EventPortalRetrieve(RetrieveAPIView):
    """
    Returns TicketedEvent associated with event portal
    """
    lookup_field = "public_id"
    queryset = TicketedEvent.objects.all()
    serializer_class = serializers.EventPortalRetrieveSerializer
    permission_classes = [AllowAny]


class TicketedEventAccess():
    """
    Mixin for Ticketed Event access flow
    """
    ticketed_event = None

    def set_ticketed_event(self, public_id):
        try:
            self.ticketed_event = TicketedEvent.objects.get(public_id=public_id)
        except Exception:
            raise Http404

    def blockchain_ownership(self, request, *args, **kwargs):
        return Response("Not yet implemented")

    def post(self, request, *args, **kwargs):
        # set ticketed event
        self.set_ticketed_event(public_id=kwargs['public_id'])

        # get QS and pass to respective method
        query_string = request.GET.get('access_type')
        if not query_string:
            return Response('"access_type" query paramter not provided', status=401)

        if query_string == 'blockchain':
            return self.blockchain_ownership(request, *args, **kwargs)


class EventPortalRequestAccess(TicketedEventAccess, APIView):
    """
    Master view for requesting access into event portal
    Based on 'access' query-string

    Current types of access, corresponding to method type
    - Asset Ownership ('blockchain')
    """
    def blockchain_ownership(self, request, *args, **kwargs):
        signature = Signature.objects.create(
            ticketed_event=self.ticketed_event
        )
        blockchain_serializer = serializers.RequestAccessBlockchain(signature)
        return Response(blockchain_serializer.data)


class EventPortalGrantAccess(TicketedEventAccess, APIView):
    """
    Master view for verifying access & issuing tickets into event portal
    Based on 'access' query-string

    Current types of access, corresponding to method type
    - Asset Ownership ('blockchain')
    """
    def blockchain_ownershipp(self, request, *args, **kwargs):
        """
        # 1. Serialize Data
        blockchain_serializer = serializers.BlockchainOwnershipSerializer(data=request.data)
        blockchain_serializer.is_valid(raise_exception=True)
        print(blockchain_serializer)
        return Response('ok')

        # 2. Verify wallet signature
        try:
            self.signature = Signature.objects.get(unique_code='', ticketed_event='')
        except Exception:
            raise Http404

        validated, response_msg = blockchain_service.validate_signature(
            signature=self.signature,
            ticketed_event=self.ticketed_event,
            signed_message='',
            address=''
        )
        if not validated:
            return Response(response_msg, status=403)

        # 3. Verify blockchain ownership

        # 4. Verify tickets

        # 5. Issue Tickets
        """
