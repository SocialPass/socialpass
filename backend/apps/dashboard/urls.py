from django.urls import path

from . import views

urlpatterns = [
    # User
    path("accounts/info/", views.UserDetailView.as_view(), name="user_detail"),
    path("accounts/delete/", views.UserDeleteView.as_view(), name="user_delete"),
    # Team
    path("", views.RedirectToTeamView.as_view(), name="dashboard_redirect"),
    path("<int:team_pk>/", views.DashboardView.as_view(), name="dashboard"),
    path(
        "<int:team_pk>/team-detail/",
        views.TeamDetailView.as_view(),
        name="team_detail",
    ),
    path(
        "<int:team_pk>/team-update/",
        views.TeamUpdateView.as_view(),
        name="team_update",
    ),
    path(
        "<int:team_pk>/team-members/",
        views.TeamMemberManageView.as_view(),
        name="team_members",
    ),
    path(
        "<int:team_pk>/team-members/<int:member_pk>/",
        views.TeamMemberDeleteView.as_view(),
        name="team_member_delete",
    ),
    # Ticket token gates
    path(
        "<int:team_pk>/ticketgates/",
        views.TicketGateListView.as_view(),
        name="ticketgate_list",
    ),
    path(
        "<int:team_pk>/ticketgates/create/",
        views.TicketGateCreateView.as_view(),
        name="ticketgate_create",
    ),
    path(
        "<int:team_pk>/ticketgates/<int:pk>/",
        views.TicketGateDetailView.as_view(),
        name="ticketgate_detail",
    ),
    path(
        "<int:team_pk>/ticketgates/<int:pk>/update/",
        views.TicketGateUpdateView.as_view(),
        name="ticketgate_update",
    ),
    path(
        "<int:team_pk>/ticketgates/<int:pk>/stats/",
        views.TicketGateStatisticsView.as_view(),
        name="ticketgate_stats",
    ),
    path(
        "<int:team_pk>/ticketgates/estimate_price/",
        views.estimate_ticket_gate_price,
        name="ticketgate_price_estimator",
    ),
    path(
        "<int:team_pk>/checkout/success",
        views.TicketCreateStripeCallbackView.success,
        name="stripe_success_callback",
    ),
    path(
        "<int:team_pk>/checkout/failure",
        views.TicketCreateStripeCallbackView.failure,
        name="stripe_failure_callback",
    ),
]
