from django.urls import path
from django.views.generic import TemplateView

from . import site_views



urlpatterns = [
    # General
    path("", site_views.DashboardView.as_view(), name="dashboard"),
    path("settings/", TemplateView.as_view(template_name="pages/settings.html"), name="settings"),
    path("contact-us/", TemplateView.as_view(template_name="pages/help.html"), name="contact_us"),
    # User
    path("user-detail/", site_views.UserDetailView.as_view(), name="user_detail"),
    # Team
    path("<str:team>/team-detail/", site_views.TeamDetailView.as_view(), name="team_detail"),
    path("<str:team>/team-update/", site_views.TeamUpdateView.as_view(), name="team_update"),
	# Airdrop token gates
    path("<int:team_pk>/airdropgates/", site_views.AirdropGateListView.as_view(), name="airdropgate_list"),
    path("<int:team_pk>/airdropgates/create/", site_views.AirdropGateCreateView.as_view(), name="airdropgate_create"),
    path("<int:team_pk>/airdropgates/<int:pk>/", site_views.AirdropGateDetailView.as_view(), name="airdropgate_detail"),
    path("<int:team_pk>/airdropgates/<int:pk>/update/", site_views.AirdropGateUpdateView.as_view(), name="airdropgate_update"),
    # Ticket token gates
    path("<int:team_pk>/ticketgates/", site_views.TicketGateListView.as_view(), name="ticketgate_list"),
    path("<int:team_pk>/ticketgates/create/", site_views.TicketGateCreateView.as_view(), name="ticketgate_create"),
    path("<int:team_pk>/ticketgates/<int:pk>/", site_views.TicketGateDetailView.as_view(), name="ticketgate_detail"),
    path("<int:team_pk>/ticketgates/<int:pk>/update/", site_views.TicketGateUpdateView.as_view(), name="ticketgate_update"),
]
