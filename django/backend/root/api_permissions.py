from rest_framework import permissions

from .models import TokenGate


class IsTeamMember(permissions.BasePermission):
    """
    Object-level permission to only allow team members to edit the token gate.
    """

    def has_object_permission(self, request, view, obj):
        return obj.team == request.user.team


class IsTokenGateTeamMember(permissions.BasePermission):
    """
    Parent-level permission to only allow team members of an object's parent
    token gate to edit it.
    """

    def has_object_permission(self, request, view, obj):
        try:
            tokengate = TokenGate.objects.select_related("user").get(
                id=view.kwargs.get("tokengate_id")
            )
        except Exception:
            return False

        return tokengate.team == request.user.team
