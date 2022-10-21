from typing import Optional
from uuid import UUID, uuid4

from django.utils import timezone
from factory.faker import faker
from rest_framework import serializers, status
from rest_framework.fields import empty

from apps.root.models import (
    CheckoutItem,
    CheckoutSession,
    TxAssetOwnership,
    TxBlockchain,
    TxFiat,
)
from apps.root.utilities.testing import BaseTestCaseWrapper, prevent_warnings


class TestCaseWrapper(BaseTestCaseWrapper):
    random_uuid: UUID

    @classmethod
    def setUpTestData(cls) -> None:
        cls.url_base = "/api/checkout/v1/"
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
        ticket_tier = self.event.tickettier_set.first()
        ticket_tier.capacity = 100
        ticket_tier.quantity_sold = 50
        ticket_tier.save()
        checkout_session = self.event.checkoutsession_set.first()
        checkout_item = checkout_session.checkoutitem_set.first()
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
        self.assertEqual(
            item_dict["ticket_tier"]["public_id"], str(self.ticket_tier.public_id)
        )
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

        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.post(
            f"{self.url_base}item/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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

        ticket_tier = self.event.tickettier_set.first()
        ticket_tier.capacity = 100
        ticket_tier.quantity_sold = 50
        ticket_tier.save()
        checkout_session = self.event.checkoutsession_set.first()

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
            "expiration": serializers.DateTimeField().to_representation(timezone.now()),
            "name": fake.name(),
            "email": fake.email(),
            "cost": 10,
            "tx_status": "VALID",
            "event": str(event),
            "checkout_items": items,
        }

        return session_data

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
        self.assertSerializedDatetime(
            session_dict["expiration"], self.checkout_session.expiration
        )
        self.assertEqual(session_dict["email"], self.checkout_session.email)
        self.assertEqual(session_dict["cost"], self.checkout_session.cost)
        self.assertEqual(session_dict["tx_status"], self.checkout_session.tx_status)
        self.assertEqual(
            session_dict["event"], str(self.checkout_session.event.public_id)
        )
        # assert items from session
        item_dict = session_dict["checkout_items"][0]
        self.assertEqual(item_dict["public_id"], str(self.checkout_item.public_id))
        self.assertEqual(
            item_dict["ticket_tier"]["public_id"], str(self.ticket_tier.public_id)
        )

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

        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.post(
            f"{self.url_base}session/",
            data=data,
            content_type="application/json",
        )
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

        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.post(
            f"{self.url_base}session/",
            data=data,
            content_type="application/json",
        )
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
    def test_fail_create_with_invalid_event_404_not_found(self):
        """
        request POST create a session with nonexistent or event
        assets if returning 404 NOT FOUND
        """

        data = self.generate_session_data(event=self.random_uuid)
        response = self.client.post(
            f"{self.url_base}session/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json()["code"], "public-id-not-found")

    @prevent_warnings
    def test_fail_create_with_invalid_tier_404_not_found(self):
        """
        request POST create a session with nonexistent ticket_tier
        assets if returning 404 NOT FOUND
        """

        data = self.generate_session_data(
            event=self.event.public_id, tier=self.random_uuid
        )
        response = self.client.post(
            f"{self.url_base}session/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json()["code"], "public-id-not-found")

    @prevent_warnings
    def test_create_higher_than_available_items_400_bad_request(self):
        """
        request POST create a new session with quantity > quantity available
        available = (
            capacity (100) - quantity_sold (50) = 50
        asserts 400 bad request
        """

        ticket_tier = self.event.tickettier_set.first()
        ticket_tier.capacity = 100
        ticket_tier.quantity_sold = 50
        ticket_tier.save()

        # ensure there is no item and session with this tier and event
        CheckoutItem.objects.filter(ticket_tier=ticket_tier).delete()
        CheckoutSession.objects.filter(event=self.event).delete()

        # test if return 400 bad request
        data = self.generate_session_data(
            event=ticket_tier.event.public_id, tier=ticket_tier.public_id, quantity=51
        )
        response = self.client.post(
            f"{self.url_base}session/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # verify if the value was not created in the db
        checkout_item_qs = CheckoutItem.objects.filter(ticket_tier=ticket_tier)
        checkout_session_qs = CheckoutSession.objects.filter(event=self.event)
        self.assertFalse(checkout_item_qs)
        self.assertFalse(checkout_session_qs)

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

        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.post(
            f"{self.url_base}session/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @prevent_warnings
    def test_transaction_fiat_201_ok(self):
        """
        test create TxFiat and update session.tx_fiat
        assert 201 created
        """

        data = {"tx_type": "FIAT"}
        response = self.client.post(
            f"{self.url_base}session/{self.checkout_session.public_id}/transaction/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # test if fiat tx was created
        response_json = response.json()
        tx_fiat = TxFiat.objects.get(public_id=response_json["public_id"])
        self.checkout_session.refresh_from_db()
        self.assertEqual(self.checkout_session.tx_fiat.pk, tx_fiat.pk)

    @prevent_warnings
    def test_transaction_asset_ownership_201_ok(self):
        """
        test create TxAssetOwnership and update session.tx_asset_ownership
        assert 201 created
        """

        data = {"tx_type": "ASSET_OWNERSHIP"}
        response = self.client.post(
            f"{self.url_base}session/{self.checkout_session.public_id}/transaction/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # test if asset_ownership tx was created and session updated
        response_json = response.json()
        tx_asset_ownership = TxAssetOwnership.objects.get(
            public_id=response_json["public_id"]
        )
        self.checkout_session.refresh_from_db()
        self.assertEqual(
            self.checkout_session.tx_asset_ownership.pk, tx_asset_ownership.pk
        )

    @prevent_warnings
    def test_transaction_blockchain_201_ok(self):
        """
        test create TxBlockchain and update session.tx_blockchain
        assert 201 created
        """

        data = {"tx_type": "BLOCKCHAIN"}
        response = self.client.post(
            f"{self.url_base}session/{self.checkout_session.public_id}/transaction/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # test if blockchain tx was created and session updated
        response_json = response.json()
        tx_blockchain = TxBlockchain.objects.get(public_id=response_json["public_id"])
        self.checkout_session.refresh_from_db()
        self.assertEqual(self.checkout_session.tx_blockchain.pk, tx_blockchain.pk)

    @prevent_warnings
    def test_transaction_400_bad_request(self):
        """
        test create transaction with nonexistent tx_type
        assert 400 bad request
        """

        data = {"tx_type": "NONEXISTENT_TYPE"}
        response = self.client.post(
            f"{self.url_base}session/{self.checkout_session.public_id}/transaction/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.checkout_session.refresh_from_db()
        self.assertIsNone(self.checkout_session.tx_blockchain)
        self.assertIsNone(self.checkout_session.tx_asset_ownership)
        self.assertIsNone(self.checkout_session.tx_fiat)

    @prevent_warnings
    def test_transaction_session_404_not_found(self):
        """
        test create transaction with nonexistent session
        assert 404 not found
        """

        data = {"tx_type": "FIAT"}
        response = self.client.post(
            f"{self.url_base}session/{self.random_uuid}/transaction/",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        tx_fiat = TxFiat.objects.all()
        self.assertFalse(tx_fiat)
