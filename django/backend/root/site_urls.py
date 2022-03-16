from django.conf.urls import url
from django.urls import path
from django.views.generic import TemplateView

from . import site_views

urlpatterns = [
    # User
    path("accounts/info/", site_views.UserDetailView.as_view(), name="user_detail"),
    url(
        r'^accept-invite/(?P<key>\w+)/?$',
        site_views.AcceptInviteView.as_view(),
        name='accept_invite'
    ),
    # Team
    path("", site_views.RedirectToTeamView.as_view(), name="dashboard_redirect"),
    path("<int:team_pk>/", site_views.DashboardView.as_view(), name="dashboard"),
    path(
        "<int:team_pk>/team-detail/",
        site_views.TeamDetailView.as_view(),
        name="team_detail",
    ),
    path(
        "<int:team_pk>/team-update/",
        site_views.TeamUpdateView.as_view(),
        name="team_update",
    ),
    path(
        "<int:team_pk>/team-members/",
        site_views.TeamMemberManageView.as_view(),
        name="team_members",
    ),
    path(
        "<int:team_pk>/team-members/<int:member_pk>/",
        site_views.TeamMemberDeleteView.as_view(),
        name="team_member_delete",
    ),
    # Ticket token gates
    path(
        "<int:team_pk>/ticketgates/",
        site_views.TicketGateListView.as_view(),
        name="ticketgate_list",
    ),
    path(
        "<int:team_pk>/ticketgates/create/",
        site_views.TicketGateCreateView.as_view(),
        name="ticketgate_create",
    ),
    path(
        "<int:team_pk>/ticketgates/<int:pk>/",
        site_views.TicketGateDetailView.as_view(),
        name="ticketgate_detail",
    ),
    path(
        "<int:team_pk>/ticketgates/<int:pk>/update/",
        site_views.TicketGateUpdateView.as_view(),
        name="ticketgate_update",
    ),
]
