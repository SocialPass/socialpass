from django.urls import include, path
from invitations.views import SendInvite

from . import views

urlpatterns = [
    # Team
    path("", views.RedirectToTeamView.as_view(), name="dashboard_redirect"),
    path(
        "team-create/",
        views.TeamCreateView.as_view(),
        name="team_create",
    ),
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
    # Ticketing
    path(
        "<int:team_pk>/ticketed-events/",
        views.EventListView.as_view(),
        name="ticketgate_list",
    ),
    path(
        "<int:team_pk>/ticketed-events/create/",
        views.EventCreateView.as_view(),
        name="ticketgate_create",
    ),
    path(
        "<int:team_pk>/ticketed-events/<int:pk>/",
        views.EventDetailView.as_view(),
        name="ticketgate_detail",
    ),
    path(
        "<int:team_pk>/ticketed-events/<int:pk>/update/",
        views.EventUpdateView.as_view(),
        name="ticketgate_update",
    ),
    path(
        "<int:team_pk>/ticketed-events/<int:pk>/stats/",
        views.EventStatisticsView.as_view(),
        name="ticketgate_stats",
    ),
    path(
        "<int:team_pk>/ticketed-events/estimate-price/",
        views.PricingCalculator.as_view(),
        name="ticketgate_price_estimator",
    ),
    path(
        "<int:team_pk>/ticketed-events/<int:pk>/checkout",
        views.EventCheckout.as_view(),
        name="ticketgate_checkout",
    ),
    path(
        "<int:team_pk>/ticketed-events/<int:pk>/checkout/success",
        views.EventCheckout.success_stripe_callback,
        name="ticketgate_checkout_success_callback",
    ),
    path(
        "<int:team_pk>/ticketed-events/<int:pk>/checkout/failure",
        views.EventCheckout.failure_stripe_callback,
        name="ticketgate_checkout_failure_callback",
    ),
    path(
        "webhooks/stripe",
        views.EventCheckout.stripe_webhook,
        name="stripe_webhook",
    ),
    # Customer account management
    path("accounts/", include("allauth.urls")),
    path("accounts/info/", views.UserDetailView.as_view(), name="user_detail"),
    # Customer invitations
    path(
        "accounts/accept-invite/<str:key>/",
        views.AcceptInviteView.as_view(),
        name="accept_invite",
    ),
    path("accounts/send-invite/", SendInvite.as_view(), name="send_invite"),
]
