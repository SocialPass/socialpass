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
    TicketTier,
    TierAssetOwnership,
    TierFiat,
    TierFree,
    TxAssetOwnership,
    TxFiat,
    TxFree,
    WhiteLabel,
)

User = get_user_model()


class CustomDBAdmin(admin.ModelAdmin):
    """
    Reusable Class providing the default fields
    """

    list_display = ["public_id", "created", "modified"]


@admin.register(CheckoutItem)
class CheckoutItemAdmin(CustomDBAdmin):
    list_display = [
        "__str__",
        "ticket_tier",
        "quantity",
        "extra_party",
        "is_overflow",
        "checkout_session",
    ] + CustomDBAdmin.list_display
    search_fields = (
        "checkout_session__name",
        "checkout_session__email",
    )


@admin.register(CheckoutSession)
class CheckoutSessionAdmin(CustomDBAdmin):
    list_display = [
        "__str__",
        "event",
        "name",
        "email",
        "tx_type",
        "tx_status",
    ] + CustomDBAdmin.list_display
    search_fields = (
        "event__title",
        "name",
        "email",
    )


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

    list_display = [
        "__str__",
        "title",
        "user",
        "team",
        "state",
        "start_date",
        "end_date",
        "sales_start",
        "sales_end",
    ] + CustomDBAdmin.list_display
    search_fields = (
        "title",
        "user__username",
        "team__name",
    )
    inlines = [StateLogInline]
    readonly_fields = ["state"]

    actions = [transition_to_draft, transition_to_live]  # type: ignore


@admin.register(Invite)
class InviteAdmin(CustomDBAdmin):
    list_display = ["__str__", "email", "sent", "accepted"] + CustomDBAdmin.list_display
    raw_id_fields = ("inviter",)

    def get_form(self, request, obj=None, **kwargs):
        if obj:
            kwargs["form"] = InviteAdminChangeForm
        else:
            kwargs["form"] = InviteAdminAddForm
            kwargs["form"].user = request.user
            kwargs["form"].request = request
        return super().get_form(request, obj, **kwargs)


@admin.register(Membership)
class MembershipAdmin(CustomDBAdmin):
    list_display = ["__str__", "user", "team"] + CustomDBAdmin.list_display


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = [
        "email",
        "username",
        "is_staff",
        "is_active",
        "date_joined"
    ]
    class MembershipInline(admin.TabularInline):
        model = Team.members.through

    inlines = [
        MembershipInline,
    ]


@admin.register(Team)
class TeamAdmin(CustomDBAdmin):
    class MembershipInline(admin.TabularInline):
        model = Team.members.through

    inlines = [MembershipInline]
    exclude = ("members",)
    list_display = [
        "__str__",
        "name",
        "description",
        "whitelabel",
    ] + CustomDBAdmin.list_display
    search_fields = ("name",)


@admin.register(TicketTier)
class TicketTierAdmin(CustomDBAdmin):
    list_display = [
        "__str__",
        "ticket_type",
        "event",
        "capacity",
        "quantity_sold",
        "max_per_person",
    ] + CustomDBAdmin.list_display
    search_fields = (
        "ticket_type",
        "event__title",
    )


@admin.register(Ticket)
class TicketAdmin(CustomDBAdmin):
    list_display = [
        "__str__",
        "event",
        "ticket_tier",
        "party_size",
        "checkout_session",
        "embed_code",
        "redeemed_at",
    ] + CustomDBAdmin.list_display


@admin.register(TierAssetOwnership)
class TierAssetOwnershipAdmin(CustomDBAdmin):
    list_display = [
        "__str__",
        "tickettier",
        "blockchain",
        "network",
        "asset_type",
        "balance_required",
        "token_address",
        "token_id",
    ] + CustomDBAdmin.list_display
    search_fields = ("tickettier__ticket_type",)


@admin.register(TierFiat)
class TierFiatAdmin(CustomDBAdmin):
    list_display = [
        "__str__",
        "tickettier",
    ] + CustomDBAdmin.list_display
    search_fields = ("tickettier__ticket_type",)


@admin.register(TierFree)
class TierFreeAdmin(CustomDBAdmin):
    list_display = [
        "__str__",
        "tickettier",
    ] + CustomDBAdmin.list_display
    search_fields = ("tickettier__ticket_type",)


@admin.register(TxFiat)
class TxFiatAdmin(CustomDBAdmin):
    list_display = ["__str__", "checkoutsession"] + CustomDBAdmin.list_display
    search_fields = ("checkoutsession__email",)


@admin.register(TxAssetOwnership)
class TxAssetOwnershipAdmin(CustomDBAdmin):
    list_display = ["__str__", "checkoutsession"] + CustomDBAdmin.list_display
    search_fields = ("checkoutsession__email",)


@admin.register(TxFree)
class TxFreeAdmin(CustomDBAdmin):
    list_display = ["__str__", "checkoutsession"] + CustomDBAdmin.list_display
    search_fields = ("checkoutsession__email",)


@admin.register(WhiteLabel)
class WhiteLabelAdmin(CustomDBAdmin):
    list_display = ["__str__", "brand_name"] + CustomDBAdmin.list_display
