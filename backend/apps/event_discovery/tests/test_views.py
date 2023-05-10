import logging

from django.urls import reverse
from model_bakery import baker

from apps.root.testing import BaseTestCaseWrapper


class EventDiscoveryTest(BaseTestCaseWrapper):
    @classmethod
    def setUpTestData(cls):
        cls.event_one = baker.make("Event")

    def test_discovery_index(self):
        # Test GET
        url = reverse("discovery:index")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    """
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
    """

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
