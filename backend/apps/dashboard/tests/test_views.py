from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.http import Http404
from django.test import RequestFactory, TestCase
from django.urls import reverse
from django.utils import timezone
from django.views.generic import DetailView, TemplateView

from apps.dashboard import forms, views
from apps.dashboard.models import Invite, Membership, Team
from apps.root.factories import EventFactory, UserWithTeamFactory
from apps.root.models import Event

User = get_user_model()


class DashboardTest(TestCase):
    def setUp(self):
        # Setup request factory
        self.factory = RequestFactory()

        # Setup users
        self.password = "password"
        self.user_one = UserWithTeamFactory()
        self.user_two = UserWithTeamFactory()

        # setup teams
        self.team_one = self.user_one.membership_set.first().team
        self.team_two = self.user_two.membership_set.first().team

        # setup event
        self.event_one = EventFactory(team=self.team_one, user=self.user_one)
        self.event_two = EventFactory(team=self.team_two, user=self.user_two)

    def test_team_context_mixin(self):
        class TestTeamContextView(views.TeamContextMixin, TemplateView):
            template_name = "dashboard/event_detail.html"

        # Test logged-in user
        kwargs = {"team_public_id": self.team_one.public_id}
        request = self.factory.get("/fake-path")
        request.user = self.user_one
        response = TestTeamContextView.as_view()(request, **kwargs)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.context_data["team_public_id"], self.team_one.public_id
        )

        # Test logged-in user without membership
        self.team_one.members.remove(self.user_two)
        request = self.factory.get("/fake-path")
        request.user = self.user_two
        try:
            response = TestTeamContextView.as_view()(request, **kwargs)
        except Exception as e:
            self.assertEqual(type(e), Http404)

        # Test logged-out user
        request = self.factory.get("/fake-path", follow=True)
        request.user = AnonymousUser()
        response = TestTeamContextView.as_view()(request, **kwargs)
        self.assertEqual(response.status_code, 302)

    def test_required_live_event_mixin(self):
        class TestRequireSuccessView(views.RequireLiveEventMixin, DetailView):
            model = Event
            template_name = "dashboard/event_detail.html"

        # TODO
        # Test logged-in user
        # kwargs = {"team_public_id": self.team_one.public_id, "pk": self.event_one.pk}
        # request = self.factory.get("/fake-path")
        # request.user = self.user_one

        # Test GET (succesful checkout)
        # event = self.event_one.transition_live()
        # event.save()
        # response = TestRequireSuccessView.as_view()(request, **kwargs)
        # self.assertEqual(response.status_code, 200)

    def test_user_detail(self):
        # Login user
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test GET
        response = self.client.get(reverse("user_detail"))
        self.assertEqual(response.status_code, 200)

    def test_dashboard_redirect(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test logged-in user
        response = self.client.get(reverse("dashboard_redirect"), follow=True)
        self.assertRedirects(
            response,
            expected_url=reverse("event_list", args=(self.team_one.public_id,)),
        )

        # Test logged-out user
        self.client.logout()
        response = self.client.get(reverse("dashboard_redirect"), follow=True)
        self.assertRedirects(response, expected_url=reverse("account_login"))

    def test_team_accept_invite(self):
        # Send invitation to existing user
        request = self.factory.get("/fake")
        invite = Invite.create(
            email="test@test.local", inviter=self.user_one, team=self.team_one
        )
        invite.send_invitation(request)
        self.client.post(reverse("team_accept_invite", args=(invite.key,)), follow=True)
        invite = Invite.objects.get(inviter=self.user_one)
        self.assertEqual(invite.accepted, True)

    def test_team_create(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
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
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test GET
        response = self.client.get(
            reverse("team_detail", args=(self.team_one.public_id,))
        )
        self.assertEqual(response.status_code, 200)

    def test_team_update(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test GET
        response = self.client.get(
            reverse("team_update", args=(self.team_one.public_id,))
        )
        self.assertEqual(response.status_code, 200)

        # TEST POST
        data = {
            "name": "Updated Team Name",
            "description": "Updated Team Descripton",
        }
        response = self.client.post(
            reverse("team_update", args=(self.team_one.public_id,)),
            data=data,
            follow=True,
        )
        self.assertEqual(Team.objects.filter(name="Updated Team Name").count(), 1)

    def test_team_members(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test GET
        response = self.client.get(
            reverse("team_members", args=(self.team_one.public_id,))
        )
        self.assertEqual(response.status_code, 200)

        # TEST POST
        # Create / clean form data
        data = {"email": "onetime@test.local"}
        form_data = forms.CustomInviteForm(data=data)
        self.assertTrue(form_data.is_valid())

        # Get response
        response = self.client.post(
            reverse("team_members", args=(self.team_one.public_id,)),
            data=data,
            follow=True,
        )
        self.assertEqual(Invite.objects.filter(email="onetime@test.local").count(), 1)

    def test_team_member_delete(self):
        # add team member for deletion
        self.team_one.members.add(self.user_two)
        member = Membership.objects.filter(team=self.team_one).last()

        # Login User
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test GET
        response = self.client.get(
            reverse("team_member_delete", args=(self.team_one.public_id, member.pk))
        )
        self.assertEqual(response.status_code, 200)

        # TEST POST
        response = self.client.post(
            reverse("team_member_delete", args=(self.team_one.public_id, member.pk))
        )
        self.assertEqual(self.team_one.members.count(), 1)

    def test_event_list(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test GET
        response = self.client.get(
            reverse("event_list", args=(self.team_one.public_id,))
        )
        self.assertEqual(response.status_code, 200)

    def test_event_create(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test GET
        response = self.client.get(
            reverse("event_create", args=(self.team_one.public_id,))
        )
        self.assertEqual(response.status_code, 200)

        # TEST POST
        data = {
            "title": "Test Title 2",
            "team": self.team_one,
            "user": self.user_one,
            "description": "Test Description 2",
            "start_date": timezone.now(),
            "timezone": "US/Eastern",
            "location": "SF",
            "capacity": 100,
            "limit_per_person": 1,
            "requirements": [],
        }
        response = self.client.post(
            reverse("event_create", args=(self.team_one.public_id,)),
            data=data,
            follow=True,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Event.objects.filter(title="Test Title 2").count(), 1)

    def test_event_detail(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test GET (pending checkout)
        response = self.client.get(
            reverse("event_detail", args=(self.team_one.public_id, self.event_one.pk))
        )
        self.assertEqual(response.status_code, 302)

        # Test GET (succesful checkout)
        self.event_one.transition_live()
        self.event_one.save()
        response = self.client.get(
            reverse("event_stats", args=(self.team_one.public_id, self.event_one.pk))
        )
        self.assertEqual(response.status_code, 200)

    def test_event_update(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test GET
        response = self.client.get(
            reverse("event_update", args=(self.team_one.public_id, self.event_one.pk))
        )
        self.assertEqual(response.status_code, 200)

        # Create dictionary based on required fields
        fields = Event.required_form_fields()
        event_data = {
            key: self.event_one.__dict__[key]
            for key in fields
            if key in self.event_one.__dict__.keys()
        }

        # Update title
        event_data["title"] = "Updated Title"

        # TEST POST
        response = self.client.post(
            reverse("event_update", args=(self.team_one.public_id, self.event_one.pk)),
            data=event_data,
            follow=True,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Event.objects.filter(title="Updated Title").count(), 1)

    def test_event_stats(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test GET (pending checkout)
        response = self.client.get(
            reverse("event_stats", args=(self.team_one.public_id, self.event_one.pk))
        )
        self.assertEqual(response.status_code, 302)

        # Test GET (succesful checkout)
        self.event_one.transition_live()
        self.event_one.save()
        response = self.client.get(
            reverse("event_stats", args=(self.team_one.public_id, self.event_one.pk))
        )
        self.assertEqual(response.status_code, 200)

    def test_event_price_estimator(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test GET
        url = reverse("event_price_estimator", args=(self.team_one.public_id,))
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
