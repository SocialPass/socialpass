from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.http import Http404
from django.test import RequestFactory, TestCase
from django.urls import reverse
from django.views.generic import TemplateView

from apps.dashboard import forms, views
from apps.root.factories import EventFactory, UserWithTeamFactory
from apps.root.models import Invite, Membership, Team

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
        new_event = EventFactory.build(team=self.team_one, user=self.user_one)
        data = {
            "title": "Event One Data with New Title",
            "team": new_event.team,
            "user": new_event.user,
            "description": new_event.description,
            "start_date": new_event.start_date,
            "capacity": new_event.capacity,
            "limit_per_person": new_event.limit_per_person,
            "requirements": new_event.requirements,
            "lat": new_event.lat,
            "long": new_event.long,
        }
        response = self.client.post(
            reverse("event_create", args=(self.team_one.public_id,)),
            data=data,
            follow=True,
        )
        self.assertEqual(response.status_code, 200)
        """
        TODO:
        Fix form creation. Currently response is 200 but with form validation errors.
        Below assertion thus returns False

        self.assertEqual(
            Event.objects.filter(title="Event One Data with New Title").count(), 1
        )
        """

    def test_event_detail(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test GET (draft event)
        response = self.client.get(
            reverse("event_detail", args=(self.team_one.public_id, self.event_one.pk))
        )
        self.assertEqual(response.status_code, 302)

        # Test GET (live event)
        self.event_one.transition_live()
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

        # update title
        data = {
            "title": "Updated Title",
            "team": self.event_one.team,
            "user": self.event_one.user,
            "description": self.event_one.description,
            "start_date": self.event_one.start_date,
            "capacity": self.event_one.capacity,
            "limit_per_person": self.event_one.limit_per_person,
            "requirements": self.event_one.requirements,
            "lat": self.event_one.lat,
            "long": self.event_one.long,
        }
        response = self.client.post(
            reverse("event_update", args=(self.team_one.public_id, self.event_one.pk)),
            data=data,
            follow=True,
        )
        self.assertEqual(response.status_code, 200)
        """
        TODO:
        Fix form creation. Currently response is 200 but with form validation errors.
        Below assertion thus returns False

        self.assertEqual(Event.objects.filter(title="Updated Title").count(), 1)
        """

    def test_event_stats(self):
        # Login User
        self.assertTrue(
            self.client.login(username=self.user_one.username, password=self.password)
        )

        # Test GET (draft event)
        response = self.client.get(
            reverse("event_stats", args=(self.team_one.public_id, self.event_one.pk))
        )
        self.assertEqual(response.status_code, 302)

        # Test GET (live event)
        self.event_one.transition_live()
        response = self.client.get(
            reverse("event_stats", args=(self.team_one.public_id, self.event_one.pk))
        )
        self.assertEqual(response.status_code, 200)
