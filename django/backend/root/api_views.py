from rest_framework import status
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AirdropGate, TicketGate, Signature
from .api_permissions import IsTeamMember, IsTokenGateTeamMember
from .api_serializers import AirdropGateSerializer, TicketGateSerializer, VerifyGateSerializer

class AirdropGateViewSet(GenericViewSet, RetrieveModelMixin):
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view
        requires.
        """
        permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def get_object(self, pk):
        """
        Instantiate and return the object based on action
        """
        if self.action == 'retrieve':
            return AirdropGate.objects.get(public_id=pk)
        if self.action == 'verify':
            return Signature.objects.select_related('tokengate').get(unique_code=pk)

    def get_queryset(self):
        """
        Instantiate and return the queryset based on action
        """
        if self.action == 'retrieve':
            return AirdropGate.objects.all()
        if self.action == 'verify':
            return Signature.objects.all()

    def get_serializer_class(self):
        """
        Instantiate and return the serializer based on action
        """
        if self.action == 'retrieve':
            return AirdropGateSerializer

    @action(detail=False, methods=['post'])
    def verify(self, request):
        """
        Custom detail action for verifying AirdropGate request.
        """
        # serialize and verify data
        serialized = VerifyGateSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)

        # get signature obj, throw 404 if not fund
        try:
            signature = self.get_object(serialized.data.get('unique_code'))
        except Signature.DoesNotExist:
            return Response('Signature does not exist', status=404)

        # validate signature
        validation, status_code, error_message = signature.validate(
            address=serialized.data.get('address'),
            signed_message=serialized.data.get('signed_message'),
            public_id=serialized.data.get('public_id')
        )
        if not validation:
            return Response(error_message, status=status_code)

        return Response(status=200)


class TicketGateViewSet(GenericViewSet, RetrieveModelMixin):
    queryset = TicketGate.objects.all()
    lookup_field = 'public_id'

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
