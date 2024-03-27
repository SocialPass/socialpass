from datetime import datetime
from django.contrib.auth.models import AnonymousUser
from django.http import Http404
from django.test import TestCase
from django.test.client import RequestFactory
from django.urls import reverse

from apps.root.models import (
	CheckoutSession,
	Event,
	Membership,
	RSVPBatch,
	Team,
	Ticket,
	TicketTier,
	User,
)

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
		)
		self.non_member = User.objects.create_user(
			username="testuser2",
			email="testuser2@example.com",
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


class TestEventListCreateViews(TestCase):
	"""
	Test the event list and create views.
	"""

	def setUp(self):
		self.factory = RequestFactory()
		self.team = Team.objects.create(
			name="testteam",
		)
		self.user = User.objects.create_user(
			username="testuser",
			email="testuser@example.com",
		)
		self.user.set_password("password")
		self.user.save()
		self.membership = Membership.objects.create(
			team=self.team,
			user=self.user,
		)
		return super().setUp()

	def test_event_list_get(self):
		self.assertTrue(
			self.client.login(username=self.user.username, password="password")
		)
		response = self.client.get(
			reverse(
				"dashboard_organizer:event_list",
				args=(self.team.slug,)
			)
		)
		self.assertEqual(response.status_code, 200)

	def test_event_create_get(self):
		self.assertTrue(
			self.client.login(username=self.user.username, password="password")
		)
		response = self.client.get(
			reverse(
				"dashboard_organizer:event_create",
				args=(self.team.slug,)
			)
		)
		self.assertEqual(response.status_code, 200)

	def test_event_create_post(self):
		self.assertTrue(
			self.client.login(username=self.user.username, password="password")
		)
		response = self.client.post(
			reverse(
				"dashboard_organizer:event_create",
				args=(self.team.slug,)
			),
			data={
				"team": self.team,
				"title": "Test event create post",
				"description": "Description",
				"start_date": datetime(2024, 1, 1, 0, 0),
				"timezone": "US/Eastern",
				"geo_type": Event.GeographyType.MANUAL,
				"geo_address": "Address",
			},
			follow=True,
		)
		self.assertEqual(
			Event.objects.filter(
				team=self.team,
				title="Test event create post",
			).count(), 1
		)
		self.assertEqual(response.status_code, 200)


class TestEventDetailViews(TestCase):
	"""
	Test the event detail views.
	"""

	def setUp(self):
		self.factory = RequestFactory()
		self.team = Team.objects.create(
			name="testteam",
			allow_rsvp=True,
			allow_messaging=True,
		)
		self.user = User.objects.create_user(
			username="testuser",
			email="testuser@example.com",
		)
		self.user.set_password("password")
		self.user.save()
		self.membership = Membership.objects.create(
			team=self.team,
			user=self.user,
		)
		self.event = Event.objects.create(
			team=self.team,
			title="Test event detail",
			description="Description",
			start_date=datetime(2024, 1, 1, 0, 0),
			timezone="US/Eastern",
			geo_type=Event.GeographyType.MANUAL,
			geo_address="Address",
		)
		self.ticket_tier = TicketTier.objects.create(
			event=self.event,
			name="Test ticket tier",
			category=TicketTier.Category.FREE,
		)
		return super().setUp()

	def test_event_update_get(self):
		self.assertTrue(
			self.client.login(username=self.user.username, password="password")
		)
		response = self.client.get(
			reverse(
				"dashboard_organizer:event_update",
				args=(self.team.slug, self.event.pk)
			)
		)
		self.assertEqual(response.status_code, 200)

	def test_event_update_post(self):
		self.assertTrue(
			self.client.login(username=self.user.username, password="password")
		)
		response = self.client.post(
			reverse(
				"dashboard_organizer:event_update",
				args=(self.team.slug, self.event.pk)
			),
			data={
				"title": "Test event detail edit", # Edited
				"description": "Description",
				"start_date": datetime(2024, 1, 1, 0, 0),
				"timezone": "US/Eastern",
				"geo_type": Event.GeographyType.MANUAL,
				"geo_address": "Address", # Edited
			},
			follow=True,
		)
		self.assertEqual(response.status_code, 200)

	def test_event_stats_get(self):
		self.assertTrue(
			self.client.login(username=self.user.username, password="password")
		)
		response = self.client.get(
			reverse(
				"dashboard_organizer:event_stats",
				args=(self.team.slug, self.event.pk)
			)
		)
		self.assertEqual(response.status_code, 200)

	def test_event_promote_get(self):
		self.assertTrue(
			self.client.login(username=self.user.username, password="password")
		)
		response = self.client.get(
			reverse(
				"dashboard_organizer:event_promote",
				args=(self.team.slug, self.event.pk)
			)
		)
		self.assertEqual(response.status_code, 200)

	def test_event_check_in_guests_get(self):
		self.assertTrue(
			self.client.login(username=self.user.username, password="password")
		)
		response = self.client.get(
			reverse(
				"dashboard_organizer:event_check_in_guests",
				args=(self.team.slug, self.event.pk)
			)
		)
		self.assertEqual(response.status_code, 200)

	def test_event_rsvp_get(self):
		self.assertTrue(
			self.client.login(username=self.user.username, password="password")
		)
		response = self.client.get(
			reverse(
				"dashboard_organizer:rsvp_tickets",
				args=(self.team.slug, self.event.pk)
			)
		)
		self.assertEqual(response.status_code, 200)

	def test_event_rsvp_post(self):
		self.assertTrue(
			self.client.login(username=self.user.username, password="password")
		)
		response = self.client.post(
			reverse(
				"dashboard_organizer:rsvp_create_tickets",
				args=(self.team.slug, self.event.pk)
			),
			data={
				"ticket_tier": self.ticket_tier.pk,
				"guests_allowed": 0,
				"customer_emails": "x@socialpass.io, y@socialpass.io",
			},
			follow=True,
		)
		self.assertEqual(
			RSVPBatch.objects.filter(event=self.event).count(), 1
		)
		self.assertEqual(
			Ticket.objects.filter(
				event=self.event,
				ticket_tier=self.ticket_tier
			).count(), 2
		)
		self.assertEqual(response.status_code, 200)
