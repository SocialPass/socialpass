from django.contrib import auth
from django.contrib.auth.models import AnonymousUser
from django.http import Http404
from django.test import TestCase
from django.test.client import RequestFactory

from apps.root.models import Membership, Team, User

from . import views

class TestTeamContextMixin(TestCase):
	"""
	Test the team context mixin to make sure the permissions system is working 
	properly. We use the event list view as that is the entry-point of the 
	organizer dashboard.
	"""

	def setUp(self):
		self.factory = RequestFactory()
		self.team = Team.objects.create(
			name="testteam",
		)
		self.member = User.objects.create_user(
			username="testuser1",
			email="testuser1@example.com",
			password="password",
		)
		self.non_member = User.objects.create_user(
			username="testuser2",
			email="testuser2@example.com",
			password="password",
		)
		self.membership = Membership.objects.create(
			team=self.team,
			user=self.member,
		)
		return super().setUp()

	def test_entry_point_with_anon(self):
		kwargs = { "team_slug": self.team.slug }
		request = self.factory.get(f"/dashboard/{self.team.slug}/events/")
		request.user = AnonymousUser()
		response = views.EventListView.as_view()(request, **kwargs)
		self.assertEqual(response.status_code, 302)

	def test_entry_point_with_member(self):
		kwargs = { "team_slug": self.team.slug }
		request = self.factory.get(f"/dashboard/{self.team.slug}/events/")
		request.user = self.member
		response = views.EventListView.as_view()(request, **kwargs)
		self.assertEqual(response.status_code, 200)

	def test_entry_point_with_non_member(self):
		kwargs = { "team_slug": self.team.slug }
		request = self.factory.get(f"/dashboard/{self.team.slug}/events/")
		request.user = self.non_member
		try:
			response = views.EventListView.as_view()(request, **kwargs)
		except Exception as e:
			self.assertEqual(type(e), Http404)
