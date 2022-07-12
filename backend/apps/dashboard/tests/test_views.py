import uuid

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.contrib.messages.middleware import MessageMiddleware
from django.http import HttpResponse
from django.test import Client, RequestFactory, TestCase
from django.urls import reverse
from django.utils import timezone
from django.views.generic import DetailView, TemplateView

from apps.dashboard import forms, services, views
from apps.dashboard.models import Invite, Membership, PricingRule, Team
from apps.root.models import Event

User = get_user_model()


class DashboardTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

        # TODO: Move this setup to some sort of factory
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
        # TODO: Pricing rules should be their own migration,
        # once we have finalized organizer pricing
        PricingRule.objects.create(
            min_capacity=1,
            max_capacity=None,
            price_per_ticket=1.00,
            active=True,
            group=self.team.pricing_rule_group,
        )
        # Setup event
        self.event_data = {
            "title": "Test Title",
            "team": self.team,
            "user": self.user,
            "description": "Test Description",
            "start_date": timezone.now(),
            "timezone": "US/Eastern",
            "location": "NYC",
            "capacity": 100,
            "limit_per_person": 1,
            "requirements": [],
        }
        self.event = Event.objects.create(**self.event_data)

        # Setup price
        services.issue_payment(event=self.event, stripe_checkout_session_id="12345")

    def test_team_context_mixin(self):
        class TestTeamContextView(views.TeamContextMixin, TemplateView):
            template_name = "dashboard/event_detail.html"

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
        class TestRequireSuccessView(views.RequireSuccesfulCheckoutMixin, DetailView):
            model = Event
            template_name = "dashboard/event_detail.html"

        # Test logged-in user
        kwargs = {"team_pk": self.team.public_id, "pk": self.event.pk}
        request = self.factory.get("/fake-path")
        request.user = self.user

        # Test GET (pending checkout)
        # TODO: Add support for django.contrib.messages to test this line
        # response = TestRequireSuccessView.as_view()(request, **kwargs)
        # self.assertEqual(response.status_code, 200)

        # Test GET (succesful checkout)
        payment = self.event.payments.first()
        payment.status = "SUCCESS"
        payment.save()
        response = TestRequireSuccessView.as_view()(request, **kwargs)
        self.assertEqual(response.status_code, 200)

    def test_user_detail(self):
        # Login user
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
            expected_url=reverse("event_list", args=(self.membership.team.public_id,)),
        )

        # Test logged-out user
        self.client.logout()
        response = self.client.get(reverse("dashboard_redirect"), follow=True)
        self.assertRedirects(response, expected_url=reverse("account_login"))

    def test_team_accept_invite(self):
        # Send invitation to existing user
        request = self.factory.get("/fake")
        invite = Invite.create(email=self.email_two, inviter=self.user, team=self.team)
        invite.send_invitation(request)
        self.client.post(reverse("team_accept_invite", args=(invite.key,)), follow=True)
        invite = Invite.objects.get(inviter=self.user)
        self.assertEqual(invite.accepted, True)

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
        # add team member for deletion
        self.team.members.add(self.user_two)
        member = Membership.objects.filter(team=self.team).last()

        # Login User
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

        # Test GET
        response = self.client.get(
            reverse("team_member_delete", args=(self.team.public_id, member.pk))
        )
        self.assertEqual(response.status_code, 200)

        # TEST POST
        response = self.client.post(
            reverse("team_member_delete", args=(self.team.public_id, member.pk))
        )
        self.assertEqual(self.team.members.count(), 1)

    def test_event_list(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

        # Test GET
        response = self.client.get(reverse("event_list", args=(self.team.public_id,)))
        self.assertEqual(response.status_code, 200)

    def test_event_create(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

        # Test GET
        response = self.client.get(reverse("event_create", args=(self.team.public_id,)))
        self.assertEqual(response.status_code, 200)

        # TEST POST
        data = {
            "title": "Test Title 2",
            "team": self.team,
            "user": self.user,
            "description": "Test Description 2",
            "start_date": timezone.now(),
            "timezone": "US/Eastern",
            "location": "SF",
            "capacity": 100,
            "limit_per_person": 1,
            "requirements": [],
        }
        response = self.client.post(
            reverse("event_create", args=(self.team.public_id,)),
            data=data,
            follow=True,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Event.objects.filter(title="Test Title 2").count(), 1)

    def test_event_detail(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

        # Test GET (pending checkout)
        response = self.client.get(
            reverse("event_detail", args=(self.team.public_id, self.event.pk))
        )
        self.assertEqual(response.status_code, 302)

        # Test GET (succesful checkout)
        payment = self.event.payments.first()
        payment.status = "SUCCESS"
        payment.save()
        response = self.client.get(
            reverse("event_stats", args=(self.team.public_id, self.event.pk))
        )
        self.assertEqual(response.status_code, 200)

    def test_event_update(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

        # Test GET
        response = self.client.get(
            reverse("event_update", args=(self.team.public_id, self.event.pk))
        )
        self.assertEqual(response.status_code, 200)

        # TEST POST
        self.event_data["title"] = "Updated Title"
        response = self.client.post(
            reverse("event_update", args=(self.team.public_id, self.event.pk)),
            data=self.event_data,
            follow=True,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Event.objects.filter(title="Updated Title").count(), 1)

    def test_event_stats(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

        # Test GET (pending checkout)
        response = self.client.get(
            reverse("event_stats", args=(self.team.public_id, self.event.pk))
        )
        self.assertEqual(response.status_code, 302)

        # Test GET (succesful checkout)
        payment = self.event.payments.first()
        payment.status = "SUCCESS"
        payment.save()
        response = self.client.get(
            reverse("event_stats", args=(self.team.public_id, self.event.pk))
        )
        self.assertEqual(response.status_code, 200)

    def test_event_price_estimator(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.username, password=self.password)
        )

        # Test GET
        url = reverse("event_price_estimator", args=(self.team.public_id,))
        url = f"{url}?capacity=100"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_event_checkout(self):
        return "Not yet implemented"

    def test_event_checkout_success_callback(self):
        return "Not yet implemented"

    def test_event_checkout_failure_callback(self):
        return "Not yet implemented"

    def test_stripe_webhook(self):
        return "Not yet implemented"
