from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.test import Client, RequestFactory, TestCase
from django.urls import reverse

from apps.dashboard import views
from apps.dashboard.models import Membership, Team

User = get_user_model()


class DashboardTest(TestCase):
    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = RequestFactory()
        # TODO: Move this to some sort of factory
        self.user = User.objects.create_user(
            username="jacob", email="jacob@…", password="top_secret"
        )
        self.team = Team.objects.create(name="Test team")
        self.membership = Membership.objects.create(team=self.team, user=self.user)

    def test_team_context_mixin(self):
        return

    def test_require_successful_checkout_mixin(self):
        return

    def test_dashboard_redirect(self):
        # Login User
        self.assertTrue(self.client.login(username="jacob", password="top_secret"))

        # Test logged-in user
        response = self.client.get(reverse("dashboard_redirect"), follow=True)
        self.assertRedirects(
            response,
            expected_url=reverse(
                "ticketgate_list", args=(self.membership.team.public_id,)
            ),
        )

        # Test logged-out user
        self.client.logout()
        response = self.client.get(reverse("dashboard_redirect"), follow=True)
        self.assertRedirects(response, expected_url=reverse("account_login"))

    def test_user_detail(self):
        return "No tests needed"

    def team_accept_invite(self):
        return

    def team_create(self):
        return

    def team_detail(self):
        return

    def team_update(self):
        return

    def team_members(self):
        return

    def team_member_delete(self):
        return

    def ticketgate_list(self):
        return

    def ticketgate_create(self):
        return

    def ticketgate_detail(self):
        return

    def ticketgate_update(self):
        return

    def ticketgate_stats(self):
        return

    def ticketgate_price_estimator(self):
        return

    def ticketgate_checkout(self):
        return

    def ticketgate_checkout_success_callback(self):
        return

    def ticketgate_checkout_failure_callback(self):
        return

    def stripe_webhook(self):
        return
