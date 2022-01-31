from rest_framework import serializers

from .models import AirdropGate, AirdropList, TicketGate


class AirdropGateSerializer(serializers.ModelSerializer):
	"""
	Serializes Airdrop token gates.
	"""
	class Meta:
		model = AirdropGate
		fields = "__all__"
		read_only_fields = ["created_at", "updated_at", "user", "general_type"]

	def create(self, validated_data):
		# Create the token gate
		airdropgate = AirdropGate.objects.create(
			user=self.context["request"].user, general_type="AIRDROP", 
			**validated_data
		)
		return airdropgate


class AirdropListSerializer(serializers.ModelSerializer):
	"""
	Serializes airdrops.
	"""
	class Meta:
		model = AirdropList
		fields = "__all__"
		read_only_fields = ["created_at", "updated_at", "tokengate"]

	def create(self, validated_data):
		# Create the airdrop list
		view_kwargs = self.context["request"].parser_context["kwargs"]
		tokengate_id = view_kwargs["tokengate_id"]
		airdroplist = AirdropList.objects.create(
			tokengate_id=tokengate_id, **validated_data
		)
		return airdroplist


class TicketGateSerializer(serializers.ModelSerializer):
	"""
	Serializes Ticket token gates.
	"""
	class Meta:
		model = TicketGate
		fields = "__all__"
		read_only_fields = ["created_at", "updated_at", "user", "general_type"]

	def create(self, validated_data):
		# Create the token gate
		ticketgate = TicketGate.objects.create(
			user=self.context["request"].user, general_type="TICKET", 
			**validated_data
		)
		return ticketgate
