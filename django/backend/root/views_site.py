from django.http import HttpResponse

from .permissions_site import team_has_software_type_permission


def index(request):
	return HttpResponse("Hello world!")
	

@team_has_software_type_permission("TICKET")
def test_permission(request):
	return HttpResponse("Permission test")