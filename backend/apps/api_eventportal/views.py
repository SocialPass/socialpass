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
    serializer_class = serializers.TicketedEventSerializer
    permission_classes = [AllowAny]


class EventPortalRequestAccess(APIView):
    """
    Master view for requesting access into event portal
    Based on 'access' query-string

    Current types of access
    - Asset Ownership ('blockchain')
    """
    pass

class EventPortalGrantAccess(APIView):
    """
    Master view for verifying access & issuing tickets into event portal
    Based on 'access' query-string

    Current types of access
    - Asset Ownership ('blockchain')
    """
    pass
