from datetime import datetime
from django.core import mail
from django.test import TestCase
from django.test.client import RequestFactory
from django.urls import reverse

from apps.root.models import (
    CheckoutItem,
    CheckoutSession,
    Event,
    Team,
    Ticket,
    TicketTier,
)


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
        self.session_to_fulfill = CheckoutSession.objects.create(
            event=self.event,
            name="Test fulfill",
            email="x@socialpass.io",
            session_type=CheckoutSession.SessionType.FREE,
        )
        CheckoutItem.objects.create(
            ticket_tier=self.ticket_tier_1,
            checkout_session=self.session_to_fulfill,
            quantity=1,
            selected_guests=1,
        )
        self.session_fulfilled = CheckoutSession.objects.create(
            event=self.event,
            name="Fulfilled",
            email="y@socialpass.io",
            session_type=CheckoutSession.SessionType.FREE,
            order_status=CheckoutSession.OrderStatus.FULFILLED,
        )
        return super().setUp()

    def test_team_checkout_one_get(self):
        response = self.client.get(
            reverse(
                "checkout:checkout_one",
                args=(self.team.slug, self.event.slug),
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_team_checkout_one_post(self):
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
            },
        )
        self.assertEqual(
            CheckoutSession.objects.filter(
                name="Test 1",
                email="x@socialpass.io",
            ).count(),
            1,
        )
        self.assertEqual(response.status_code, 302)

    def test_team_checkout_two_get(self):
        response = self.client.get(
            reverse(
                "checkout:checkout_two",
                args=(self.team.slug, self.event.slug, self.session_to_fulfill.public_id),
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_team_checkout_two_post(self):
        response = self.client.post(
            reverse(
                "checkout:checkout_two",
                args=(self.team.slug, self.event.slug, self.session_to_fulfill.public_id),
            ),
            data={
                "name": "Test fulfill",
                "email": "x@socialpass.io",
            },
        )
        checkout_session = CheckoutSession.objects.get(pk=self.session_to_fulfill.pk)
        tickets = Ticket.objects.filter(checkout_session=checkout_session)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["x@socialpass.io"])
        self.assertEqual(
            checkout_session.order_status, CheckoutSession.OrderStatus.FULFILLED
        )
        self.assertEqual(tickets.count(), 1)
        self.assertEqual(response.status_code, 302)

    def test_team_checkout_success_get(self):
        response = self.client.get(
            reverse(
                "checkout:checkout_success",
                args=(self.team.slug, self.event.slug, self.session_fulfilled.public_id),
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_get_tickets_get(self):
        response = self.client.get(
            reverse(
                "checkout:get_tickets",
                args=(self.session_fulfilled.public_id,),
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_get_tickets_post_submit_passcode(self):
        response = self.client.post(
            reverse(
                "checkout:get_tickets",
                args=(self.session_fulfilled.public_id,),
            ),
            data={
                "passcode": self.session_fulfilled.passcode,
                "passcode_submit": True
            },
        )
        self.assertEqual(response.context['passcode_form'].is_valid(), True)
        self.assertEqual(response.status_code, 200)  # No redirect here

    def test_get_tickets_post_resend_passcode(self):
        response = self.client.post(
            reverse(
                "checkout:get_tickets",
                args=(self.session_fulfilled.public_id,),
            ),
            data={
                "resend_passcode": True
            },
        )
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["y@socialpass.io"])
        self.assertEqual(response.status_code, 200)  # No redirect here
