from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.utils.safestring import mark_safe

from apps.root.models import (
    Membership,
    PricingRule,
    PricingRuleGroup,
    RedemptionAccessKey,
    Signature,
    Team,
    Ticket,
    TicketedEvent,
    TicketedEventStripePayment,
)
from apps.services import pricing_service

User = get_user_model()


# Set up admin site titles
admin.site.site_title = "SocialPass Admin"
admin.site.site_header = "SocialPass Admin"
admin.site.index_title = "SocialPass Admin"


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
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Signature)
class SignatureAdmin(admin.ModelAdmin):
    list_display = ("ticketed_event", "unique_code", "wallet_address", "is_verified")
    search_fields = ("ticketed_event__title", "unique_code", "wallet_address")


@admin.register(TicketedEvent)
class TicketedEventAdmin(admin.ModelAdmin):
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


@admin.register(RedemptionAccessKey)
class RedemptionAccessKeyAdmin(admin.ModelAdmin):
    pass


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("ticketed_event", "signature", "image_location")
    search_fields = ("ticketed_event__title", "signature", "image_location")


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
            errors = pricing_service.identify_pricing_group_errors(pricing_group)
            if errors:
                messages.warning(
                    request, list_as_messages_str(errors, pricing_group.name)
                )

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)

        errors = pricing_service.identify_pricing_group_errors(form.instance)
        if errors:
            errors_msg = list_as_messages_str(
                errors, "Recently edited PricingGroup has the following problems:"
            )
            messages.warning(request, errors_msg)

    actions = [identify_pricing_group_errors]


def list_as_messages_str(elements: list, title: str):
    ul_string = f"<div><h3>{title}</h3>\n"
    ul_string += "\n".join(["<div>" + str(s) + "</div>" for s in elements])
    ul_string += "\n</div>"
    return mark_safe(ul_string)


@admin.register(TicketedEventStripePayment)
class TicketedEventStripePaymentAdmin(admin.ModelAdmin):
    list_display = ("ticketed_event", "value", "status")
    search_fields = ("ticketed_event", "value", "status")
