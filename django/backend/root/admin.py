from pytz import timezone as pytz_timezone
from urllib.parse import unquote
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.utils import timezone

from .forms import TimeZoneForm
from .models import (
    Airdrop,
    AirdropGate,
    Membership,
    Signature,
    Team,
    Ticket,
    TicketGate,
    TokenGate,
)

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


@admin.register(AirdropGate)
class AirdropGateAdmin(admin.ModelAdmin):
    list_display = ("title", "public_id", "chain", "asset_type", "user", "team")
    search_fields = ("title", "chain", "asset_type", "user__username", "team__name")


@admin.register(Airdrop)
class AirdropAdmin(admin.ModelAdmin):
    list_display = ("tokengate", "wallet_address")
    search_fields = ("tokengate__title", "wallet_address")


@admin.register(TicketGate)
class TicketGateAdmin(admin.ModelAdmin):
    list_display = ("title", "public_id", "user", "team", "location", "event_datetime_in_timezone")
    search_fields = ("title", "user__username", "team__name", "location")

    def event_datetime_in_timezone(self, gate):
        """
        Display each gate time on the changelist in its own timezone
        """
        fmt = '%Y-%m-%d %I:%M:%p %Z'
        dt = gate.date.astimezone(pytz_timezone(gate.timezone))
        return dt.strftime(fmt)
    event_datetime_in_timezone.short_description = 'Event time'

    def add_view(self, request, form_url='', extra_context=None):
        """
        Override add view so we can peek at the timezone they've entered and
        set the current time zone accordingly before the form is processed
        """
        if request.method == 'POST':
            tz_form = TimeZoneForm(request.POST)
            if tz_form.is_valid():
                timezone.activate(tz_form.cleaned_data['timezone'])
        return super(EventAdmin, self).add_view(request, form_url, extra_context)

    def change_view(self, request, object_id, form_url='', extra_context=None):
        """
        Override change view so we can peek at the timezone they've entered and
        set the current time zone accordingly before the form is processed
        """
        if request.method == 'POST':
            tz_form = TimeZoneForm(request.POST)
            if tz_form.is_valid():
                timezone.activate(tz_form.cleaned_data['timezone'])
        else:
            obj = self.get_object(request, unquote(object_id))
            timezone.activate(obj.timezone)
        return super(TicketGateAdmin, self).change_view(request, object_id, form_url, extra_context)

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("tokengate", "wallet_address", "download_url")
    search_fields = ("tokengate__title", "wallet_address", "download_url")
