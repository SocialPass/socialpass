from django.contrib import admin
from django.contrib.auth import get_user_model

from .models import AirdropGate, AirdropList, Requirement


User = get_user_model()


# Set up admin site titles

admin.site.site_title = "NFTY Labs Admin"
admin.site.site_header = "NFTY Labs Admin"
admin.site.index_title = "NFTY Labs Admin"


# Admin registrations

@admin.register(Requirement)
class RequirementAdmin(admin.ModelAdmin):
	list_display = ("tokengate", "chain", "asset_type")
	search_fields = ("tokengate__title", "chain", "asset_type")


@admin.register(AirdropGate)
class AirdropGateAdmin(admin.ModelAdmin):
	list_display = ("title", "chain", "asset_type", "user")
	search_fields = ("title", "chain", "asset_type", "user__username")


@admin.register(AirdropList)
class AirdropListAdmin(admin.ModelAdmin):
	list_display = ("airdropgate", "wallet_address")
	search_fields = ("airdropgate__title", "wallet_address")


