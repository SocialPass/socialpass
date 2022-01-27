from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import AirdropGate
from .permissions import IsOwner
from .serializers import AirdropGateSerializer


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
