from rest_framework.mixins import RetrieveModelMixin
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from .models import AirdropGate, AirdropList, TicketGate, TicketList
from .api_permissions import IsTeamMember, IsTokenGateTeamMember
from .api_serializers import AirdropGateSerializer, TicketGateSerializer


class AirdropGateViewSet(GenericViewSet, RetrieveModelMixin):
    """
    A viewset for viewing & accessing Airdrop token gates.
    """
    queryset = AirdropGate.objects.all()

    def get_serializer_class(self):
        """
        Instantiate and return the serializer based on action
        """
        if self.action == 'retrieve':
            return AirdropGateSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view
        requires.
        """
        permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]


class TicketGateViewSet(GenericViewSet, RetrieveModelMixin):
    """
    A viewset for viewing & accessing Ticket token gates.
    """
    queryset = TicketGate.objects.all()

    def get_serializer_class(self):
        """
        Instantiate and return the serializer based on action
        """
        if self.action == 'retrieve':
            return AirdropGateSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view
        requires.
        """
        permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
