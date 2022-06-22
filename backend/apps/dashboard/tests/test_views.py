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

    def test_details(self):
        """
        # Create an instance of a GET request.
        request = self.factory.get("/customer/details")

        # Recall that middleware are not supported. You can simulate a
        # logged-in user by setting request.user manually.
        request.user = self.user

        # Or you can simulate an anonymous user by setting request.user to
        # an AnonymousUser instance.
        request.user = AnonymousUser()

        # Test my_view() as if it were deployed at /customer/details
        response = my_view(request)
        # Use this syntax for class-based views.
        response = MyView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        """
        return

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


"""
dashboard_redirect
user_detail
accept_invite
send_invite
team_create
team_detail
team_update
team_members
team_member_delete
ticketgate_list
ticketgate_create
ticketgate_detail
ticketgate_update
ticketgate_stats
ticketgate_price_estimator
ticketgate_checkout
ticketgate_checkout_success_callback
ticketgate_checkout_failure_callback
stripe_webhook
"""
