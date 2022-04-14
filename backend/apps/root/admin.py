from urllib.parse import unquote

from pytz import timezone as pytz_timezone

from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.utils import timezone

from .forms import TimeZoneForm
from .models import Membership, Signature, Team, Ticket, TicketGate, TokenGate

User = get_user_model()


# Set up admin site titles
admin.site.site_title = "NFTY Labs Admin"
admin.site.site_header = "NFTY Labs Admin"
admin.site.index_title = "NFTY Labs Admin"


@admin.register(TokenGate)
class TokenGateAdmin(admin.ModelAdmin):
    pass


# Admin registrations
class MembershipInline(admin.TabularInline):
    model = Team.members.through


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ("user", "team")


@admin.register(User)
class UserAdmin(UserAdmin):
    inlines = [
        MembershipInline,
    ]


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    inlines = [
        MembershipInline,
    ]
    exclude = ("members",)
    list_display = ("name", "software_types")
    search_fields = ("name",)


@admin.register(Signature)
class SignatureAdmin(admin.ModelAdmin):
    list_display = ("tokengate", "unique_code", "wallet_address", "is_verified")
    search_fields = ("tokengate__title", "unique_code", "wallet_address")


@admin.register(TicketGate)
class TicketGateAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "public_id",
        "user",
        "team",
        "location",
        "date",
        "timezone"
    )
    search_fields = ("title", "user__username", "team__name", "location")

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("tokengate", "wallet_address", "image")
    search_fields = ("tokengate__title", "wallet_address", "image")
