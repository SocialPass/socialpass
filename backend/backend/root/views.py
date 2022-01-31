from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import AirdropGate, AirdropList, TicketGate
from .permissions import IsOwner, IsTokenGateOwner
from .serializers import (
	AirdropGateSerializer, AirdropListSerializer, TicketGateSerializer
)


class AirdropGateViewSet(viewsets.ModelViewSet):
	"""
	A viewset for viewing and editing Airdrop token gates.
	"""
	serializer_class = AirdropGateSerializer
	queryset = AirdropGate.objects.all()

	def get_permissions(self):
		"""
		Instantiates and returns the list of permissions that this view 
		requires.
		"""
		if self.action == "list" or self.action == "retrieve":
			permission_classes = [AllowAny]
		elif self.action == "create":
			permission_classes = [IsAuthenticated]
		else:
			permission_classes = [IsOwner]
		return [permission() for permission in permission_classes]


class AirdropListViewSet(viewsets.ReadOnlyModelViewSet):
	"""
	A viewset for viewing airdrop lists.
	"""
	serializer_class = AirdropListSerializer
	permission_classes = [IsTokenGateOwner]

	def get_queryset(self):
		"""
		Return the required queryset.
		"""
		return AirdropList.objects.filter(
			tokengate__id=self.kwargs["tokengate_id"]
		)


class TicketGateViewSet(viewsets.ModelViewSet):
	"""
	A viewset for viewing and editing Ticket token gates.
	"""
	serializer_class = TicketGateSerializer
	queryset = TicketGate.objects.all()

	def get_permissions(self):
		"""
		Instantiates and returns the list of permissions that this view 
		requires.
		"""
		if self.action == "list" or self.action == "retrieve":
			permission_classes = [AllowAny]
		elif self.action == "create":
			permission_classes = [IsAuthenticated]
		else:
			permission_classes = [IsOwner]
		return [permission() for permission in permission_classes]
