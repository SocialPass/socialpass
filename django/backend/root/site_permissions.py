from django.shortcuts import redirect
from .models import Membership


def member_has_permissions(software_type):
    """
    Check if the user is part of a team that has the specific software type
    permission.
    """

    def _method_wrapper(view_method):
        def _arguments_wrapper(request, *args, **kwargs):
            has_permission = False
            # redirect to login if anon
            if request.user.is_anonymous:
                return redirect("account_login")

            # check user has membership to team
            try:
                membership = Membership.objects.get(team__id=kwargs['team_pk'], user__id=request.user.id)

                # todo: check membership has access to view

                # check team has access to software
                if software_type in membership.team.software_types:
                    has_permission = True
            except Membership.DoesNotExist:
                has_permission = False

            if has_permission:
                return view_method(request, *args, **kwargs)
            else:
                return redirect("dashboard")

        return _arguments_wrapper

    return _method_wrapper
