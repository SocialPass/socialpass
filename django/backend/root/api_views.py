from django.http import Http404
from rest_framework.generics import RetrieveAPIView, GenericAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import AirdropGate, TicketGate, Signature
from .api_permissions import IsTeamMember, IsTokenGateTeamMember
from .api_serializers import (
    AirdropGateSerializer,
    TicketGateSerializer,
    VerifyGateSerializer,
    AirdropSerializer,
    TicketSerializer
)

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

class AirdropGateAccess(GetSignatureObjectMixin, CreateModelMixin, GenericAPIView):
    """
    APIView for accessing airdrop gates via verified `Signature`,
    and then creating / returning `AirdropList` entry
    """
    permission_classes = [AllowAny]
    serializer_class = AirdropSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data={
            "wallet_address": kwargs['wallet_address'],
            "transaction_hash": kwargs['transaction_hash'],
            "tokengate": kwargs['tokengate']
        })
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

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

        # validate requirements

        # issue reward (201 created)
        response = self.create(request, wallet_address=serialized.data.get('address'), transaction_hash="0x", tokengate=signature.tokengate)
        return response

class TicketGateRetrieve(RetrieveAPIView):
    """
    View for retrieving ticket gate by `public_id`
    """
    lookup_field = 'public_id'
    queryset = TicketGate.objects.all()
    serializer_class = TicketGateSerializer
    permission_classes = [AllowAny]

class TicketGateAccess(GetSignatureObjectMixin, CreateModelMixin, GenericAPIView):
    """
    APIView for accessing ticket gate via verified `Signature`,
    and then creating / returning `TicketList` entry
    """
    permission_classes = [AllowAny]
    serializer_class = TicketSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data={
            "wallet_address": kwargs['wallet_address'],
            "ticket_url": kwargs['ticket_url'],
            "tokengate": kwargs['tokengate']
        })
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

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

        # validate requirements

        # issue reward (201 created)
        response = self.create(request, wallet_address=serialized.data.get('address'), ticket_url="https://test.local", tokengate=signature.tokengate)
        return response
