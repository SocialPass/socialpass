from rest_framework import permissions

from .models import TokenGate


class IsOwner(permissions.BasePermission):
	"""
	Object-level permission to only allow owners of an object to edit it.
	"""
	def has_object_permission(self, request, view, obj):
		return obj.user == request.user


class IsTokenGateOwner(permissions.BasePermission):
	"""
	Parent-level permission to only allow owners of an object's parent token 
	gate to edit it.
	"""
	def has_object_permission(self, request, view, obj):
		try:
			tokengate = TokenGate.objects.get(
				id=view.kwargs.get("tokengate_id")
			)
		except Exception as e:
			return False

		return tokengate.user == request.user
