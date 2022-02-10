from django.http import HttpResponse
from django.views import View
from django.utils.decorators import method_decorator

from .permissions_site import team_has_software_type_permission


def index(request):
	return HttpResponse("Hello world!")
	

@team_has_software_type_permission("TICKET")
def test_permission(request):
	return HttpResponse("Permission test")


@method_decorator(team_has_software_type_permission("TICKET"), name="dispatch")
class TestPermission(View):
	def get(self, request):
		return HttpResponse("Permission test")
