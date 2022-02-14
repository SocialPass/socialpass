from django.urls import path
from django.views.generic import TemplateView

from . import views_site



urlpatterns = [
    # General
    path("", TemplateView.as_view(template_name="pages/home.html"), name="index"),
    path("settings/", TemplateView.as_view(template_name="pages/settings.html"), name="settings"
    ),
    path("contact-us/", TemplateView.as_view(template_name="pages/help.html"), name="contact_us"
    ),
	# Airdrop token gates
    path("airdropgates/", views_site.AirdropGateListView.as_view(), name="airdropgate_list"),
    path("airdropgates/create/", views_site.AirdropGateCreateView.as_view(), name="airdropgate_create"),
    path("airdropgates/<int:pk>/", views_site.AirdropGateDetailView.as_view(), name="airdropgate_detail"),
]
