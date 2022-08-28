from django.http import Http404
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api_checkoutportal import serializers, services
from apps.root.models import Event


class CheckoutMixin:
    """
    Mixin for checkoutportal flow
    Dipsatch method fetches event based on public_id
    """

    event = None

    def dispatch(self, request, *args, **kwargs):
        try:
            self.event = Event.objects.get(public_id=self.kwargs["public_id"])
        except:
            raise Http404
        return super().dispatch(request, *args, **kwargs)


class CheckoutPortalRetrieve(CheckoutMixin, RetrieveAPIView):
    """
    GET view for retrieving Event
    Overrides get_object to use self.event from CheckoutMixin
    """

    serializer_class = serializers.EventSerializer

    def get_object(self, *args, **kwargs):
        return self.event


class CheckoutPortalOwnershipRequest(CheckoutMixin, APIView):
    """
    POST view for requesting Event entry based on asset ownership
    - Get or Create Attendee based on wallet address (unverified)
    - Return record for verifying attendee (message to be signed)
    """

    def post(self, request, *args, **kwargs):
        return


class CheckoutPortalOwnershipVerify(CheckoutMixin, APIView):
    """
    POST view for verifying Event entry based on asset ownership
    Key Checks:
    - Is attendee a verified wallet address? (401)
    - Is ticket selection valid (403)
    - Has attendee met limit per person? (403)
    - Does attendee meet ownership criteria? (403)
    """

    def post(self, request, *args, **kwargs):
        return


class CheckoutPortalConfirmation(CheckoutMixin, APIView):
    """
    GET/POST view for checckout portal confirmation
    On GET, this view will return the confirmation page with accompanying PDF ticket.
    On POST, this view will offload tasks to celery for ticket creation and SMTP delivery.
    """

    def get(self, request, *args, **kwargs):
        return

    def post(self, request, *args, **kwargs):
        return
