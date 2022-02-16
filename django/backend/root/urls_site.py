from django.urls import path
from django.views.generic import TemplateView

from . import views_site



urlpatterns = [
    # General
    path("settings/", TemplateView.as_view(template_name="pages/settings.html"), name="settings"),
    path("contact-us/", TemplateView.as_view(template_name="pages/help.html"), name="contact_us"),

    # Dashboard and user related
    path("", views_site.DashboardView.as_view(), name="dashboard"),
    path("user-detail/", views_site.UserDetailView.as_view(), name="user_detail"),
    path("team-detail/", views_site.TeamDetailView.as_view(), name="team_detail"),
    path("team-update/", views_site.TeamUpdateView.as_view(), name="team_update"),

	# Airdrop token gates
    path("airdropgates/", views_site.AirdropGateListView.as_view(), name="airdropgate_list"),
    path("airdropgates/create/", views_site.AirdropGateCreateView.as_view(), name="airdropgate_create"),
    path("airdropgates/<int:pk>/", views_site.AirdropGateDetailView.as_view(), name="airdropgate_detail"),
    path("airdropgates/<int:pk>/update/", views_site.AirdropGateUpdateView.as_view(), name="airdropgate_update"),

    # Ticket token gates
    path("ticketgates/", views_site.TicketGateListView.as_view(), name="ticketgate_list"),
    path("ticketgates/create/", views_site.TicketGateCreateView.as_view(), name="ticketgate_create"),
    path("ticketgates/<int:pk>/", views_site.TicketGateDetailView.as_view(), name="ticketgate_detail"),
    path("ticketgates/<int:pk>/update/", views_site.TicketGateUpdateView.as_view(), name="ticketgate_update"),
]
