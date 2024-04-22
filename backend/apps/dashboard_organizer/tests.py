from datetime import datetime
from django.contrib.auth.models import AnonymousUser
from django.core import mail
from django.http import Http404
from django.test import TestCase, TransactionTestCase
from django.test.client import RequestFactory
from django.urls import reverse
from django.utils import timezone

from apps.root.models import (
    Event,
    Invitation,
    Membership,
    MessageBatch,
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
        kwargs = {"team_slug": self.team.slug}
        request = self.factory.get(f"/dashboard/{self.team.slug}/events/")
        request.user = AnonymousUser()
        response = views.EventListView.as_view()(request, **kwargs)
        self.assertEqual(response.status_code, 302)

    def test_entry_point_with_member(self):
        kwargs = {"team_slug": self.team.slug}
        request = self.factory.get(f"/dashboard/{self.team.slug}/events/")
        request.user = self.member
        response = views.EventListView.as_view()(request, **kwargs)
        self.assertEqual(response.status_code, 200)

    def test_entry_point_with_non_member(self):
        kwargs = {"team_slug": self.team.slug}
        request = self.factory.get(f"/dashboard/{self.team.slug}/events/")
        request.user = self.non_member
        try:
            views.EventListView.as_view()(request, **kwargs)
        except Exception as e:
            self.assertEqual(type(e), Http404)


class TestTeamViews(TestCase):
    """
    Test team create, details, and update views.
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

    def test_team_create_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(reverse("dashboard_organizer:team_create"))
        self.assertEqual(response.status_code, 200)

    def test_team_create_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.post(
            reverse("dashboard_organizer:team_create"),
            data={
                "name": "testteam2",
                "description": "Description",
            },
        )
        self.assertEqual(Team.objects.all().count(), 2)
        self.assertEqual(Membership.objects.all().count(), 2)
        self.assertEqual(response.status_code, 302)

    def test_team_detail_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse("dashboard_organizer:team_detail", args=(self.team.slug,))
        )
        self.assertEqual(response.status_code, 200)

    def test_team_update_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse("dashboard_organizer:team_update", args=(self.team.slug,))
        )
        self.assertEqual(response.status_code, 200)

    def test_team_update_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.post(
            reverse("dashboard_organizer:team_update", args=(self.team.slug,)),
            data={
                "name": "testteam edit",
                "description": "Description edit",
            },
        )
        team = Team.objects.get(name="testteam edit")
        self.assertEqual(team.description, "Description edit")
        self.assertEqual(response.status_code, 302)


class TestEventListCreateDeleteViews(TestCase):
    """
    Test the event list, create, and delete views.
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
        self.event_to_delete = Event.objects.create(
            team=self.team,
            title="Test event to delete",
            description="Description",
            start_date=datetime(2024, 1, 1, 0, 0),
            timezone="US/Eastern",
            geo_type=Event.GeographyType.MANUAL,
            geo_address="Address",
        )
        return super().setUp()

    def test_event_list_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse("dashboard_organizer:event_list", args=(self.team.slug,))
        )
        self.assertEqual(response.status_code, 200)

    def test_event_create_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse("dashboard_organizer:event_create", args=(self.team.slug,))
        )
        self.assertEqual(response.status_code, 200)

    def test_event_create_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.post(
            reverse("dashboard_organizer:event_create", args=(self.team.slug,)),
            data={
                "team": self.team,
                "title": "Test event create post",
                "description": "Description",
                "start_date": datetime(2024, 1, 1, 0, 0),
                "timezone": "US/Eastern",
                "geo_type": Event.GeographyType.MANUAL,
                "geo_address": "Address",
            },
        )
        self.assertEqual(
            Event.objects.filter(
                team=self.team,
                title="Test event create post",
            ).count(),
            1,
        )
        self.assertEqual(response.status_code, 302)

    def test_event_delete_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse(
                "dashboard_organizer:event_delete",
                args=(self.team.slug, self.event_to_delete.pk),
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_event_delete_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.post(
            reverse(
                "dashboard_organizer:event_delete",
                args=(self.team.slug, self.event_to_delete.pk),
            ),
        )
        self.assertEqual(
            Event.objects.filter(
                team=self.team,
                title="Test event to delete",
            ).count(),
            0,
        )
        self.assertEqual(response.status_code, 302)


class TestEventDetailViews(TransactionTestCase):
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
                "dashboard_organizer:event_update", args=(self.team.slug, self.event.pk)
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_event_update_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.post(
            reverse(
                "dashboard_organizer:event_update", args=(self.team.slug, self.event.pk)
            ),
            data={
                "title": "Test event detail edit",  # Edited
                "description": "Description",
                "start_date": datetime(2024, 1, 1, 0, 0),
                "timezone": "US/Eastern",
                "geo_type": Event.GeographyType.MANUAL,
                "geo_address": "Address edit",  # Edited
            },
        )
        event = Event.objects.get(title="Test event detail edit")
        self.assertEqual(event.geo_address, "Address edit")
        self.assertEqual(response.status_code, 302)

    def test_event_stats_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse(
                "dashboard_organizer:event_stats", args=(self.team.slug, self.event.pk)
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_event_waitlist_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse("dashboard_organizer:waitlist", args=(self.team.slug, self.event.pk))
        )
        self.assertEqual(response.status_code, 200)

    def test_event_share_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse(
                "dashboard_organizer:event_share", args=(self.team.slug, self.event.pk)
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
                args=(self.team.slug, self.event.pk),
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_event_rsvp_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse(
                "dashboard_organizer:rsvp_tickets", args=(self.team.slug, self.event.pk)
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
                args=(self.team.slug, self.event.pk),
            ),
            data={
                "ticket_tier": self.ticket_tier.pk,
                "guests_allowed": 0,
                "customer_emails": "x@socialpass.io, y@socialpass.io",
            },
        )
        # Run worker, complete RSVP task
        from procrastinate.contrib.django import app
        app = app.with_connector(app.connector.get_worker_connector())
        app.run_worker(wait=False, install_signal_handlers=False, listen_notify=True)

        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(mail.outbox[0].to, ["x@socialpass.io"])
        self.assertEqual(mail.outbox[1].to, ["y@socialpass.io"])
        self.assertEqual(RSVPBatch.objects.filter(event=self.event).count(), 1)
        self.assertEqual(
            Ticket.objects.filter(event=self.event, ticket_tier=self.ticket_tier).count(),
            2,
        )
        self.assertEqual(response.status_code, 302)

    def test_event_messaging_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse(
                "dashboard_organizer:message_batches", args=(self.team.slug, self.event.pk)
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_event_messaging_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.post(
            reverse(
                "dashboard_organizer:message_batch_create",
                args=(self.team.slug, self.event.pk),
            ),
            data={
                "ticket_tier": self.ticket_tier.pk,
                "subject": "Subject",
                "message": "Message",
            },
        )
        # Run worker, complete message batch task
        from procrastinate.contrib.django import app
        app = app.with_connector(app.connector.get_worker_connector())
        app.run_worker(wait=False, install_signal_handlers=False, listen_notify=True)

        self.assertEqual(len(mail.outbox), 0)
        self.assertEqual(MessageBatch.objects.filter(event=self.event).count(), 1)
        self.assertEqual(response.status_code, 302)


class TestTicketTierViews(TestCase):
    """
    Test ticket tier list, create, update and delete.
    """

    def setUp(self):
        self.factory = RequestFactory()
        self.team = Team.objects.create(
            name="testteam",
            stripe_account_id="acct_1NadTgR6q1S0w5XG",
            stripe_account_country="US",
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
            title="Test event",
            description="Description",
            start_date=datetime(2024, 1, 1, 0, 0),
            timezone="US/Eastern",
            geo_type=Event.GeographyType.MANUAL,
            geo_address="Address",
        )
        self.ticket_tier_to_update = TicketTier.objects.create(
            event=self.event,
            name="Ticket tier to update",
            category=TicketTier.Category.FIAT,
        )
        self.ticket_tier_to_delete = TicketTier.objects.create(
            event=self.event,
            name="Ticket tier to delete",
            category=TicketTier.Category.ASSET_OWNERSHIP,
        )
        return super().setUp()

    def test_ticket_tier_list_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse(
                "dashboard_organizer:event_tickets", args=(self.team.slug, self.event.pk)
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_ticket_tier_list_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        now = timezone.now()
        response = self.client.post(
            reverse(
                "dashboard_organizer:event_tickets", args=(self.team.slug, self.event.pk)
            ),
            data={
                "sales_start": now,
                "total_capacity": 100,
                "waitlist_enabled": True,
            },
        )
        event = Event.objects.get(pk=self.event.pk)
        self.assertEqual(event.sales_start, now)
        self.assertEqual(event.total_capacity, 100)
        self.assertEqual(event.waitlist_enabled, True)
        self.assertEqual(response.status_code, 302)

    def test_ticket_tier_create_free_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse(
                "dashboard_organizer:ticket_tier_free_create",
                args=(self.team.slug, self.event.pk),
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_ticket_tier_create_free_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.post(
            reverse(
                "dashboard_organizer:ticket_tier_free_create",
                args=(self.team.slug, self.event.pk),
            ),
            data={
                "name": "Free",
                "capacity": 200,
                "max_per_person": 1,
                "guests_allowed": 1,
                "guest_supply": 10,
                "hidden_from_public": False,
                "hidden_availability": False,
                "additional_information": "Additional",
            },
        )
        self.assertEqual(
            TicketTier.objects.filter(event=self.event, name="Free").count(), 1
        )
        self.assertEqual(response.status_code, 302)

    def test_ticket_tier_create_fiat_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse(
                "dashboard_organizer:ticket_tier_fiat_create",
                args=(self.team.slug, self.event.pk),
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_ticket_tier_create_fiat_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.post(
            reverse(
                "dashboard_organizer:ticket_tier_fiat_create",
                args=(self.team.slug, self.event.pk),
            ),
            data={
                "name": "Paid",
                "capacity": 200,
                "max_per_person": 1,
                "guests_allowed": 1,
                "guest_supply": 10,
                "hidden_from_public": False,
                "hidden_availability": False,
                "additional_information": "Additional",
                "price_per_ticket": 20.00,
            },
        )
        self.assertEqual(
            TicketTier.objects.filter(event=self.event, name="Paid").count(), 1
        )
        self.assertEqual(response.status_code, 302)

    def test_ticket_tier_create_nft_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse(
                "dashboard_organizer:ticket_tier_nft_create",
                args=(self.team.slug, self.event.pk),
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_ticket_tier_create_nft_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.post(
            reverse(
                "dashboard_organizer:ticket_tier_nft_create",
                args=(self.team.slug, self.event.pk),
            ),
            data={
                "name": "NFT",
                "capacity": 200,
                "max_per_person": 1,
                "guests_allowed": 1,
                "guest_supply": 10,
                "hidden_from_public": False,
                "hidden_availability": False,
                "additional_information": "Additional",
                "balance_required": 1,
                "network": TicketTier.NetworkChoices.ETH,
                "token_address": "0xb794f5ea0ba39494ce839613fffba74279579268",
            },
        )
        self.assertEqual(
            TicketTier.objects.filter(event=self.event, name="NFT").count(), 1
        )
        self.assertEqual(response.status_code, 302)

    def test_ticket_tier_update_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse(
                "dashboard_organizer:ticket_tier_update",
                args=(self.team.slug, self.event.pk, self.ticket_tier_to_update.pk),
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_ticket_tier_update_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        data = {
            "name": "Edit",
            "capacity": 100,
            "max_per_person": 2,
            "guests_allowed": 1,
            "guest_supply": 50,
            "hidden_from_public": True,
            "hidden_availability": True,
            "additional_information": "Additional",
        }
        response = self.client.post(
            reverse(
                "dashboard_organizer:ticket_tier_update",
                args=(self.team.slug, self.event.pk, self.ticket_tier_to_update.pk),
            ),
            data=data,
        )
        ticket_tier = TicketTier.objects.get(pk=self.ticket_tier_to_update.pk)
        self.assertEqual(
            {
                "name": ticket_tier.name,
                "capacity": ticket_tier.capacity,
                "max_per_person": ticket_tier.max_per_person,
                "guests_allowed": ticket_tier.guests_allowed,
                "guest_supply": ticket_tier.guest_supply,
                "hidden_from_public": ticket_tier.hidden_from_public,
                "hidden_availability": ticket_tier.hidden_availability,
                "additional_information": ticket_tier.additional_information,
            },
            data,
        )
        self.assertEqual(response.status_code, 302)

    def test_ticket_tier_delete_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse(
                "dashboard_organizer:ticket_tier_delete",
                args=(self.team.slug, self.event.pk, self.ticket_tier_to_delete.pk),
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_ticket_tier_delete_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.post(
            reverse(
                "dashboard_organizer:ticket_tier_delete",
                args=(self.team.slug, self.event.pk, self.ticket_tier_to_delete.pk),
            ),
        )
        self.assertEqual(
            TicketTier.objects.filter(name="Ticket tier to delete").count(), 0
        )
        self.assertEqual(response.status_code, 302)


class TestMiscViews(TestCase):
    """
    Test misc. views such as manage members, delete member, payment details, etc.
    """

    def setUp(self):
        self.factory = RequestFactory()
        self.team = Team.objects.create(
            name="testteam",
        )
        self.user = User.objects.create_user(
            username="testuser1",
            email="testuser1@example.com",
        )
        self.user.set_password("password")
        self.user.save()
        self.membership = Membership.objects.create(
            team=self.team,
            user=self.user,
        )
        self.member_to_delete = User.objects.create_user(
            username="testuser2",
            email="testuser2@example.com",
        )
        Membership.objects.create(
            team=self.team,
            user=self.member_to_delete,
        )
        return super().setUp()

    def test_manage_members_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse("dashboard_organizer:team_members", args=(self.team.slug,))
        )
        self.assertEqual(response.status_code, 200)

    def test_manage_members_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.post(
            reverse("dashboard_organizer:team_members", args=(self.team.slug,)),
            data={"email": "x@socialpass.io"},
        )
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["x@socialpass.io"])
        self.assertEqual(Invitation.objects.filter(team=self.team).count(), 1)
        self.assertEqual(response.status_code, 302)

    def test_member_delete_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse(
                "dashboard_organizer:team_member_delete",
                args=(self.team.slug, self.member_to_delete.pk),
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_member_delete_post(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.post(
            reverse(
                "dashboard_organizer:team_member_delete",
                args=(self.team.slug, self.member_to_delete.pk),
            ),
        )
        self.assertEqual(Membership.objects.filter(team=self.team).count(), 1)
        self.assertEqual(response.status_code, 302)

    def payment_detail_get(self):
        self.assertTrue(
            self.client.login(username=self.user.username, password="password")
        )
        response = self.client.get(
            reverse("dashboard_organizer:payment_detail", args=(self.team.slug,))
        )
        self.assertEqual(response.status_code, 200)
