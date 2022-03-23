from rest_framework.generics import GenericAPIView, RetrieveAPIView, ListAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from root.models import Signature, Ticket, TicketGate, Team

from django.http import Http404

from .serializers import TicketGateSerializer, TicketSerializer, VerifyGateSerializer


class GetSignatureObjectMixin:
    """
    Mixin to get signature object, used in
    token gate access views to verify the user request.
    """

    def get_signature(self, pk):
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
    and then creating / returning `Ticket` entry(s)
    """

    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """
        overrode create method to create and/or fetch ticket data,
        as well as serializing / returning
        """
        # create and/or fetch ticket data
        ticketdata = []
        for id in kwargs["validated_ids"]:
            ticket, created = Ticket.objects.get_or_create(
                wallet_address=kwargs["wallet_address"],
                tokengate=kwargs["tokengate"],
                token_id=id,
            )
            if not ticket.signature:
                ticket.signature = kwargs["signature"]
                ticket.download_url = "http://testing.local"
                ticket.save()
            ticketdata.append(ticket.__dict__)

        # serialize & return ticket data
        serializer = TicketSerializer(data=ticketdata, many=True)
        serializer.is_valid()
        print(serializer.errors, serializer.data)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    def post(self, request):
        """
        overrode POST method to verify signature as well as requirements.
        Will either throw HTTP error or proceed to reward creation
        """
        # serialize and verify data
        serialized = VerifyGateSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)

        # get signature obj, throw 404 if not fund
        signature = self.get_signature(serialized.data.get("signature_id"))

        # validate signature;
        sig_success, sig_code, sig_msg = signature.validate(
            address=serialized.data.get("address"),
            signed_message=serialized.data.get("signed_message"),
            tokengate_id=serialized.data.get("tokengate_id"),
        )
        if not sig_success:
            return Response(sig_msg, status=sig_code)

        # validate requirements against issued id's
        # note: we exclude tickets created by this wallet
        gate = TicketGate.objects.get(public_id=serialized.data.get("tokengate_id"))
        issued_ids = list(
            gate.tickets.exclude(
                wallet_address=serialized.data.get("address")
            ).values_list("token_id", flat=True)
        )
        req_success, req_code, req_msg = gate.validate_requirements(
            wallet_address=serialized.data.get("address"), reward_list=issued_ids
        )

        if not req_success:
            return Response(req_msg, status=req_code)
        print(req_msg, req_code)

        # issue reward (201 created)
        response = self.create(
            request,
            wallet_address=serialized.data.get("address"),
            signature=signature,
            tokengate=gate,
            validated_ids=req_msg["validated_ids"],
        )
        return response

