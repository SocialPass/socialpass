from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.utils.safestring import mark_safe
from django_fsm_log.admin import StateLogInline

from apps.dashboard import services
from apps.root.models import (
    BlockchainOwnership,
    Event,
    EventCategory,
    EventStripePayment,
    Membership,
    PricingRule,
    PricingRuleGroup,
    Team,
    Ticket,
    TicketRedemptionKey,
)

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
class CustomUserAdmin(UserAdmin):
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


@admin.register(BlockchainOwnership)
class BlockchainOwnershipAdmin(admin.ModelAdmin):
    list_display = ("event", "id", "wallet_address", "is_verified")
    search_fields = ("event__title", "id", "wallet_address")


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    def transition_to_draft(modeladmin, request, queryset):
        for i in queryset:
            i.transition_draft()
        messages.success(request, "Event(s) have been transitioned live")

    def transition_to_pending_checkout(modeladmin, request, queryset):
        for i in queryset:
            i.transition_pending_checkout()
        messages.success(request, "Event(s) have been transitioned live")

    def transition_to_live(modeladmin, request, queryset):
        for i in queryset:
            i.transition_live()
        messages.success(request, "Event(s) have been transitioned live")

    list_display = (
        "title",
        "public_id",
        "user",
        "team",
        "start_date",
    )
    search_fields = (
        "title",
        "user__username",
        "team__name",
    )
    inlines = [StateLogInline]
    readonly_fields = ["state"]
    actions = [transition_to_draft, transition_to_pending_checkout, transition_to_live]


@admin.register(TicketRedemptionKey)
class TicketRedemptionKeyAdmin(admin.ModelAdmin):
    list_display = ("public_id",)
    pass


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("event", "blockchain_ownership", "full_embed")
    search_fields = (
        "event__title",
        "blockchain_ownership",
    )


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
            errors = services.identify_pricing_group_errors(pricing_group)
            if errors:
                messages.warning(
                    request, list_as_messages_str(errors, pricing_group.name)
                )

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)

        errors = services.identify_pricing_group_errors(form.instance)
        if errors:
            errors_msg = list_as_messages_str(
                errors, "Recently edited PricingGroup has the following problems:"
            )
            messages.warning(request, errors_msg)

    actions = [identify_pricing_group_errors]  # type: ignore


def list_as_messages_str(elements: list, title: str):
    ul_string = f"<div><h3>{title}</h3>\n"
    ul_string += "\n".join(["<div>" + str(s) + "</div>" for s in elements])
    ul_string += "\n</div>"
    return mark_safe(ul_string)


@admin.register(EventStripePayment)
class EventStripePaymentAdmin(admin.ModelAdmin):
    list_display = ("event", "value", "status")
    search_fields = ("event", "value", "status")
