from django.urls import include, path
from invitations.views import SendInvite

from . import views

urlpatterns = [
    # General redirect
    path("", views.RedirectToTeamView.as_view(), name="dashboard_redirect"),
    # User Accounts
    path("accounts/", include("allauth.urls")),
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
    # Ticketing
    path(
        "events/published/<uuid:team_public_id>/",
        views.PublishedEventsListView.as_view(),
        name="event_list",
    ),
    path(
        "events/wip/<uuid:team_public_id>/",
        views.WIPEventsListView.as_view(),
        name="event_drafts",
    ),
    path(
        "events/create/<uuid:team_public_id>/",
        views.EventCreateView.as_view(),
        name="event_create",
    ),
    path(
        "events/<uuid:team_public_id>/<int:pk>/",
        views.EventDetailView.as_view(),
        name="event_detail",
    ),
    path(
        "events/update/<uuid:team_public_id>/<int:pk>/",
        views.EventUpdateView.as_view(),
        name="event_update",
    ),
    path(
        "events/delete/<uuid:team_public_id>/<int:pk>/",
        views.EventDeleteView.as_view(),
        name="event_delete",
    ),
    path(
        "events/stats/<uuid:team_public_id>/<int:pk>/",
        views.EventStatisticsView.as_view(),
        name="event_stats",
    ),
    path(
        "events/estimate-price/<uuid:team_public_id>/",
        views.PricingCalculator.as_view(),
        name="event_price_estimator",
    ),
    path(
        "events/checkout/<uuid:team_public_id>/<int:pk>/",
        views.EventCheckout.as_view(),
        name="event_checkout",
    ),
    path(
        "events/checkout/success/<uuid:team_public_id>/<int:pk>/",
        views.EventCheckout.success_stripe_callback,
        name="event_checkout_success_callback",
    ),
    path(
        "events/checkout/failure/<uuid:team_public_id>/<int:pk>/",
        views.EventCheckout.failure_stripe_callback,
        name="event_checkout_failure_callback",
    ),
    path(
        "webhooks/stripe",
        views.EventCheckout.stripe_webhook,
        name="stripe_webhook",
    ),
]
