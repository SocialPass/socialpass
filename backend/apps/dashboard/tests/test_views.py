import uuid

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.http import HttpResponse
from django.test import Client, RequestFactory, TestCase
from django.urls import reverse
from django.utils import timezone
from django.views.generic import TemplateView

from apps.dashboard import forms, views
from apps.dashboard.models import Invite, Membership, Team
from apps.root.models import Event

User = get_user_model()


class DashboardTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

        # TODO: Move this to some sort of factory
        # Setup users
        self.username = "jacob"
        self.username_two = "jacob2"
        self.email = "jacob@test.local"
        self.email_two = "jacob2@test.local"
        self.password = "top_secret"
        self.team_name = "Test Team"
        self.user = User.objects.create_user(
            username=self.username, email=self.email, password=self.password
        )
        self.user_two = User.objects.create_user(
            username=self.username_two, email=self.email, password=self.password
        )
        # Setup team
        self.team = Team.objects.create(name=self.team_name)
        self.membership = Membership.objects.create(team=self.team, user=self.user)
        self.team.members.add(self.user_two)
        # Setup event
        event_data = {
            "title": "Test Title",
            "team": self.team,
            "user": self.user,
            "description": "Test Description",
            "date": timezone.now(),
            "timezone": "US/Eastern",
            "location": "NYC",
            "capacity": 100,
            "limit_per_person": 1,
            "requirements": [],
        }
        self.event = Event.objects.create(**event_data)

    def test_team_context_mixin(self):
        class TestTeamContextView(views.TeamContextMixin, TemplateView):
            template_name = "account/detail.html"

        # Test logged-in user
        kwargs = {"team_pk": self.team.public_id}
        request = self.factory.get("/fake-path")
        request.user = self.user
        response = TestTeamContextView.as_view()(request, **kwargs)
        self.assertEqual(response.status_code, 200)
        # TODO: check for current_team in context data

        # Test logged-in user without membership
        self.team.members.remove(self.user_two)
        request = self.factory.get("/fake-path")
        request.user = self.user_two
        response = TestTeamContextView.as_view()(request, **kwargs)
        self.assertEqual(response.status_code, 404)

        # Test logged-out user
        request = self.factory.get("/fake-path", follow=True)
        request.user = AnonymousUser()
        response = TestTeamContextView.as_view()(request, **kwargs)
        self.assertEqual(response.status_code, 302)

    def test_require_successful_checkout_mixin(self):
        return "Not yet implemented"

    def test_user_detail(self):
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

        # Test GET
        response = self.client.get(reverse("user_detail"))
        self.assertEqual(response.status_code, 200)

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

    def test_team_accept_invite(self):
        return "Not yet implemented"

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
        # Login User
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

        # Test GET
        response = self.client.get(reverse("team_members", args=(self.team.public_id,)))
        self.assertEqual(response.status_code, 200)

        # TEST POST
        # Create / clean form data
        data = {"email": "onetime@test.local"}
        form_data = forms.CustomInviteForm(data=data)
        self.assertTrue(form_data.is_valid())

        # Get response
        response = self.client.post(
            reverse("team_members", args=(self.team.public_id,)), data=data, follow=True
        )
        self.assertEqual(Invite.objects.filter(email="onetime@test.local").count(), 1)

    def test_team_member_delete(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

        # Test GET
        response = self.client.get(
            reverse("team_member_delete", args=(self.team.public_id, self.user_two.pk))
        )
        self.assertEqual(response.status_code, 200)

        # TEST POST
        response = self.client.post(
            reverse("team_member_delete", args=(self.team.public_id, self.user_two.pk))
        )
        self.assertEqual(self.team.members.count(), 1)

    def test_ticketgate_list(self):
        return "Not yet implemented"

    def test_ticketgate_create(self):
        return "Not yet implemented"

    def test_ticketgate_detail(self):
        return "Not yet implemented"

    def test_ticketgate_update(self):
        return "Not yet implemented"

    def test_ticketgate_stats(self):
        return "Not yet implemented"

    def test_ticketgate_price_estimator(self):
        return "Not yet implemented"

    def test_ticketgate_checkout(self):
        return "Not yet implemented"

    def test_ticketgate_checkout_success_callback(self):
        return "Not yet implemented"

    def test_ticketgate_checkout_failure_callback(self):
        return "Not yet implemented"

    def test_stripe_webhook(self):
        return "Not yet implemented"
