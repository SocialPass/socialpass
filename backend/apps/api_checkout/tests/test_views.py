from typing import Any
from uuid import uuid4

from django.test import TestCase
from rest_framework import status

from apps.root.factories import EventFactory, TicketTierFactory, UserWithTeamFactory
from apps.root.models import Event, Team, TicketTier
from apps.root.utilities.misc import prevent_warnings


class TestCaseWrapper(TestCase):
    user: Any
    team: Team
    event: Event
    ticket_tier: TicketTier
    url_base: str
    access_key: str

    @classmethod
    def setUpTestData(cls) -> None:
        cls.url_base = "/api/checkout/v1/"
        cls.user = UserWithTeamFactory()
        cls.team = cls.user.membership_set.first().team
        cls.event = EventFactory(team=cls.team, user=cls.user)
        cls.ticket_tier = TicketTierFactory(event=cls.event)
        return super().setUpTestData()


class GetEventTestCase(TestCaseWrapper):
    """
    class to test event list, retrieve and list ticket_tiers
    """

    @prevent_warnings
    def test_get_event_details_200(self) -> None:
        """
        test if retrieving event method its OK
        """
        event_public_id = self.event.public_id

        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.get(f"{self.url_base}event/{event_public_id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # assert objects values with json returned
        event_dict = response.json()
        self.assertEqual(event_dict["public_id"], str(self.event.public_id))
        self.assertEqual(event_dict["title"], self.event.title)
        self.assertEqual(event_dict["description"], self.event.description)
        self.assertEqual(event_dict["timezone"], self.event.timezone)
        self.assertEqual(
            event_dict["localized_address_display"],
            self.event.localized_address_display,
        )
        self.assertEqual(event_dict["capacity"], self.event.capacity)
        self.assertEqual(event_dict["cover_image"], self.event.cover_image.url)
        self.assertEqual(event_dict["show_ticket_count"], 1)
        self.assertEqual(event_dict["show_team_image"], self.event.show_team_image)
        self.assertEqual(event_dict["team"]["name"], self.team.name)

    @prevent_warnings
    def test_get_event_details_404(self):
        """
        test if returning not found to retrieve a nonexistent event
        """
        invalid_access_key = (
            uuid4()
        )  # Random UUID string that is not contained in the test DB.
        response = self.client.get(f"{self.url_base}event/{invalid_access_key}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @prevent_warnings
    def test_get_tickettiers_from_event_200(self):
        """
        test list ticket_tiers from event
        """
        event_public_id = self.event.public_id

        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.get(
            f"{self.url_base}event/{event_public_id}/ticket_tiers/"
        )

        ticket_tier_dict = response.json()[0]
        self.assertEqual(ticket_tier_dict["public_id"], str(self.ticket_tier.public_id))
        self.assertEqual(ticket_tier_dict["event_public_id"], str(self.event.public_id))
        self.assertEqual(ticket_tier_dict["ticket_type"], self.ticket_tier.ticket_type)
        self.assertEqual(ticket_tier_dict["capacity"], self.ticket_tier.capacity)
        self.assertEqual(
            ticket_tier_dict["max_per_person"], self.ticket_tier.max_per_person
        )

    @prevent_warnings
    def test_not_implemented_methods(self):
        """
        Request methods that were not implemented return 405 status code
        If the method is implemented then need to implement the test
        """

        url = f"{self.url_base}event/{self.event.public_id}/"

        # test post method
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        # test put method
        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        # test patch method
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        # test delete method
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
