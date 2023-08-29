from django.urls import path

from . import views

app_name = "dashboard_organizer"

urlpatterns = [
    # General redirect
    path("", views.RedirectToTeamView.as_view(), name="dashboard_redirect"),
    # User Accounts
    path("accounts/info/", views.UserDetailView.as_view(), name="user_detail"),
    # Team
    path(
        "team-create/",
        views.TeamCreateView.as_view(),
        name="team_create",
    ),
    path(
        "team/accept-invite/<str:key>/",
        views.TeamAcceptInviteView.as_view(),
        name="team_accept_invite",
    ),
    path(
        "team-detail/<uuid:team_public_id>/",
        views.TeamDetailView.as_view(),
        name="team_detail",
    ),
    path(
        "team-update/<uuid:team_public_id>/",
        views.TeamUpdateView.as_view(),
        name="team_update",
    ),
    path(
        "team-members/<uuid:team_public_id>/",
        views.TeamMemberManageView.as_view(),
        name="team_members",
    ),
    path(
        "team-members/<uuid:team_public_id>/<int:member_pk>/",
        views.TeamMemberDeleteView.as_view(),
        name="team_member_delete",
    ),
    path(
        "payment-detail/<uuid:team_public_id>/",
        views.PaymentDetailView.as_view(),
        name="payment_detail",
    ),
    path(
        "stripe-refresh/<uuid:team_public_id>/",
        views.StripeRefresh.as_view(),
        name="stripe_refresh",
    ),
    path(
        "stripe-return/<uuid:team_public_id>/",
        views.StripeReturn.as_view(),
        name="stripe_return",
    ),
    path(
        "stripe-delete/<uuid:team_public_id>/",
        views.StripeDelete.as_view(),
        name="stripe_delete",
    ),
    # Ticketing
    path(
        "events/<uuid:team_public_id>/",
        views.EventListView.as_view(),
        name="event_list",
    ),
    path(
        "events/create/<uuid:team_public_id>/",
        views.EventCreateView.as_view(),
        name="event_create",
    ),
    path(
        "events/update/<uuid:team_public_id>/<int:pk>/",
        views.EventUpdateView.as_view(),
        name="event_update",
    ),
    path(
        "events/tickets/<uuid:team_public_id>/<int:pk>/",
        views.EventTicketsView.as_view(),
        name="event_tickets",
    ),
    path(
        "events/go-live/<uuid:team_public_id>/<int:pk>/",
        views.EventGoLiveView.as_view(),
        name="event_go_live",
    ),
    path(
        "events/delete/<uuid:team_public_id>/<int:pk>/",
        views.EventDeleteView.as_view(),
        name="event_delete",
    ),
    path(
        "events/stats/<uuid:team_public_id>/<int:pk>/",
        views.EventStatsView.as_view(),
        name="event_stats",
    ),
    path(
        "events/tickets/<uuid:team_public_id>/<int:event_pk>/create/",
        views.TicketTierCreateView.as_view(),
        name="ticket_tier_create",
    ),
    path(
        "events/tickets/<uuid:team_public_id>/<int:event_pk>/create/nft/",
        views.TicketTierNFTCreateView.as_view(),
        name="ticket_tier_nft_create",
    ),
    path(
        "events/tickets/<uuid:team_public_id>/<int:event_pk>/create/fiat/",
        views.TicketTierFiatCreateView.as_view(),
        name="ticket_tier_fiat_create",
    ),
    path(
        "events/tickets/<uuid:team_public_id>/<int:event_pk>/create/free/",
        views.TicketTierFreeCreateView.as_view(),
        name="ticket_tier_free_create",
    ),
    path(
        "events/tickets/<uuid:team_public_id>/<int:event_pk>/update/<int:pk>",
        views.TicketTierUpdateView.as_view(),
        name="ticket_tier_update",
    ),
    path(
        "events/tickets/<uuid:team_public_id>/<int:event_pk>/delete/<int:pk>/",
        views.TicketTierDeleteView.as_view(),
        name="ticket_tier_delete",
    ),
    # Scanning
    path(
        "scanner/<uuid:scanner_id>/",
        views.EventScanner.as_view(),
        name="scanner",
    ),
    path(
        "scanner-stats/<uuid:scanner_id>/",
        views.EventScannerStats.as_view(),
        name="scanner_stats",
    ),
    path(
        "scanner-2/<uuid:scanner_id>/",
        views.EventScanner2.as_view(),
        name="scanner2",
    ),
]
