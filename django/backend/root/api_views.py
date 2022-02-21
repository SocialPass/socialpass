from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView, GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AirdropGate, TicketGate, Signature
from .api_permissions import IsTeamMember, IsTokenGateTeamMember
from .api_serializers import AirdropGateSerializer, TicketGateSerializer, VerifyGateSerializer

class AirdropGateRetrieve(RetrieveAPIView):
    """
    View for retrieving airdrop gate by `public_id`
    """
    queryset = AirdropGate.objects.all()
    serializer_class = AirdropGateSerializer
    lookup_field = 'public_id'
    permission_classes = [AllowAny]

class AirdropGateAccess(GenericAPIView):
    """
    APIView for accessing airdrop gates via verified `Signature`
    """
    queryset = Signature.objects.all()
    permission_classes = [AllowAny]

    def post(self, request):
        # serialize and verify data
        serialized = VerifyGateSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)

        # get signature obj, throw 404 if not fund
        try:
            signature = Signature.objects.get(unique_code=serialized.data.get('signature_id'))
        except:
            return Response('Signature matching "signature_id" does not exist', status=404)

        # validate signature
        validation, status_code, error_message = signature.validate(
            address=serialized.data.get('address'),
            signed_message=serialized.data.get('signed_message'),
            tokengate_id=serialized.data.get('tokengate_id')
        )
        if not validation:
            return Response(error_message, status=status_code)

        # reward
        return Response('ok', status=200)

class TicketGateRetrieve(RetrieveAPIView):
    """
    View for retrieving airdrop gate by `public_id`
    """
    queryset = TicketGate.objects.all()
    serializer_class = TicketGateSerializer
    lookup_field = 'public_id'
    permission_classes = [AllowAny]
