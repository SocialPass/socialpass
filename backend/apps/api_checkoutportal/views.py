from django.http import Http404
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.response import Response

from apps.api_checkoutportal import serializers
from apps.root.models import Attendee, Event


class CheckoutMixin:
    """
    Mixin for Checkout Portal flow
    - Dispatch method fetches Event based on public_id (always called)
    - get_object sets Event as object (must be manually called outside generic views)
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
    Key actions:
    - Overrides get_object to use self.event from CheckoutMixin
    """

    serializer_class = serializers.CheckoutPortalRetrieve
    input_serializer = None
    output_serializer = serializer_class

    @swagger_auto_schema(
        request_body=input_serializer, responses={200: output_serializer}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_object(self, *args, **kwargs):
        return self.event


class CheckoutPortalOwnershipRequest(CheckoutMixin, GenericAPIView):
    """
    PUT view for requesting Event entry based on asset ownership
    Key actions:
    - Get or create UNVERIFIED 'Attendee' based upon wallet address.
    - Generate / return OTP message for verifying 'Attendee'
    """

    serializer_class = serializers.CheckoutPortalOwnershipRequest
    input_serializer = serializer_class
    output_serializer = serializer_class

    @swagger_auto_schema(
        request_body=input_serializer, responses={200: output_serializer}
    )
    def put(self, request, *args, **kwargs):
        # 1. serialize input data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serialized_data = serializer.validated_data

        # 2. get or create UNVERIFIED Attendee entry based upon wallet address.
        attendee, created = Attendee.objects.get_or_create(
            event=self.event, wallet_address=serialized_data["wallet_address"]
        )

        # 3. return attendee OTP message
        otp_message = attendee.generate_otp_message()
        return Response(otp_message)


class CheckoutPortalOwnershipVerify(CheckoutMixin, GenericAPIView):
    """
    POST view for verifying Event entry based on asset ownership
    Key actions:
    - Is attendee a verified wallet address? (401)
    - Has attendee met limit per person? (403)
    - Is ticket selection valid (403)
    - Does attendee meet ownership criteria? (403)
    """

    serializer_class = serializers.CheckoutPortalOwnershipVerify
    input_serializer = serializer_class
    output_serializer = serializer_class

    @swagger_auto_schema(
        request_body=input_serializer, responses={200: output_serializer}
    )
    def post(self, request, *args, **kwargs):
        # 1. serialize input data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serialized_data = serializer.validated_data
        print(serialized_data)
        return Response("OK")

        # 2. verify wallet address signature (proves identity of address)
        # 3. has attendee met limit per person?
        # 4. Verify ticket selection
        # 5. Does attendee meet ownership criteria? (403)


class CheckoutPortalConfirmation(CheckoutMixin, GenericAPIView):
    """
    GET/POST view for checkout portal confirmation
    On GET, this view will return the confirmation page with accompanying PDF ticket.
    On POST, this view will offload tasks to celery for ticket creation and SMTP delivery.
    """

    pass
