from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from django.http import Http404

from .api_serializers import (
    AirdropGateSerializer,
    AirdropSerializer,
    TicketGateSerializer,
    TicketSerializer,
    VerifyGateSerializer,
)
from .models import AirdropGate, Signature, TicketGate


class GetSignatureObjectMixin:
    """
    Mixin to get signature object
    """

    def get_object(self, pk):
        try:
            return Signature.objects.get(unique_code=pk)
        except Exception:
            raise Http404


class TicketGateRetrieve(RetrieveAPIView):
    """
    View for retrieving ticket gate by `public_id`
    """

    lookup_field = "public_id"
    queryset = TicketGate.objects.all()
    serializer_class = TicketGateSerializer
    permission_classes = [AllowAny]


class TicketGateAccess(GetSignatureObjectMixin, CreateModelMixin, GenericAPIView):
    """
    APIView for accessing ticket gate via verified `Signature`,
    and then creating / returning `TicketList` entry
    """
    permission_classes = [AllowAny]
    def create(self, request, *args, **kwargs):
        ticketdata = []
        for p in kwargs['reward_list']:
            ticketdata.append({
                "wallet_address": kwargs["wallet_address"],
                "signature": kwargs["signature"],
                "ticket_url": kwargs["ticket_url"],
                "tokengate": kwargs["tokengate"],
                "token_id": p
            })
        serializer = TicketSerializer(
            data=ticketdata,
            many=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    def post(self, request):
        # serialize and verify data
        serialized = VerifyGateSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)

        # get signature obj, throw 404 if not fund
        signature = self.get_object(serialized.data.get("signature_id"))

        # validate signature;
        sig_success, sig_code, sig_msg = signature.validate(
            address=serialized.data.get("address"),
            signed_message=serialized.data.get("signed_message"),
            tokengate_id=serialized.data.get("tokengate_id"),
        )
        if not sig_success:
            return Response(sig_msg, status=sig_code)

        # validate requirements
        gate = TicketGate.objects.get(public_id=serialized.data.get("tokengate_id"))
        reward_ids = list(gate.tickets.all().values_list('token_id', flat=True))
        req_success, req_code, req_msg = gate.validate_requirements(
            wallet_address=serialized.data.get("address"),
            reward_list=reward_ids
        )
        if not req_success:
            return Response(req_msg, status=req_code)
        print(req_msg)

        # issue reward (201 created)
        response = self.create(
            request,
            signature=serialized.data.get("signature_id"),
            wallet_address=serialized.data.get("address"),
            ticket_url="https://test.local",
            tokengate=signature.tokengate,
            reward_list=reward_ids
        )
        return response


class AirdropGateRetrieve(RetrieveAPIView):
    """
    View for retrieving airdrop gate by `public_id`
    """

    lookup_field = "public_id"
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
        serializer = self.get_serializer(
            data={
                "wallet_address": kwargs["wallet_address"],
                "signature": kwargs["signature"],
                "transaction_hash": kwargs["transaction_hash"],
                "tokengate": kwargs["tokengate"],
            }
        )
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    def post(self, request):
        # serialize and verify data
        serialized = VerifyGateSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)

        # get signature obj, throw 404 if not fund
        signature = self.get_object(serialized.data.get("signature_id"))

        # validate signature;
        sig_success, sig_code, rsp_msg = signature.validate(
            address=serialized.data.get("address"),
            signed_message=serialized.data.get("signed_message"),
            tokengate_id=serialized.data.get("tokengate_id"),
        )
        if not sig_success:
            return Response(rsp_msg, status=sig_code)

        # validate requirements
        gate = AirdropGate.objects.get(id=serialized.data.get("tokengate_id"))
        req_success, req_code, req_msg = gate.validate_requirements(
            wallet_address=serialized.data.get("address"),
            reward_list=gate.airdrops.values_list('token_id', flat=True)
        )
        if not req_success:
            return Response(req_msg, status=req_code)
        print(req_msg)

        # issue reward (201 created)
        response = self.create(
            request,
            signature=serialized.data.get("signature_id"),
            wallet_address=serialized.data.get("address"),
            transaction_hash="0x",
            tokengate=signature.tokengate,
        )
        return response
