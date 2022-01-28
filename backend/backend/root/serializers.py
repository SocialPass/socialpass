from rest_framework import serializers

from .models import AirdropGate, Requirement, TicketGate


class RequirementSerializer(serializers.ModelSerializer):
	"""
	Serializes requirements.
	"""
	class Meta:
		model = Requirement
		fields = "__all__"
		read_only_fields = ["tokengate"]


class AirdropGateSerializer(serializers.ModelSerializer):
	"""
	Serializes Airdrop token gates.
	"""
	requirements = RequirementSerializer(many=True, required=False)

	class Meta:
		model = AirdropGate
		fields = "__all__"
		read_only_fields = ["user", "general_type"]

	def create(self, validated_data):
		requirements_data = validated_data.pop("requirements", [])
		if not requirements_data:
			raise serializers.ValidationError({
				"detail": "Please set the requirements."
			})

		# Create the token gate
		airdropgate = AirdropGate.objects.create(
			user=self.context["request"].user, general_type="AIRDROP", 
			**validated_data
		)

		# Create the requirements
		for requirement_data in requirements_data:
			Requirement.objects.create(
				tokengate=airdropgate, **requirement_data
			)

		return airdropgate

	def update(self, instance, validated_data):
		requirements_data = validated_data.pop("requirements", [])
		is_new_requirements = False
		if requirements_data:
			is_new_requirements = True
		
		# Update the instance (only applicable fields)
		instance.title = validated_data.get("title", instance.title)
		instance.description = validated_data.get("description", instance.description)
		instance.chain = validated_data.get("chain", instance.chain)
		instance.asset_type = validated_data.get("asset_type", instance.asset_type)
		instance.asset_address = validated_data.get("asset_address", instance.asset_address)
		instance.amount_per_person = validated_data.get("amount_per_person", instance.amount_per_person)
		instance.total_amount = validated_data.get("total_amount", instance.total_amount)
		instance.start_date = validated_data.get("start_date", instance.start_date)
		instance.end_date = validated_data.get("end_date", instance.end_date)

		instance.save()

		# Delete old and create new requirements (if applicable)
		if is_new_requirements:
			for requirement in instance.requirements.all():
				requirement.delete()
			for requirement_data in requirements_data:
				Requirement.objects.create(
					tokengate=instance, **requirement_data
				)

		return instance
