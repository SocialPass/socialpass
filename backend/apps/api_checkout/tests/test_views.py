from datetime import timedelta
from typing import Any, Optional
from uuid import UUID, uuid4

from django.test import TestCase
from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.fields import empty

from apps.root.factories import (
    CheckoutItemFactory,
    CheckoutSessionFactory,
    EventFactory,
    TicketTierFactory,
    UserWithTeamFactory,
)
from apps.root.models import CheckoutItem, CheckoutSession, Event, Team, TicketTier
from apps.root.utilities.misc import prevent_warnings


class TestCaseWrapper(TestCase):
    user: Any
    team: Team
    event: Event
    ticket_tier: TicketTier
    url_base: str
    access_key: str
    checkout_item: CheckoutItem
    checkout_session: CheckoutSession
    random_uuid: UUID

    @classmethod
    def setUpTestData(cls) -> None:
        cls.url_base = "/api/checkout/v1/"
        cls.user = UserWithTeamFactory()
        cls.team = cls.user.membership_set.first().team
        cls.event = EventFactory(team=cls.team, user=cls.user)
        cls.ticket_tier = TicketTierFactory(event=cls.event, capacity=100)
        cls.checkout_session = CheckoutSessionFactory(event=cls.event)
        cls.checkout_item = CheckoutItemFactory(
            ticket_tier=cls.ticket_tier,
            checkout_session=cls.checkout_session,
            quantity=10,
        )
        cls.random_uuid = (
            uuid4()
        )  # Random UUID string that is not contained in the test DB.
        return super().setUpTestData()

    def assertSerializedDatetime(self, datetime_string, datetime_field, format=empty):
        self.assertEqual(
            datetime_string,
            serializers.DateTimeField(format=format).to_representation(datetime_field),
        )

    def assertUUID(self, uuid_string, version=4):
        try:
            UUID(uuid_string, version=version)
        except ValueError:
            raise AssertionError(f"{uuid_string} string is not a valid UUID")


class GetEventTestCase(TestCaseWrapper):
    """
    class to test event retrieve and list ticket_tiers
    """

    @prevent_warnings
    def test_get_event_details_200_ok(self) -> None:
        """
        request event detail and test if went OK
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
        self.assertSerializedDatetime(
            event_dict["start_date"], self.event.start_date, "%A, %B %d, %Y | %H:%M%p"
        )
        self.assertEqual(event_dict["team"]["name"], self.team.name)

    @prevent_warnings
    def test_get_event_details_404_not_found(self):
        """
        request detail nonexistent event and test if returning 404 NOT FOUND
        """

        response = self.client.get(f"{self.url_base}event/{self.random_uuid}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @prevent_warnings
    def test_get_tickettiers_from_event_200_ok(self):
        """
        request all tiers from an event and assert values
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
        request methods that were not implemented return 405 status code
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


