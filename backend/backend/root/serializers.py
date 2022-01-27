from rest_framework import serializers

from .models import AirdropGate, Requirement, TicketGate


class RequirementSerializer(serializers.ModelSerializer):
	class Meta:
		model = Requirement
		fields = "__all__"


class AirdropGateSerializer(serializers.ModelSerializer):
	requirements = RequirementSerializer(many=True)

	class Meta:
		model = AirdropGate
		fields = "__all__"

	def create(self, validated_data):
		requirements_data = validated_data.pop("requirements")
		airdropgate = AirdropGate.objects.create(**validated_data)
		for requirement_data in requirements_data:
			Requirement.objects.create(
				tokengate=airdropgate, **requirement_data
			)
		return airdropgate
		