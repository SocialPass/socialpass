from datetime import datetime
from django.test import TestCase
from django.test.client import RequestFactory
from django.urls import reverse

from apps.root.models import (
    CheckoutSession,
    Event,
    Team,
    Ticket,
    TicketTier,
)

from . import views


class TestCheckoutViews(TestCase):
    """
    Test the basic checkout views.
    """

    def setUp(self):
        self.factory = RequestFactory()
        self.team = Team.objects.create(
            name="testteam",
            allow_rsvp=True,
            allow_messaging=True,
        )
        self.event = Event.objects.create(
            team=self.team,
            title="Test event",
            description="Description",
            start_date=datetime(2024, 1, 1, 0, 0),
            timezone="US/Eastern",
            geo_type=Event.GeographyType.MANUAL,
            geo_address="Address",
        )
        self.ticket_tier_1 = TicketTier.objects.create(
            event=self.event,
            name="Test ticket tier 1",
            category=TicketTier.Category.FREE,
            capacity=100,
            guests_allowed=1,
        )
        self.ticket_tier_2 = TicketTier.objects.create(
            event=self.event,
            name="Test ticket tier 2",
            category=TicketTier.Category.FREE,
            capacity=50,
        )
        return super().setUp()

    def test_team_checkout_page_one_get(self):
        response = self.client.get(
            reverse(
                "checkout:checkout_one",
                args=(self.team.slug, self.event.slug),
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_team_checkout_page_one_post(self):
        response = self.client.post(
            reverse(
                "checkout:checkout_one",
                args=(self.team.slug, self.event.slug),
            ),
            data={
                "name": "Test 1",
                "email": "x@socialpass.io",
                "checkout_type": "FREE",
                "ticket_tier_data": f'[{{"id":"{self.ticket_tier_1.pk}","amount":"1","selected_guests":"1"}},{{"id":"{self.ticket_tier_2.pk}","amount":"1","selected_guests":"0"}}]',
            }
        )
        self.assertEqual(
            CheckoutSession.objects.filter(
                name="Test 1",
                email="x@socialpass.io",
            ).count(),
            1,
        )
        self.assertEqual(response.status_code, 302)