class CheckoutItemViewTestCase(TestCaseWrapper):
    """
    class to test CheckoutItem retrieve, destroy, create and update view
    """

    def generate_item_data(
        self, tier: str, session: Optional[str] = None, quantity: int = 1
    ) -> dict:
        """
        creates dictionary item data
        """

        item_data = {
            "quantity": quantity,
            "ticket_tier": str(tier),
            "checkout_session": str(session),
        }

        return item_data

    @prevent_warnings
    def test_get_item_details_200_ok(self) -> None:
        """
        request GET retrieve item and test if return code 200 OK
        """
        item_public_id = self.checkout_item.public_id

        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.get(f"{self.url_base}item/{item_public_id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # assert objects values with json returned
        item_dict = response.json()
        self.assertEqual(item_dict["public_id"], str(self.checkout_item.public_id))
        self.assertEqual(item_dict["ticket_tier"], str(self.ticket_tier.public_id))
        self.assertEqual(
            item_dict["checkout_session"], str(self.checkout_session.public_id)
        )

    @prevent_warnings
    def test_get_item_details_404_not_found(self):
        """
        request nonexistent item detail and test if return 404 NOT FOUND
        """

        response = self.client.get(f"{self.url_base}item/{self.random_uuid}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @prevent_warnings
    def test_update_item_200_ok(self):
        """
        test PUT item went 200 OK
        """

        item_public_id = self.checkout_item.public_id
        data = {"quantity": 1}

        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.put(
            f"{self.url_base}item/{item_public_id}/",
            data=data,
            content_type="application/json",
        )
        # assert objects values with json returned
        item_dict = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(item_dict["public_id"], str(self.checkout_item.public_id))
        self.assertEqual(item_dict["ticket_tier"], str(self.ticket_tier.public_id))
        self.assertEqual(
            item_dict["checkout_session"], str(self.checkout_session.public_id)
        )
        self.assertEqual(item_dict["quantity"], data["quantity"])

    @prevent_warnings
    def test_update_higher_than_available_item_400_bad_request(self):
        """
        request PUT update item with quantity > available
            available = tier.capacity (100) - tier.quantity_sold (50) = 50
            try to update quantity to be 51 and getting 400 bad request
        """

        event = EventFactory(team=self.team, user=self.user)
        ticket_tier = TicketTierFactory(event=event, capacity=100, quantity_sold=50)
        checkout_session = CheckoutSessionFactory(
            event=event, expiration=timezone.now() + timedelta(days=3)
        )
        checkout_item = CheckoutItemFactory(
            ticket_tier=ticket_tier, checkout_session=checkout_session, quantity=30
        )
        data = {"quantity": 51}

        response = self.client.put(
            f"{self.url_base}item/{checkout_item.public_id}/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # verify if the value was not updated in the db
        checkout_item = CheckoutItem.objects.get(public_id=checkout_item.public_id)
        self.assertEqual(30, checkout_item.quantity)

    @prevent_warnings
    def test_create_item_201_created(self):
        """
        request POST create new item and assert if code 200 OK
        """

        data = self.generate_item_data(
            tier=self.ticket_tier.public_id, session=self.checkout_session.public_id
        )

        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.post(
            f"{self.url_base}item/",
            data=data,
            content_type="application/json",
        )
        # assert objects values with json returned
        item_dict = response.json()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertUUID(item_dict["public_id"], version=4)
        self.assertEqual(item_dict["ticket_tier"], str(self.ticket_tier.public_id))
        self.assertEqual(
            item_dict["checkout_session"], str(self.checkout_session.public_id)
        )
        self.assertEqual(item_dict["quantity"], data["quantity"])

    @prevent_warnings
    def test_fail_create_item_with_invalid_tier_404_not_found(self):
        """
        request POST create am item with nonexistent checkout_session
        assets if returning 404 NOT FOUND
        """

        # try to create with a nonexistent tier.public_id
        data = self.generate_item_data(
            tier=self.random_uuid, session=self.checkout_session.public_id
        )
        response = self.client.post(
            f"{self.url_base}item/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json()["code"], "public-id-not-found")

    @prevent_warnings
    def test_fail_create_item_with_invalid_session_404_not_found(self):
        """
        request POST create am item with nonexistent checkout_session
        assets if returning 404 NOT FOUND
        """

        # try to create with a nonexistent ticket_tier.public_id
        data = self.generate_item_data(
            tier=self.ticket_tier.public_id, session=self.random_uuid
        )
        response = self.client.post(
            f"{self.url_base}item/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json()["code"], "public-id-not-found")

    @prevent_warnings
    def test_create_higher_than_available_item_400_bad_request(self):
        """
        request POST create a new item with quantity > quantity available
        available = capacity (100) - quantity_sold (50) = 50
        asserts 400 bad request
        """

        event = EventFactory(team=self.team, user=self.user)
        ticket_tier = TicketTierFactory(event=event, capacity=100, quantity_sold=50)
        checkout_session = CheckoutSessionFactory(
            event=event, expiration=timezone.now() + timedelta(days=3)
        )

        data = self.generate_item_data(
            tier=ticket_tier.public_id, session=checkout_session.public_id, quantity=51
        )
        response = self.client.post(
            f"{self.url_base}item/",
            data=data,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # verify if the value was not created in the db
        checkout_item_qs = CheckoutItem.objects.filter(
            ticket_tier__public_id=ticket_tier.public_id,
            checkout_session__public_id=checkout_session.public_id,
        )
        self.assertFalse(checkout_item_qs.exists())

    @prevent_warnings
    def test_delete_item_204_no_content(self):
        """
        request delete an item and assert 404 no content
        """

        item_public_id = self.checkout_item.public_id

        response = self.client.delete(f"{self.url_base}item/{item_public_id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # verify if the checkout_item was deleted from the db
        with self.assertRaises(CheckoutItem.DoesNotExist):
            CheckoutItem.objects.get(public_id=item_public_id)
