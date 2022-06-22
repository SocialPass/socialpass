from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.test import Client, RequestFactory, TestCase
from django.urls import reverse

from apps.dashboard import forms, views
from apps.dashboard.models import Invite, Membership, Team

User = get_user_model()


class DashboardTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

        # TODO: Move this to some sort of factory
        self.username = "jacob"
        self.password = "top_secret"
        self.email = "jacob@test.local"
        self.team_name = "Test Team"
        self.user = User.objects.create_user(
            username=self.username, email=self.email, password=self.password
        )
        self.team = Team.objects.create(name=self.team_name)
        self.membership = Membership.objects.create(team=self.team, user=self.user)

    def test_team_context_mixin(self):
        return

    def test_require_successful_checkout_mixin(self):
        return

    def test_dashboard_redirect(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

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
        return "TODO"

    def test_team_accept_invite(self):
        return "TODO"

    def test_team_create(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

        # Test GET
        response = self.client.get(reverse("team_create"))
        self.assertEqual(response.status_code, 200)

        # TEST POST
        data = {
            "name": "OneTime Team",
            "description": "OneTime Team Descripton",
        }
        response = self.client.post(reverse("team_create"), data=data, follow=True)
        self.assertEqual(Team.objects.filter(name="OneTime Team").count(), 1)

    def test_team_detail(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

        # Test GET
        response = self.client.get(reverse("team_detail", args=(self.team.public_id,)))
        self.assertEqual(response.status_code, 200)

    def test_team_update(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

        # Test GET
        response = self.client.get(reverse("team_update", args=(self.team.public_id,)))
        self.assertEqual(response.status_code, 200)

        # TEST POST
        data = {
            "name": "Updated Team Name",
            "description": "Updated Team Descripton",
        }
        response = self.client.post(
            reverse("team_update", args=(self.team.public_id,)), data=data, follow=True
        )
        self.assertEqual(Team.objects.filter(name="Updated Team Name").count(), 1)

    def test_team_members(self):
        return "TODO"
        """
        # Login User
        self.assertTrue(self.client.login(username=self.username, password=self.password))

        # Test GET
        response = self.client.get(reverse("team_members", args=(self.team.public_id,)))
        self.assertEquals(response.status_code, 200)

        # TEST POST
        # Create / clean form data
        data = {
            'email': 'onetime@test.local'
        }
        form_data = forms.CustomInviteForm(data=data)
        self.assertTrue(form_data.is_valid())

        # Get response
        response = self.client.post(reverse("team_members", args=(self.team.public_id,)), data=form_data, follow=True)

        """

    def test_team_member_delete(self):
        return "TODO"

    def test_ticketgate_list(self):
        return "TODO"

    def test_ticketgate_create(self):
        return "TODO"

    def test_ticketgate_detail(self):
        return "TODO"

    def test_ticketgate_update(self):
        return "TODO"

    def test_ticketgate_stats(self):
        return "TODO"

    def test_ticketgate_price_estimator(self):
        return "TODO"

    def test_ticketgate_checkout(self):
        return "TODO"

    def test_ticketgate_checkout_success_callback(self):
        return "TODO"

    def test_ticketgate_checkout_failure_callback(self):
        return "TODO"

    def test_stripe_webhook(self):
        return "TODO"
