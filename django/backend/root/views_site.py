from django.contrib import messages
from django.shortcuts import reverse
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView
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
	Returns the details of an Airdrop token gate.
	"""
	model = AirdropGate
	context_object_name = "tokengate"

	def get_queryset(self):
		qs = AirdropGate.objects.filter(team=self.request.user.team)
		return qs


@method_decorator(team_has_software_type_permission("AIRDROP"), name="dispatch")
class AirdropGateCreateView(CreateView):
	"""
	Creates a new Airdrop token gate.
	"""
	model = AirdropGate
	fields = [
		"title", "description", "chain", "asset_type", "asset_address", 
		"amount_per_person", "total_amount", "start_date", "end_date", 
		"requirements"
	]

	def form_valid(self, form):
		form.instance.user = self.request.user
		form.instance.general_type = "AIRDROP"
		return super().form_valid(form)

	def get_success_url(self):
		messages.add_message(
			self.request, messages.SUCCESS, "Token gate created successfully."
		)
		return reverse("airdropgate_list")
