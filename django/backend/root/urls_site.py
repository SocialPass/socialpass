from django.urls import path

from . import views_site


urlpatterns = [
	# Airdrop token gates
    path("airdropgates/", views_site.AirdropGateListView.as_view(), name="airdropgate_list"),
    path("airdropgates/<int:pk>/", views_site.AirdropGateDetailView.as_view(), name="airdropgate_detail"),
]
