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
        "team-detail/<uuid:team_pk>/",
        views.TeamDetailView.as_view(),
        name="team_detail",
    ),
    path(
        "team-update/<uuid:team_pk>/",
        views.TeamUpdateView.as_view(),
        name="team_update",
    ),
    path(
        "team-members/<uuid:team_pk>/",
        views.TeamMemberManageView.as_view(),
        name="team_members",
    ),
    path(
        "team-members/<uuid:team_pk>/<int:member_pk>/",
        views.TeamMemberDeleteView.as_view(),
        name="team_member_delete",
    ),
    # Ticketing
    path(
        "ticketed-events/<uuid:team_pk>/",
        views.EventListView.as_view(),
        name="ticketgate_list",
    ),
    path(
        "ticketed-events/create/<uuid:team_pk>/",
        views.EventCreateView.as_view(),
        name="ticketgate_create",
    ),
    path(
        "ticketed-events/<uuid:team_pk>/<int:pk>/",
        views.EventDetailView.as_view(),
        name="ticketgate_detail",
    ),
    path(
        "ticketed-events/update/<uuid:team_pk>/<int:pk>/",
        views.EventUpdateView.as_view(),
        name="ticketgate_update",
    ),
    path(
        "ticketed-events/stats/<uuid:team_pk>/<int:pk>/",
        views.EventStatisticsView.as_view(),
        name="ticketgate_stats",
    ),
    path(
        "ticketed-events/estimate-price/<uuid:team_pk>/",
        views.PricingCalculator.as_view(),
        name="ticketgate_price_estimator",
    ),
    path(
        "ticketed-events/checkout/<uuid:team_pk>/<int:pk>/",
        views.EventCheckout.as_view(),
        name="ticketgate_checkout",
    ),
    path(
        "ticketed-events/checkout/success/<uuid:team_pk>/<int:pk>/",
        views.EventCheckout.success_stripe_callback,
        name="ticketgate_checkout_success_callback",
    ),
    path(
        "ticketed-events/checkout/failure/<uuid:team_pk>/<int:pk>/",
        views.EventCheckout.failure_stripe_callback,
        name="ticketgate_checkout_failure_callback",
    ),
    path(
        "webhooks/stripe",
        views.EventCheckout.stripe_webhook,
        name="stripe_webhook",
    ),
]
