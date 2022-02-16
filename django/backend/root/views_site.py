from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import reverse
from django.views.generic import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, FormView, UpdateView
from django.views.generic.list import ListView
from django.utils.decorators import method_decorator

from .forms import TeamForm
from .models import AirdropGate, TicketGate
from .permissions_site import team_has_software_type_permission


# Dashboard and user related

@method_decorator(login_required, name="dispatch")
class DashboardView(TemplateView):
	"""
	Main dashboard page.
	"""
	template_name = "root/dashboard.html"


@method_decorator(login_required, name="dispatch")
class UserDetailView(TemplateView):
	"""
	Returns the details of the logged in user.
	"""
	template_name = "root/user_detail.html"


@method_decorator(login_required, name="dispatch")
class TeamDetailView(TemplateView):
	"""
	Returns the details of the logged in user's team.
	"""
	template_name = "root/team_detail.html"


@method_decorator(login_required, name="dispatch")
class TeamUpdateView(FormView):
	"""
	Updates the user's team.
	"""
	form_class = TeamForm
	template_name = "root/team_form.html"

	def get_form(self, form_class=None):
		if form_class is None:
			form_class = self.get_form_class()

		if self.request.user.team:
			return self.form_class(instance=self.request.user.team, **self.get_form_kwargs())
		else:
			raise Http404

	def form_valid(self, form):
		form.save()
		return super(TeamUpdateView, self).form_valid(form)

	def get_success_url(self):
		messages.add_message(
			self.request, messages.SUCCESS, "Team information updated successfully."
		)
		return reverse("team_detail")


# Airdrop token gates

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


@method_decorator(team_has_software_type_permission("AIRDROP"), name="dispatch")
class AirdropGateUpdateView(UpdateView):
	"""
	Updates an Airdrop token gate.
	"""
	model = AirdropGate
	fields = [
		"title", "description", "chain", "asset_type", "asset_address", 
		"amount_per_person", "total_amount", "start_date", "end_date", 
		"requirements"
	]

	def get_queryset(self):
		qs = AirdropGate.objects.filter(team=self.request.user.team)
		return qs

	def get_success_url(self):
		messages.add_message(
			self.request, messages.SUCCESS, "Token gate updated successfully."
		)
		return reverse("airdropgate_detail", args=(self.object.pk,))


# Ticket token gates

@method_decorator(team_has_software_type_permission("TICKET"), name="dispatch")
class TicketGateListView(ListView):
	"""
	Returns a list of Ticket token gates.
	"""
	model = TicketGate
	paginate_by = 15
	context_object_name = "tokengates"

	def get_queryset(self):
		qs = TicketGate.objects.filter(team=self.request.user.team)
		qs = qs.order_by("-updated_at")

		query_title = self.request.GET.get("title", "")
		if query_title:
			qs = qs.filter(title__icontains=query_title)

		return qs


@method_decorator(team_has_software_type_permission("TICKET"), name="dispatch")
class TicketGateDetailView(DetailView):
	"""
	Returns the details of an Ticket token gate.
	"""
	model = TicketGate
	context_object_name = "tokengate"

	def get_queryset(self):
		qs = TicketGate.objects.filter(team=self.request.user.team)
		return qs


@method_decorator(team_has_software_type_permission("TICKET"), name="dispatch")
class TicketGateCreateView(CreateView):
	"""
	Creates a new Ticket token gate.
	"""
	model = TicketGate
	fields = [
		"title", "description", "date", "location", "capacity", "deadline", 
		"requirements"
	]

	def form_valid(self, form):
		form.instance.user = self.request.user
		form.instance.general_type = "TICKET"
		return super().form_valid(form)

	def get_success_url(self):
		messages.add_message(
			self.request, messages.SUCCESS, "Token gate created successfully."
		)
		return reverse("ticketgate_list")


@method_decorator(team_has_software_type_permission("TICKET"), name="dispatch")
class TicketGateUpdateView(UpdateView):
	"""
	Updates an Ticket token gate.
	"""
	model = TicketGate
	fields = [
		"title", "description", "date", "location", "capacity", "deadline", 
		"requirements"
	]

	def get_queryset(self):
		qs = TicketGate.objects.filter(team=self.request.user.team)
		return qs

	def get_success_url(self):
		messages.add_message(
			self.request, messages.SUCCESS, "Token gate updated successfully."
		)
		return reverse("ticketgate_detail", args=(self.object.pk,))
