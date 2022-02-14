from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .models import (
    AirdropGate,
    AirdropList,
    Signature,
    Team,
    TicketGate,
    TicketList
)

User = get_user_model()


# Set up admin site titles

admin.site.site_title = "NFTY Labs Admin"
admin.site.site_header = "NFTY Labs Admin"
admin.site.index_title = "NFTY Labs Admin"


# Admin registrations

@admin.register(User)
class UserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Team", {
            "fields": ("team",),
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Team", {
            "fields": ("team",),
        }),
    )


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("name", "software_types")
    search_fields = ("name",)


@admin.register(Signature)
class SignatureAdmin(admin.ModelAdmin):
    list_display = ("tokengate", "unique_code", "wallet_address", "is_verified")
    search_fields = ("tokengate__title", "unique_code", "wallet_address")


@admin.register(AirdropGate)
class AirdropGateAdmin(admin.ModelAdmin):
    list_display = ("title", "chain", "asset_type", "user", "team")
    search_fields = ("title", "chain", "asset_type", "user__username", "team__name")


@admin.register(AirdropList)
class AirdropListAdmin(admin.ModelAdmin):
    list_display = ("tokengate", "wallet_address")
    search_fields = ("tokengate__title", "wallet_address")


@admin.register(TicketGate)
class TicketGateAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "team", "date", "location")
    search_fields = ("title", "user__username", "team__name", "location")


@admin.register(TicketList)
class TicketListAdmin(admin.ModelAdmin):
    list_display = ("tokengate", "wallet_address", "ticket_url")
    search_fields = ("tokengate__title", "wallet_address", "ticket_url")
