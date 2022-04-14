from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.root.models import Signature, Team, Ticket, TicketGate, TokenGate

from django.http import Http404

from .serializers import (
    AccessGateSerializer,
    TeamSerializer,
    TicketGateDetailSerializer,
    TicketSerializer,
    TokenGatePolymorphicSerializer,
    TokenGateDetailPolymorphicSerializer
)
from apps.utilities import Blockchain


#
# WIDGET API ////////////////////////////////////////////////////////////////////////////////
#
class TokenGateRetrieve(RetrieveAPIView):
    """
    View for retrieving ticket gate by `public_id`.
    Generates `Signature` alongside tokengate
    """

    lookup_field = "public_id"
    queryset = TokenGate.objects.all()
    serializer_class = TokenGateDetailPolymorphicSerializer
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

        # validate requirements
        return Response('Breakpoint', status=200)
        ############################### TODO: refactor everything below
        gate = signature.tokengate
        req_success, req_code, req_msg = Blockchain.Utilities.validate_requirements(
            limit_per_person=gate.limit_per_person,
            requirements=gate.requirements,
            wallet_address=serialized.data.get("address")
        )
        if not req_success:
            return Response(req_msg, status=req_code)
        print('hellloooo')
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

#
# EXPLORE API ////////////////////////////////////////////////////////////////////////////////
#
class ExplorePageRetrieve(APIView):
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
            domain = request.GET.get("domain", None)
            team = Team.get_by_domain(domain)
            if team.subdomain:
                response["team"] = TeamSerializer(team).data
        except Exception:
            raise Http404

        # 2. fetch featured gates
        featuredgates = FeaturedGateList.as_view(team=team)(request._request)
        response["featured_gates"] = featuredgates.data

        # 3. fetch available gates
        allgates = AllGateList.as_view(team=team)(request._request)
        response["all_gates"] = allgates.data

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
        if self.request.GET.get("title"):
            return TokenGate.objects.filter(
                team=self.team,
                featured=True,
                title__icontains=self.request.GET["title"],
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
        if self.request.GET.get("title"):
            return TokenGate.objects.filter(
                team=self.team,
                featured=False,
                title__icontains=self.request.GET["title"],
            )

        # no querystring
        return TokenGate.objects.filter(team=self.team, featured=False)

#
# TICKET SCANNER API ////////////////////////////////////////////////////////////////////////////////
#
class TicketGateScanner(APIView):
    """
    View for scanning tickets for a ticket-gate
    """
    gate = None

    def validate_credentials(self, request):
        """
        Validates credentials for access into ticket scanner
        """
        scanner_code = request.GET.get("site_code")
        if not scanner_code:
            return Response(status=401)
        try:
            self.gate = TicketGate.objects.get(scanner_code=scanner_code)
            return Response(content='OK', status=200)
        except:
            return Response(status=401)

    def validate_ticket(self, request):
        """
        Validates QR Code data for ticket scanner application
        Uses self.gate provided from validate_credentials
        """
        # setup response
        ticket_count = Ticket.objects.filter(tokengate=self.gate, redeemed=True).count()
        ticket_limit = self.gate.capacity
        response = {
            "count": ticket_count,
            "limit": ticket_limit,
            "message": ""
        }

        # get QR data
        qrdata = request.data.get("qr_code")
        if not qrdata:
            response['message'] = "Invalid QR data"
            return Response(response, status=401)

        # parse ticket data
        try:
            embed_code, filename = qrdata.split("/")
        except ValueError:
            response['message'] = "Invalid ticketdata format"
            return Response(response, status=401)

        # lookup ticketdata
        try:
            scanned_ticket = Ticket.objects.get(embed_code=embed_code, filename=filename, tokengate=self.gate)
        except Ticket.DoesNotExist:
            response['message'] = "Invalid ticketdata content"
            return Response(response, status=401)

        # check ticket is not redeemed
        if scanned_ticket.redeemed:
            response['message'] = "Ticket valid, but already redeemed"
            return Response(response, status=403)

        # check gate capacity if ticket was added (+ 1)
        if (ticket_count + 1) > self.gate.capacity:
            response['message'] = "At capacity"
            return Response(response, status=403)

        # ticket has passed all checks
        # return succesful response and mark ticket as updated
        response['message'] = "OK"
        response["count"] = ticket_count + 1
        scanned_ticket.redeemed=True
        return Response(response, status=200)

    def get(self, request, *args, **kwargs):
        """
        GET method
        Handles validate_credentials check
        """
        return self.validate_credentials(request)

    def post(self, request, *args, **kwargs):
        """
        POST method
        Handles validate_credentials check,
        as well as validate_ticket check
        """
        self.validate_credentials(request)
        return self.validate_ticket()

