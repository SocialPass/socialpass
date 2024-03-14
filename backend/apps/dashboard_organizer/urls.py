from django.urls import path

from . import views

app_name = "dashboard_organizer"

urlpatterns = [
    # General redirect
    path("", views.RedirectToTeamView.as_view(), name="dashboard_redirect"),
    # Team
    path(
        "team-create/",
        views.TeamCreateView.as_view(),
        name="team_create",
    ),
    path(
        "team/invitation-detail/<uuid:invitation_public_id>/",
        views.InvitationDetailView.as_view(),
        name="invitation_detail",
    ),
    path(
        "<slug:team_slug>/team-detail/",
        views.TeamDetailView.as_view(),
        name="team_detail",
    ),
    path(
        "<slug:team_slug>/team-update/",
        views.TeamUpdateView.as_view(),
        name="team_update",
    ),
    path(
        "<slug:team_slug>/team-members/",
        views.TeamMemberManageView.as_view(),
        name="team_members",
    ),
    path(
        "<slug:team_slug>/team-members/<int:member_pk>/",
        views.TeamMemberDeleteView.as_view(),
        name="team_member_delete",
    ),
    path(
        "<slug:team_slug>/payment-detail/",
        views.PaymentDetailView.as_view(),
        name="payment_detail",
    ),
    path(
        "<slug:team_slug>/stripe-refresh/",
        views.StripeRefresh.as_view(),
        name="stripe_refresh",
    ),
    path(
        "<slug:team_slug>/stripe-return/",
        views.StripeReturn.as_view(),
        name="stripe_return",
    ),
    path(
        "<slug:team_slug>/stripe-delete/",
        views.StripeDelete.as_view(),
        name="stripe_delete",
    ),
    # Ticketing
    path(
        "<slug:team_slug>/events/",
        views.EventListView.as_view(),
        name="event_list",
    ),
    path(
        "<slug:team_slug>/events/create/",
        views.EventCreateView.as_view(),
        name="event_create",
    ),
    path(
        "<slug:team_slug>/events/<int:pk>/update/",
        views.EventUpdateView.as_view(),
        name="event_update",
    ),
    path(
        "<slug:team_slug>/events/<int:pk>/tickets/",
        views.EventTicketsView.as_view(),
        name="event_tickets",
    ),
    path(
        "<slug:team_slug>/events/<int:pk>/go-live/",
        views.EventGoLiveView.as_view(),
        name="event_go_live",
    ),
    path(
        "<slug:team_slug>/events/<int:pk>/delete/",
        views.EventDeleteView.as_view(),
        name="event_delete",
    ),
    path(
        "<slug:team_slug>/events/<int:pk>/stats/",
        views.EventStatsView.as_view(),
        name="event_stats",
    ),
    path(
        "<slug:team_slug>/events/<int:pk>/promote/",
        views.EventPromoteView.as_view(),
        name="event_promote",
    ),
    path(
        "<slug:team_slug>/events/<int:pk>/check-in-guests/",
        views.EventCheckInGuestsView.as_view(),
        name="event_check_in_guests",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/tickets/create/",
        views.TicketTierCreateView.as_view(),
        name="ticket_tier_create",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/tickets/create/nft/",
        views.TicketTierNFTCreateView.as_view(),
        name="ticket_tier_nft_create",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/tickets/create/fiat/",
        views.TicketTierFiatCreateView.as_view(),
        name="ticket_tier_fiat_create",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/tickets/create/free/",
        views.TicketTierFreeCreateView.as_view(),
        name="ticket_tier_free_create",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/tickets/<int:pk>/update/",
        views.TicketTierUpdateView.as_view(),
        name="ticket_tier_update",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/tickets/<int:pk>/delete/",
        views.TicketTierDeleteView.as_view(),
        name="ticket_tier_delete",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/rsvp-tickets/",
        views.RSVPTicketsView.as_view(),
        name="rsvp_tickets",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/rsvp-create-tickets/",
        views.RSVPCreateTicketsView.as_view(),
        name="rsvp_create_tickets",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/message-batches/",
        views.MessageBatchesView.as_view(),
        name="message_batches",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/message-batch-create/",
        views.MessageBatchCreateView.as_view(),
        name="message_batch_create",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/vip-list/",
        views.ManualAttendeesView.as_view(),
        name="manual_attendees",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/vip-list-add-attendees/",
        views.ManualAttendeesCreateView.as_view(),
        name="manual_attendees_create",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/waiting-queue/",
        views.WaitingQueueView.as_view(),
        name="waiting_queue",
    ),
    path(
        "<slug:team_slug>/events/<int:event_pk>/waiting-queue-post/<int:checkout_session_pk>/",
        views.WaitingQueuePostView.as_view(),
        name="waiting_queue_post",
    ),
    # Scanner
    path(
        "scanner/<uuid:scanner_id>/",
        views.EventScanner.as_view(),
        name="scanner",
    ),
    path(
        "scanner/<uuid:scanner_id>/scan-tickets/",
        views.EventScanner2.as_view(),
        name="scanner2",
    ),
    path(
        "scanner/<uuid:scanner_id>/stats/",
        views.EventScannerStats.as_view(),
        name="scanner_stats",
    ),
    path(
        "scanner/<uuid:scanner_id>/manual-check-in/",
        views.EventScannerManualCheckIn.as_view(),
        name="scanner_manual_check_in",
    ),
    path(
        "scanner/<uuid:scanner_id>/manual-attendee-post/<int:manual_attendee_pk>",
        views.EventScannerManualAttendeePost.as_view(),
        name="scanner_manual_attendee_post",
    ),
    path(
        "scanner/<uuid:scanner_id>/manual-ticket-post/<int:ticket_pk>",
        views.EventScannerManualTicketPost.as_view(),
        name="scanner_manual_ticket_post",
    ),
]
