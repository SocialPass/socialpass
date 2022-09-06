from django.http import Http404
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.response import Response

from apps.api_checkoutportal import serializers
from apps.root.models import Attendee, Event


class CheckoutMixin:
    """
    Mixin for Checkout Portal flow
    - Dispatch method fetches Event based on event_public_id (always called)
    - get_object sets Event as object (must be manually called outside generic views)
    """

    event = None

    def dispatch(self, request, *args, **kwargs):
        try:
            self.event = Event.objects.get(public_id=self.kwargs["event_public_id"])
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
