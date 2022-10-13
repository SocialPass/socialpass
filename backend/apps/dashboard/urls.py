from django.urls import path

from . import views

app_name = "dashboard"

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
    # Ticketing
    path(
        "events/published/<uuid:team_public_id>/",
        views.EventListView.as_view(),
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
        views.EventStatisticsView.as_view(),
        name="event_stats",
    ),
]
