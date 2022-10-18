from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django_fsm_log.admin import StateLogInline

from apps.root.forms import InviteAdminAddForm, InviteAdminChangeForm
from apps.root.models import (
    CheckoutItem,
    CheckoutSession,
    Event,
    Invite,
    Membership,
    Team,
    Ticket,
    TicketRedemptionKey,
    TicketTier,
    TierAssetOwnership,
    TierBlockchain,
    TierFiat,
    TxAssetOwnership,
    TxBlockchain,
    TxFiat,
)

User = get_user_model()


# Custom Classes
class MembershipInline(admin.TabularInline):
    model = Team.members.through


class CustomDBAdmin(admin.ModelAdmin):
    list_display = ["public_id", "created", "modified"]


# Admin registrations
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    inlines = [
        MembershipInline,
    ]


@admin.register(Team)
class TeamAdmin(CustomDBAdmin):
    inlines = [MembershipInline]
    exclude = ("members",)
    list_display = CustomDBAdmin.list_display + ["name"]
    search_fields = ("name",)


@admin.register(Membership)
class MembershipAdmin(CustomDBAdmin):
    list_display = CustomDBAdmin.list_display + ["user", "team"]


@admin.register(Invite)
class InviteAdmin(CustomDBAdmin):
    list_display = CustomDBAdmin.list_display + ["email", "sent", "accepted"]
    raw_id_fields = ("inviter",)

    def get_form(self, request, obj=None, **kwargs):
        if obj:
            kwargs["form"] = InviteAdminChangeForm
        else:
            kwargs["form"] = InviteAdminAddForm
            kwargs["form"].user = request.user
            kwargs["form"].request = request
        return super().get_form(request, obj, **kwargs)


@admin.register(Event)
class EventAdmin(CustomDBAdmin):
    def transition_to_draft(modeladmin, request, queryset):
        for i in queryset:
            i.transition_draft()
        messages.success(request, "Event(s) have been transitioned live")

    def transition_to_live(modeladmin, request, queryset):
        for i in queryset:
            i.transition_live()
        messages.success(request, "Event(s) have been transitioned live")

    list_display = CustomDBAdmin.list_display + [
        "title",
        "user",
        "team",
        "start_date",
    ]
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


@admin.register(Ticket)
class TicketAdmin(CustomDBAdmin):
    list_display = CustomDBAdmin.list_display + ["checkout_item", "embed_code"]


@admin.register(TicketRedemptionKey)
class TicketRedemptionKeyAdmin(CustomDBAdmin):
    list_display = CustomDBAdmin.list_display


@admin.register(TicketTier)
class TicketTierAdmin(CustomDBAdmin):
    list_display = CustomDBAdmin.list_display + [
        "ticket_type",
        "event",
        "price",
        "capacity",
        "quantity_sold",
        "max_per_person",
    ]
    search_fields = ("event__title",)


@admin.register(TierFiat)
class TierFiatAdmin(CustomDBAdmin):
    list_display = CustomDBAdmin.list_display


@admin.register(TierBlockchain)
class TierBlockchainAdmin(CustomDBAdmin):
    list_display = CustomDBAdmin.list_display


@admin.register(TierAssetOwnership)
class TierAssetOwnershipAdmin(CustomDBAdmin):
    list_display = CustomDBAdmin.list_display


@admin.register(CheckoutSession)
class CheckoutSessionAdmin(CustomDBAdmin):
    list_display = CustomDBAdmin.list_display + [
        "name",
        "email",
        "expiration",
    ]
    search_fields = ("event__title",)


@admin.register(CheckoutItem)
class CheckoutItemAdmin(CustomDBAdmin):
    list_display = CustomDBAdmin.list_display + [
        "quantity",
        "ticket_tier",
    ]
    search_fields = ("checkout_session__name",)


@admin.register(TxFiat)
class TxFiatAdmin(CustomDBAdmin):
    list_display = CustomDBAdmin.list_display


@admin.register(TxBlockchain)
class TxBlockchainAdmin(CustomDBAdmin):
    list_display = CustomDBAdmin.list_display


@admin.register(TxAssetOwnership)
class TxAssetOwnershipAdmin(CustomDBAdmin):
    list_display = CustomDBAdmin.list_display
