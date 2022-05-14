from django.contrib import admin
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.utils.safestring import mark_safe

from apps.root import pricing_service
from apps.root.models import (
    Membership, Signature, Team, Ticket, TicketGate, TokenGate,
    PricingRule, PricingRuleGroup
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


@admin.register(TicketGate)
class TicketGateAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "public_id",
        "user",
        "team",
        "location",
        "date",
        "timezone",
    )
    search_fields = ("title", "user__username", "team__name", "location")


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("tokengate", "wallet_address", "image")
    search_fields = ("tokengate__title", "wallet_address", "image")


@admin.register(PricingRule)
class PricingRuleAdmin(admin.ModelAdmin):
    pass


class PricingRuleInline(admin.TabularInline):
    model = PricingRule
    extra = 0


@admin.register(PricingRuleGroup)
class PricingRuleGroupAdmin(admin.ModelAdmin):
    inlines = [PricingRuleInline]

    def identify_pricing_group_errors(self, request, queryset):
        for pricing_group in queryset:
            errors = pricing_service.identify_pricing_group_errors(
                pricing_group
            )
            if errors:
                messages.warning(
                    request, list_as_messages_str(errors, pricing_group.name)
                )

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)

        errors = pricing_service.identify_pricing_group_errors(form.instance)
        if errors:
            errors_msg = list_as_messages_str(
                errors,
                "Recently edited PricingGroup has the following problems:"
            )
            messages.warning(request, errors_msg)

    actions = [identify_pricing_group_errors]


def list_as_messages_str(elements: list, title: str):
    ul_string = f"<div><h3>{title}</h3>\n"
    ul_string += "\n".join(["<div>" + str(s) + "</div>" for s in elements])
    ul_string += "\n</div>"
    return mark_safe(ul_string)
