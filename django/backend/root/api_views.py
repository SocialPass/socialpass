from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView, GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AirdropGate, TicketGate, Signature
from .api_permissions import IsTeamMember, IsTokenGateTeamMember
from .api_serializers import AirdropGateSerializer, TicketGateSerializer, VerifyGateSerializer

class GetSignatureObjectMixin:
    """
    Mixin to get signature object
    """
    def get_object(self, pk):
        try:
            return Signature.objects.get(unique_code=pk)
        except:
            raise Http404

class AirdropGateRetrieve(RetrieveAPIView):
    """
    View for retrieving airdrop gate by `public_id`
    """
    lookup_field = 'public_id'
    queryset = AirdropGate.objects.all()
    serializer_class = AirdropGateSerializer
    permission_classes = [AllowAny]

class AirdropGateAccess(GetSignatureObjectMixin, APIView):
    """
    APIView for accessing airdrop gates via verified `Signature`
    """
    permission_classes = [AllowAny]

    def post(self, request):
        # serialize and verify data
        serialized = VerifyGateSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)

        # get signature obj, throw 404 if not fund
        signature = self.get_object(serialized.data.get('signature_id'))

        # validate signature
        validation, status_code, rsp_msg = signature.validate(
            address=serialized.data.get('address'),
            signed_message=serialized.data.get('signed_message'),
            tokengate_id=serialized.data.get('tokengate_id')
        )
        if not validation:
            return Response(rsp_msg, status=status_code)

        # reward
        return Response(rsp_msg, status=status_code)

class TicketGateRetrieve(RetrieveAPIView):
    """
    View for retrieving ticket gate by `public_id`
    """
    lookup_field = 'public_id'
    queryset = TicketGate.objects.all()
    serializer_class = TicketGateSerializer
    permission_classes = [AllowAny]

class TicketGateAccess(GetSignatureObjectMixin, APIView):
    """
    APIView for accessing ticket gate via verified `Signature`
    """
    permission_classes = [AllowAny]

    def post(self, request):
        # serialize and verify data
        serialized = VerifyGateSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)

        # get signature obj, throw 404 if not fund
        signature = self.get_object(serialized.data.get('signature_id'))

        # validate signature
        validation, status_code, rsp_msg = signature.validate(
            address=serialized.data.get('address'),
            signed_message=serialized.data.get('signed_message'),
            tokengate_id=serialized.data.get('tokengate_id')
        )
        if not validation:
            return Response(rsp_msg, status=status_code)

        # reward
        return Response(rsp_msg, status=status_code)
