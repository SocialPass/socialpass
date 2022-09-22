from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django_fsm_log.admin import StateLogInline

from apps.root.forms import InviteAdminAddForm, InviteAdminChangeForm
from apps.root.models import (
    BlockchainOwnership,
    Event,
    Invite,
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


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    def transition_to_draft(modeladmin, request, queryset):
        for i in queryset:
            i.transition_draft()
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


@admin.register(Invite)
class InviteAdmin(admin.ModelAdmin):
    list_display = ("email", "sent", "accepted")
    raw_id_fields = ("inviter",)

    def get_form(self, request, obj=None, **kwargs):
        if obj:
            kwargs["form"] = InviteAdminChangeForm
        else:
            kwargs["form"] = InviteAdminAddForm
            kwargs["form"].user = request.user
            kwargs["form"].request = request
        return super().get_form(request, obj, **kwargs)
