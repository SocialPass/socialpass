from django.urls import reverse

from apps.root.testing import BaseTestCaseWrapper, prevent_warnings


class EventDiscoveryTest(BaseTestCaseWrapper):
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
        self.event.transition_live(ignore_google_api=True)
        self.event_two.transition_live(ignore_google_api=True)
        url = reverse("discovery:browse")
        response = self.client.get(url)
        self.assertEqual(response.context_data["events"].count(), 2)
        self.assertEqual(response.status_code, 200)
    """

    @prevent_warnings
    def test_discovery_details(self):
        # Test GET (Live)
        url = reverse("discovery:details", args=(self.event.id,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        # Test GET (Draft)
        self.event.transition_draft()
        url = reverse("discovery:details", args=(self.event.id,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
