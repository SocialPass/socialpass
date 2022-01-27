from rest_framework import viewsets

from .models import AirdropGate
from .serializers import AirdropGateSerializer


class AirdropGateViewSet(viewsets.ModelViewSet):
	"""
	A viewset for viewing and editing Airdrop token gates.
	"""
	serializer_class = AirdropGateSerializer
	queryset = AirdropGate.objects.all()
	