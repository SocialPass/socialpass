from rest_framework import serializers

from .models import AirdropGate, TicketGate


class AirdropGateSerializer(serializers.ModelSerializer):
	"""
	Serializes Airdrop token gates.
	"""
	class Meta:
		model = AirdropGate
		fields = "__all__"
		read_only_fields = ["user", "general_type"]

	def create(self, validated_data):
		# Create the token gate
		airdropgate = AirdropGate.objects.create(
			user=self.context["request"].user, general_type="AIRDROP", 
			**validated_data
		)
		return airdropgate
