from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django_fsm_log.admin import StateLogInline

from apps.root.models import (
    BlockchainOwnership,
    Event,
    EventCategory,
    Membership,
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
    actions = [
        transition_to_draft,  # type: ignore
        transition_to_pending_checkout,  # type: ignore
        transition_to_live,  # type: ignore
    ]


@admin.register(TicketRedemptionKey)
class TicketRedemptionKeyAdmin(admin.ModelAdmin):
    list_display = ("public_id",)


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("event", "blockchain_ownership", "full_embed")
    search_fields = (
        "event__title",
        "blockchain_ownership",
    )
