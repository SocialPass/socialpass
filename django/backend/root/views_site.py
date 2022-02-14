from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.utils.decorators import method_decorator

from .models import AirdropGate
from .permissions_site import team_has_software_type_permission


@method_decorator(team_has_software_type_permission("AIRDROP"), name="dispatch")
class AirdropGateListView(ListView):
	"""
	Returns a list of Airdrop token gates.
	"""
	model = AirdropGate
	paginate_by = 15
	context_object_name = "tokengates"

	def get_queryset(self):
		qs = AirdropGate.objects.filter(team=self.request.user.team)
		qs = qs.order_by("-updated_at")

		query_title = self.request.GET.get("title", "")
		if query_title:
			qs = qs.filter(title__icontains=query_title)

		return qs


@method_decorator(team_has_software_type_permission("AIRDROP"), name="dispatch")
class AirdropGateDetailView(DetailView):
	"""
	Returns a list of Airdrop token gates.
	"""
	model = AirdropGate
	context_object_name = "tokengate"

	def get_queryset(self):
		qs = AirdropGate.objects.filter(team=self.request.user.team)
		return qs
