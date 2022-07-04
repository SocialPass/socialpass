import uuid

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.contrib.messages.middleware import MessageMiddleware
from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import HttpResponse
from django.test import Client, RequestFactory, TestCase
from django.urls import reverse
from django.utils import timezone
from django.views.generic import DetailView, TemplateView

from apps.dashboard import forms, services, views
from apps.dashboard.models import Invite, Membership, PricingRule, Team
from apps.root.models import Event

User = get_user_model()


class EventDiscoveryTest(TestCase):
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
            "cover_image": SimpleUploadedFile(
                name="test_image.jpg", content=b"", content_type="image/jpeg"
            ),
        }
        self.event = Event.objects.create(**self.event_data)

        # Setup price
        services.set_event_price(event=self.event)
        services.issue_payment(event=self.event, stripe_checkout_session_id="12345")

    def test_discovery_index(self):
        # Test GET
        print("discovery")
        url = reverse("discovery:index")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_discovery_browse(self):
        # Test GET
        url = reverse("discovery:browse")
        response = self.client.get(url)

        # TODO: Test search / filters
        self.assertEqual(response.status_code, 200)

    def test_discovery_details(self):
        # Test GET
        url = reverse("discovery:details", args=(self.event.public_id,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
