from rest_framework.generics import GenericAPIView, RetrieveAPIView, ListAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from root.models import Signature, Ticket, TicketGate, Team, TokenGate

from django.http import Http404

from .serializers import (
    TeamSerializer,
    TokenGatePolymorphicSerializer,
    AccessGateSerializer,
    TicketGateDetailSerializer,
    TicketGateSerializer,
    TicketSerializer
)

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

    def get(self, request, *args, **kwargs):
        """
        Method fetches team by given domain, and compiles all necessary data
        for hosted page.
        """
        response = {}

        # 1. fetch team, raise 404 on error
        try:
            domain = request.GET.get('domain', None)
            team = Team.get_by_domain(domain)
            if team.subdomain:
                response['team'] = TeamSerializer(team).data
        except:
            raise Http404

        # 2. fetch featured gates
        featuredgates = FeaturedGateList.as_view(team=team)(request._request)
        response['featured_gates'] = featuredgates.data

        # 3. fetch available gates
        allgates = AllGateList.as_view(team=team)(request._request)
        response['all_gates'] = allgates.data

        # return response
        return Response(response)


class FeaturedGateList(ListAPIView):
    """
    View for retrieving featured gates by subdomain

    Used internally by HostedPageRetrieve (access set to True)
    """
    serializer_class = TokenGatePolymorphicSerializer
    permission_classes = [AllowAny]
    team = None

    def get_queryset(self):
        # title querystring
        if self.request.GET.get('title'):
            return TokenGate.objects.filter(
                team=self.team,
                featured=True,
                title__icontains=self.request.GET['title']
            )

        # no querystring
        return TokenGate.objects.filter(team=self.team, featured=True)


class AllGateList(ListAPIView):
    """
    View for retrieving ticket gates by subdomain

    Used internally by HostedPageRetrieve (access set to True)
    """
    serializer_class = TokenGatePolymorphicSerializer
    permission_classes = [AllowAny]
    team = None

    def get_queryset(self):
        # title querystring
        if self.request.GET.get('title'):
            return TokenGate.objects.filter(
                team=self.team,
                featured=False,
                title__icontains=self.request.GET['title']
            )

        # no querystring
        return TokenGate.objects.filter(team=self.team, featured=False)

#
# TICKETGATES ////////////////////////////////////////////////////////////////////////////////
#
class TicketGateRetrieve(RetrieveAPIView):
    """
    View for retrieving ticket gate by `public_id`
    """

    lookup_field = "public_id"
    queryset = TicketGate.objects.all()
    serializer_class = TicketGateDetailSerializer
    permission_classes = [AllowAny]


class TicketGateAccess(CreateModelMixin, GenericAPIView):
    """
    View for accessing ticket gate via verified `Signature`,
    and then creating / returning `Ticket` entry(s)
    """

    permission_classes = [AllowAny]

    def get_signature(self, pk):
        """
        Helper method to get the related signature model via request PK.
        """
        # get related signature by pk
        try:
            return Signature.objects.get(unique_code=pk)
        except Exception:
            raise Http404

    def create(self, request, *args, **kwargs):
        """
        CREATE method generates, serializes and returns ticket data
        """
        # generate ticket data from validated passes
        ticketdata = Ticket.generate_from_validated_passes(**kwargs)

        # serialize & return ticket data
        serializer = TicketSerializer(data=ticketdata, many=True)
        serializer.is_valid()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    def post(self, request):
        """
        POST method validates signature, as well as gate requirements.
        Success proceeds to self.creation
        """
        # serialize and verify data
        serialized = AccessGateSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)

        # get signature obj, throw 404 if not fund
        signature = self.get_signature(serialized.data.get("signature_id"))

        # validate signed_message from signature;
        sig_success, sig_code, sig_msg = signature.validate(
            address=serialized.data.get("address"),
            signed_message=serialized.data.get("signed_message"),
            tokengate_id=serialized.data.get("tokengate_id"),
        )
        if not sig_success:
            return Response(sig_msg, status=sig_code)

        # validate requirements against issued id's
        gate = TicketGate.objects.get(public_id=serialized.data.get("tokengate_id"))
        req_success, req_code, req_msg = gate.validate_requirements(
            wallet_address=serialized.data.get("address")
        )
        if not req_success:
            return Response(req_msg, status=req_code)

        # issue reward (http201 created)
        response = self.create(
            request,
            signature=signature,
            tokengate=gate,
            wallet_address=serialized.data.get("address"),
            validated_passes=req_msg["validated_passes"],
        )
        return response

