from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from apps.root.models import (
    CheckoutItem,
    CheckoutSession,
    Event,
    Invitation,
    Membership,
    MessageBatch,
    RSVPBatch,
    Team,
    Ticket,
    TicketTier,
    WhiteLabel,
)

User = get_user_model()


class CustomDBAdmin(admin.ModelAdmin):
    """
    Reusable Class providing the default fields
    """

    list_display = ["public_id", "created", "modified"]
    sortable_by = ["public_id", "created", "modified"]
    ordering = ["-modified"]
    list_per_page = 1


@admin.register(CheckoutItem)
class CheckoutItemAdmin(CustomDBAdmin):
    list_display = [
        "__str__",
        "ticket_tier",
        "quantity",
        "selected_guests",
        "checkout_session",
    ] + CustomDBAdmin.list_display
    search_fields = [
        "checkout_session__name",
        "checkout_session__email",
    ]
    list_select_related = ["ticket_tier", "checkout_session"]
    raw_id_fields = []


@admin.register(CheckoutSession)
class CheckoutSessionAdmin(CustomDBAdmin):
    list_display = [
        "__str__",
        "event",
        "name",
        "email",
        "session_type",
        "order_status",
    ] + CustomDBAdmin.list_display
    search_fields = ["event__title", "name", "email", "public_id"]
    list_select_related = [
        "event",
    ]


@admin.register(Event)
class EventAdmin(CustomDBAdmin):
    list_display = [
        "__str__",
        "title",
        "user",
        "team",
        "start_date",
        "end_date",
        "sales_start",
        "sales_end",
    ] + CustomDBAdmin.list_display
    search_fields = [
        "title",
        "user__username",
        "team__name",
    ]
    list_select_related = ["user", "team"]
    raw_id_fields = ["user", "team"]


@admin.register(Invitation)
class InvitationAdmin(CustomDBAdmin):
    list_display = [
        "__str__",
        "inviter",
        "team",
        "email",
        "accepted",
    ] + CustomDBAdmin.list_display
    list_select_related = [
        "inviter",
        "team",
        "membership",
    ]
    search_fields = [
        "inviter__email",
        "team__name",
        "email",
    ]


@admin.register(Membership)
class MembershipAdmin(CustomDBAdmin):
    list_display = ["__str__", "user", "team"] + CustomDBAdmin.list_display
    list_select_related = ["user", "team"]
    raw_id_fields = ["user", "team"]


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ["email", "username", "is_staff", "is_active", "date_joined"]

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
    search_fields = ["name"]


@admin.register(TicketTier)
class TicketTierAdmin(CustomDBAdmin):
    list_display = [
        "__str__",
        "name",
        "event",
        "capacity",
        "tickets_sold_count",
        "max_per_person",
    ] + CustomDBAdmin.list_display
    search_fields = [
        "name",
        "event__title",
    ]
    list_select_related = [
        "event",
    ]
    raw_id_fields = [
        "event",
    ]


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
    search_fields = [
        "event__title",
        "checkout_session__name",
        "checkout_session__email",
    ]
    list_select_related = [
        "event",
        "ticket_tier",
        "checkout_session",
    ]
    raw_id_fields = [
        "event",
        "ticket_tier",
        "checkout_session",
    ]


@admin.register(WhiteLabel)
class WhiteLabelAdmin(CustomDBAdmin):
    list_display = ["__str__", "brand_name"] + CustomDBAdmin.list_display


@admin.register(RSVPBatch)
class RSVPBatchAdmin(CustomDBAdmin):
    list_display = ["__str__", "event"] + CustomDBAdmin.list_display


@admin.register(MessageBatch)
class MessageBatchAdmin(CustomDBAdmin):
    list_display = ["__str__", "event", "ticket_tier"] + CustomDBAdmin.list_display
