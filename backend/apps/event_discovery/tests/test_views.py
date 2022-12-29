import logging

from django.contrib.auth import get_user_model
from django.test import RequestFactory, TestCase
from django.urls import reverse

from apps.root.factories import EventFactory, TicketTierFactory, UserWithTeamFactory

User = get_user_model()


class EventDiscoveryTest(TestCase):
    def setUp(self):
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

        # setup ticket tier for event
        self.ticket_tier = TicketTierFactory(event=self.event_one)

    def test_discovery_index(self):
        # Test GET
        url = reverse("discovery:index")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_discovery_browse(self):
        # Test GET (No live events)
        url = reverse("discovery:browse")
        response = self.client.get(url)
        self.assertEqual(response.context_data["events"].count(), 0)
        self.assertEqual(response.status_code, 200)

        # Test GET (2 live events)
        self.event_one.transition_live(ignore_google_api=True)
        self.event_two.transition_live(ignore_google_api=True)
        url = reverse("discovery:browse")
        response = self.client.get(url)
        self.assertEqual(response.context_data["events"].count(), 2)
        self.assertEqual(response.status_code, 200)

    def test_discovery_details(self):
        # Test GET (Not live)

        # Note: Disable 404 logging first
        # TODO:
        # This could be some form of decorator,
        # for test cases that require variable logging
        logger = logging.getLogger("django.request")
        previous_level = logger.getEffectiveLevel()
        logger.setLevel(logging.ERROR)

        url = reverse("discovery:details", args=(self.event_one.id,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

        # Re-enable logging
        logger.setLevel(previous_level)

        # Test GET (Live)
        self.event_one.transition_live(ignore_google_api=True)
        url = reverse("discovery:details", args=(self.event_one.id,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
