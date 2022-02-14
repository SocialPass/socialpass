from django.urls import path

from . import views_site


urlpatterns = [
	# Airdrop token gates
    path("airdropgates/", views_site.AirdropGateListView.as_view(), name="airdropgate_list"),
    path("airdropgates/create/", views_site.AirdropGateCreateView.as_view(), name="airdropgate_create"),
    path("airdropgates/<int:pk>/", views_site.AirdropGateDetailView.as_view(), name="airdropgate_detail"),
    path("airdropgates/<int:pk>/update/", views_site.AirdropGateUpdateView.as_view(), name="airdropgate_update"),
]
