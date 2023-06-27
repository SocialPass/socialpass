from typing import Optional
from uuid import UUID, uuid4

import faker
from rest_framework import serializers, status
from rest_framework.fields import empty

from apps.root.models import CheckoutItem, CheckoutSession, Ticket
from apps.root.testing import BaseTestCaseWrapper, prevent_warnings


class TestCaseWrapper(BaseTestCaseWrapper):
    random_uuid: UUID

    def setUp(self):
        self.url_base = "/api/checkout/v1/"
        self.random_uuid = (
            uuid4()
        )  # Random UUID string that is not contained in the test DB.
        return super().setUp()

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
        self.assertSerializedDatetime(
            event_dict["start_date"], self.event.start_date, "%a, %b %d, %Y | %H:%M %p"
        )
        self.assertEqual(event_dict["team"]["name"], self.team_one.name)

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

    def request_create_item(self, data: dict):
        """
        request POST to item endpoint
        """
        # Not using reverse because we want URL changes to explicitly break tests.
        return self.client.post(
            f"{self.url_base}item/",
            data=data,
            content_type="application/json",
        )

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
        self.assertEqual(
            item_dict["ticket_tier"]["public_id"], str(self.ticket_tier.public_id)
        )
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
        # capacity
        ticket_tier = self.event.tickettier_set.first()
        ticket_tier.capacity = 100
        ticket_tier.save()

        # generate tickets
        checkout_session = self.event.checkoutsession_set.first()
        checkout_item = checkout_session.checkoutitem_set.first()
        ticket_keys = {
            "checkout_session": checkout_session,
            "event": self.event,
            "ticket_tier": ticket_tier,
            "checkout_item": checkout_item,
        }
        tickets = [Ticket(**ticket_keys) for _ in range(51)]
        Ticket.objects.bulk_create(tickets)
        data = {"quantity": 51}

        response = self.client.put(
            f"{self.url_base}item/{checkout_item.public_id}/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # verify if the value was not updated in the db
        _checkout_item = CheckoutItem.objects.get(public_id=checkout_item.public_id)
        self.assertEqual(checkout_item.modified, _checkout_item.modified)

    @prevent_warnings
    def test_create_item_201_created(self):
        """
        request POST create new item and assert if code 200 OK
        """

        # ensure there is no item related to the session
        self.checkout_session.checkoutitem_set.all().delete()
        # generate dummy item data
        data = self.generate_item_data(
            tier=self.ticket_tier.public_id, session=self.checkout_session.public_id
        )
        response = self.request_create_item(data)
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
    def test_create_item_tickettier_already_existing_400_bad_request(self):
        """
        request POST create new item in a session that already have a item
        for the ticket_tier (must return validation error)
        """

        data = self.generate_item_data(
            tier=self.ticket_tier.public_id, session=self.checkout_session.public_id
        )
        response = self.request_create_item(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @prevent_warnings
    def test_create_item_conflict_tiers_400_bad_request(self):
        """
        test create item with ticket_tier.tier that must
        conflict with the parent checkout_session.tx_type
        must return 400 bad request
        """

        # ensure there is no item related to the session
        self.checkout_session.checkoutitem_set.all().delete()
        # generate dummy item data
        data = self.generate_item_data(
            tier=self.ticket_tier.public_id, session=self.checkout_session.public_id
        )

        self.ticket_tier.tier_fiat = None
        self.ticket_tier.tier_asset_ownership = None
        self.ticket_tier.tier_blockchain = None
        self.ticket_tier.save()

        # test if return 400 bad request if not tier FIAT available
        self.checkout_session.tx_type = CheckoutSession.TransactionType.FIAT
        self.checkout_session.save()
        response = self.request_create_item(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        error_msg = response.json()
        self.assertIn("ticket_tier does not support fiat", error_msg["ticket_tier"])

        # test if return 400 bad request if not tier BLOCKCHAIN available
        self.checkout_session.tx_type = CheckoutSession.TransactionType.BLOCKCHAIN
        self.checkout_session.save()
        response = self.request_create_item(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        error_msg = response.json()
        self.assertIn(
            "ticket_tier does not support blockchain", error_msg["ticket_tier"]
        )

        # test if return 400 bad request if not tier ASSET_OWNERSHIP available
        self.checkout_session.tx_type = CheckoutSession.TransactionType.ASSET_OWNERSHIP
        self.checkout_session.save()
        response = self.request_create_item(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        error_msg = response.json()
        self.assertIn(
            "ticket_tier does not support asset ownership", error_msg["ticket_tier"]
        )

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
        response = self.request_create_item(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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
        response = self.request_create_item(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @prevent_warnings
    def test_create_higher_than_available_item_400_bad_request(self):
        """
        request POST create a new item with quantity > quantity available
        available = capacity (100) - quantity_sold (50) = 50
        asserts 400 bad request
        """
        # set capacity
        ticket_tier = self.event.tickettier_set.first()
        ticket_tier.capacity = 100
        ticket_tier.save()
        checkout_session = self.event.checkoutsession_set.first()

        data = self.generate_item_data(
            tier=ticket_tier.public_id, session=checkout_session.public_id, quantity=51
        )
        response = self.request_create_item(data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # verify if the value was not created in the db
        new_checkout_item_qs = CheckoutItem.objects.filter(
            ticket_tier=ticket_tier,
            checkout_session=checkout_session,
            quantity=51,
        )
        self.assertFalse(new_checkout_item_qs)

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


class CheckoutSessionViewTestCase(TestCaseWrapper):
    """
    class to test CheckoutSession retrieve, create and list items view
    """

    def generate_session_data(
        self, event: str, tier: Optional[str] = None, quantity: int = 1
    ) -> dict:
        """
        generates session dictionary with fake name and email, event and items
        """
        fake = faker.Faker()

        items = [{"quantity": quantity, "ticket_tier": str(tier)}] if tier else []
        session_data = {
            "name": fake.name(),
            "email": fake.email(),
            "tx_status": CheckoutSession.OrderStatus.VALID,
            "tx_type": CheckoutSession.TransactionType.FREE,
            "event": str(event),
            "checkout_items": items,
        }

        return session_data

    def request_create_session(self, data: dict):
        """
        request POST to session endpoint
        """
        # Not using reverse because we want URL changes to explicitly break tests.
        return self.client.post(
            f"{self.url_base}session/",
            data=data,
            content_type="application/json",
        )

    @prevent_warnings
    def test_get_session_details_200_ok(self) -> None:
        """
        request GET retrieve item and test if return code 200 OK
        """
        item_public_id = self.checkout_session.public_id

        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.get(f"{self.url_base}session/{item_public_id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # assert objects values with json returned
        session_dict = response.json()
        self.assertEqual(
            session_dict["public_id"], str(self.checkout_session.public_id)
        )
        self.assertEqual(session_dict["name"], self.checkout_session.name)
        self.assertEqual(session_dict["email"], self.checkout_session.email)
        self.assertEqual(session_dict["tx_status"], self.checkout_session.tx_status)
        self.assertEqual(
            session_dict["event"], str(self.checkout_session.event.public_id)
        )
        # assert items from session
        item_dict = session_dict["checkout_items"][0]
        self.assertEqual(item_dict["public_id"], str(self.checkout_item.public_id))
        self.assertEqual(item_dict["ticket_tier"], str(self.ticket_tier.public_id))

    @prevent_warnings
    def test_get_session_details_404_not_found(self):
        """
        request nonexistent session detail and test if return 404 NOT FOUND
        """

        response = self.client.get(f"{self.url_base}session/{self.random_uuid}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @prevent_warnings
    def test_create_session_without_items_201_created(self):
        """
        request POST create session without items and assert if code 200 OK
        """

        data = self.generate_session_data(event=self.event.public_id)
        response = self.request_create_session(data)
        # assert objects values with json returned
        session_dict = response.json()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertUUID(session_dict["public_id"], version=4)
        self.assertEqual(session_dict["name"], data["name"])
        self.assertEqual(session_dict["email"], data["email"])
        self.assertEqual(session_dict["tx_status"], data["tx_status"])
        self.assertEqual(session_dict["checkout_items"], [])

    @prevent_warnings
    def test_create_session_with_items_201_created(self):
        """
        request POST create session with items and assert if code 200 OK
        """

        data = self.generate_session_data(
            event=self.event.public_id, tier=self.ticket_tier.public_id
        )

        response = self.request_create_session(data)
        # assert objects values with json returned
        session_dict = response.json()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertUUID(session_dict["public_id"], version=4)
        self.assertEqual(session_dict["name"], data["name"])
        self.assertEqual(session_dict["email"], data["email"])
        self.assertEqual(session_dict["tx_status"], data["tx_status"])
        item_dict = session_dict["checkout_items"][0]
        self.assertEqual(item_dict["quantity"], data["checkout_items"][0]["quantity"])
        self.assertUUID(item_dict["public_id"], version=4)

    @prevent_warnings
    def test_create_session_conflict_tiers_400_bad_request(self):
        """
        test create session with ticket_tier.tier that must
        conflict with the parent checkout_session.tx_type
        must return 400 bad request
        """

        data = self.generate_session_data(
            event=self.event.public_id, tier=self.ticket_tier.public_id
        )

        # force ticket_tier has no tier_*
        self.ticket_tier.tier_fiat = None
        self.ticket_tier.tier_asset_ownership = None
        self.ticket_tier.tier_blockchain = None
        self.ticket_tier.save()

        # test if return 400 bad request if not FIAT available
        data["tx_type"] = CheckoutSession.TransactionType.FIAT
        response = self.request_create_session(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        error_msg = response.json()["ticket_tier"]
        self.assertIn("ticket_tier does not support fiat", error_msg)

        # test if return 400 bad request if not BLOCKCHAIN available
        data["tx_type"] = CheckoutSession.TransactionType.BLOCKCHAIN
        response = self.request_create_session(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        error_msg = response.json()["ticket_tier"]
        self.assertIn("ticket_tier does not support blockchain", error_msg)

        # test if return 400 bad request if not ASSET_OWNERSHIP available
        data["tx_type"] = CheckoutSession.TransactionType.ASSET_OWNERSHIP
        response = self.request_create_session(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        error_msg = response.json()["ticket_tier"]
        self.assertIn("ticket_tier does not support asset ownership", error_msg)

    @prevent_warnings
    def test_fail_create_with_invalid_event_404_not_found(self):
        """
        request POST create a session with nonexistent or event
        assets if returning 404 NOT FOUND
        """

        data = self.generate_session_data(event=self.random_uuid)
        response = self.request_create_session(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @prevent_warnings
    def test_fail_create_with_invalid_tier_404_not_found(self):
        """
        request POST create a session with nonexistent ticket_tier
        assets if returning 404 NOT FOUND
        """

        data = self.generate_session_data(
            event=self.event.public_id, tier=self.random_uuid
        )
        response = self.request_create_session(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @prevent_warnings
    def test_create_higher_than_available_items_400_bad_request(self):
        """
        request POST create a new session with quantity > quantity available
        available = (
            capacity (100) - quantity_sold (50) = 50
        asserts 400 bad request
        """
        # set capacity
        ticket_tier = self.event.tickettier_set.first()
        ticket_tier.capacity = 100
        ticket_tier.save()

        # generate tickets
        checkout_session = self.event.checkoutsession_set.first()
        checkout_item = checkout_session.checkoutitem_set.first()
        ticket_keys = {
            "checkout_session": checkout_session,
            "event": self.event,
            "ticket_tier": ticket_tier,
            "checkout_item": checkout_item,
        }
        tickets = [Ticket(**ticket_keys) for _ in range(51)]
        Ticket.objects.bulk_create(tickets)

        # test if return 400 bad request
        data = self.generate_session_data(
            event=ticket_tier.event.public_id, tier=ticket_tier.public_id, quantity=51
        )
        response = self.request_create_session(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @prevent_warnings
    def test_create_session_with_repeated_items_400_bad_request(self):
        """
        request POST create session with repeated items and check 400 bad request
        """

        data = self.generate_session_data(
            event=self.event.public_id, tier=self.ticket_tier.public_id
        )
        # duplicate item
        data["checkout_items"].append(data["checkout_items"][0])
        response = self.request_create_session(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @prevent_warnings
    def test_update_session_200_ok(self):
        """
        test PUT session went 200 OK
        """

        fake = faker.Faker()
        data = {
            "name": fake.name(),
            "email": fake.email(),
        }

        session_public_id = self.checkout_session.public_id
        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.put(
            f"{self.url_base}session/{session_public_id}/",
            data=data,
            content_type="application/json",
        )
        # assert objects values with json returned
        session_dict = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(session_dict["name"], data["name"])
        self.assertEqual(session_dict["email"], data["email"])

    @prevent_warnings
    def test_not_update_read_only_session_field_200_ok(self):
        """
        test if will not update real_only field
        """

        fake = faker.Faker()
        data = {
            "name": fake.name(),
            "email": fake.email(),
            "tx_type": CheckoutSession.TransactionType.BLOCKCHAIN,
            "tx_status": CheckoutSession.OrderStatus.COMPLETED,
        }

        session_public_id = self.checkout_session.public_id
        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.put(
            f"{self.url_base}session/{session_public_id}/",
            data=data,
            content_type="application/json",
        )
        session_dict = response.json()
        self.assertNotEqual(
            session_dict["tx_type"], CheckoutSession.TransactionType.BLOCKCHAIN
        )
        self.assertNotEqual(
            session_dict["tx_status"], CheckoutSession.OrderStatus.COMPLETED
        )

    @prevent_warnings
    def test_confirmation_processing_200_ok(self):
        """
        test return PROCESSING status and not returning tickets_summary
        """

        self.checkout_session.tx_status = CheckoutSession.OrderStatus.PROCESSING
        self.checkout_session.save()
        response = self.client.get(
            f"{self.url_base}session/{self.checkout_session.public_id}/confirmation"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.json()["tx_status"], CheckoutSession.OrderStatus.PROCESSING
        )
        self.assertIsNone(response.json()["tickets_summary"])

    @prevent_warnings
    def test_confirmation_failed_200_ok(self):
        """
        test return FAILED status and not returning tickets_summary
        """

        self.checkout_session.tx_status = CheckoutSession.OrderStatus.FAILED
        self.checkout_session.save()
        response = self.client.get(
            f"{self.url_base}session/{self.checkout_session.public_id}/confirmation"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.json()["tx_status"], CheckoutSession.OrderStatus.FAILED
        )
        self.assertIsNone(response.json()["tickets_summary"])

    @prevent_warnings
    def test_confirmation_fulfilled_200_ok(self):
        """
        test return FULFILLED status and not returning tickets_summary
        """

        self.checkout_session.tx_status = CheckoutSession.OrderStatus.FULFILLED
        self.checkout_session.save()
        response = self.client.get(
            f"{self.url_base}session/{self.checkout_session.public_id}/confirmation"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.json()["tx_status"], CheckoutSession.OrderStatus.FULFILLED
        )