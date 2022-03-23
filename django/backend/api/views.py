from rest_framework.generics import GenericAPIView, RetrieveAPIView, ListAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from root.models import Signature, Ticket, TicketGate, Team

from django.http import Http404

from .serializers import (
    TicketGateSerializer,
    TicketSerializer,
    VerifyGateSerializer,
    TeamSerializer
)

#
# MIXINS ////////////////////////////////////////////////////////////////////////////////////
#
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


#
# HOSTED PAGE ////////////////////////////////////////////////////////////////////////////////
#
class HostedPageRetrieve(APIView):
    """
    Wrapper view for fetching all relevant hosted page info.

    In addition to `Team` model info, this view calls all tokengate list views
    that the team has access to, defined by `team.software_types`.

    All child list views will have the relevant team passed for querying.
    In addition, child list views will handle filtering by relevant QS
    """
    permission_classes = [AllowAny]
    def get(self, request):
        response = {}

        # try to get team
        team = Team.get_by_domain(request=request)
        if team and team.subdomain:
            response['team'] = TeamSerializer(team).data
        else:
            raise Http404

        # fetch available gates by team software_types
        for s in team.software_types:
            if s == 'TICKET':
                ticketgates = TicketGateList.as_view(team=team)(request._request)
                response['ticket_gates'] = ticketgates.data

        # return response
        return Response(response)


#
# TICKETGATES ////////////////////////////////////////////////////////////////////////////////
#
class TicketGateList(ListAPIView):
    """
    View for retrieving ticket gates by subdomain

    Used internally by HostedPageRetrieve (access set to True)
    """
    serializer_class = TicketGateSerializer
    permission_classes = [AllowAny]
    team = None

    def get_queryset(self):
        # title querystring
        if self.request.GET.get('title'):
            return TicketGate.objects.filter(
                team=self.team,
                title__icontains=self.request.GET['title']
            )

        # no querystring
        return TicketGate.objects.filter(team=self.team)




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

