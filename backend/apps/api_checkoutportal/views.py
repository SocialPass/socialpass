from django.http import Http404
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.generics import GenericAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.response import Response

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
        except Exception:
            raise Http404
        return super().dispatch(request, *args, **kwargs)


class CheckoutPortalRetrieve(CheckoutMixin, RetrieveAPIView):
    """
    GET view for retrieving Event
    Overrides get_object to use self.event from CheckoutMixin
    """

    input_serializer = None
    output_serializer = serializers.EventSerializer
    serializer_class = output_serializer

    def get_object(self, *args, **kwargs):
        return self.event

    @swagger_auto_schema(
        responses={200: output_serializer},
        request_body=input_serializer,
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class CheckoutPortalOwnershipRequest(CheckoutMixin, GenericAPIView):
    """
    POST view for requesting Event entry based on asset ownership
    - Get or Create Attendee based on wallet address (unverified)
    - Return record for verifying attendee (message to be signed)
    """

    serializer_class = serializers.AttendeeSerializer


class CheckoutPortalOwnershipVerify(CheckoutMixin, GenericAPIView):
    """
    POST view for verifying Event entry based on asset ownership
    Key Checks:
    - Is attendee a verified wallet address? (401)
    - Is ticket selection valid (403)
    - Has attendee met limit per person? (403)
    - Does attendee meet ownership criteria? (403)
    """

    pass


class CheckoutPortalConfirmation(CheckoutMixin, GenericAPIView):
    """
    GET/POST view for checkout portal confirmation
    On GET, this view will return the confirmation page with accompanying PDF ticket.
    On POST, this view will offload tasks to celery for ticket creation and SMTP delivery.
    """

    pass
