from django.shortcuts import redirect
from .models import Membership


def member_has_permissions(software_type):
    """
    Check if the user has a membership to the team designated by 'team_pk',
    as well as if the team has access to the software designated by 'software_type'.
    """
    def _method_wrapper(view_method):
        def _arguments_wrapper(request, *args, **kwargs):
            has_permission = False

            # redirect to login if anon
            if request.user.is_anonymous:
                return redirect("account_login")

            # check user has membership to team
            try:
                membership = Membership.objects.select_related('team').get(team__id=kwargs['team_pk'], user__id=request.user.id)
                # if software_type is blank, then we are only concerned with above membership
                if software_type == '':
                    has_permission = True
                # check team has access to software
                elif software_type in membership.team.software_types:
                    has_permission = True
            except Membership.DoesNotExist:
                has_permission = False

            if has_permission:
                return view_method(request, *args, **kwargs)
            else:
                return redirect("dashboard")

        return _arguments_wrapper

    return _method_wrapper
