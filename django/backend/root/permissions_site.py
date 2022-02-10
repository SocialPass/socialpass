from django.shortcuts import redirect


def team_has_software_type_permission(software_type):
    """
    Check if the user is part of a team that has the specific software type 
    permission.
    """

    def _method_wrapper(view_method):
        def _arguments_wrapper(request, *args, **kwargs):
            has_permission = False

            if not request.user.is_anonymous:
                if request.user.team:
                    if software_type in request.user.team.software_types:
                        has_permission = True

            if has_permission:
                return view_method(request, *args, **kwargs)
            else:
                return redirect("index")

        return _arguments_wrapper

    return _method_wrapper
