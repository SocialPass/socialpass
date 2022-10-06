from typing import Any
from uuid import uuid4

from django.test import TestCase
from eth_account.messages import encode_defunct
from rest_framework import status
from web3.auto import w3

from apps.root.factories import EventFactory, UserWithTeamFactory
from apps.root.models import BlockchainOwnership, Event, Team
from apps.root.utilities.main import prevent_warnings


def generate_random_identifier():
    return uuid4().hex[:6].upper()


def create_testing_blockchain_ownership(**kwargs):
    return BlockchainOwnership.objects.create(
        event_id=kwargs.get("event_id", Event.objects.last().id)
    )


class TestCaseWrapper(TestCase):
    password: str
    user: Any
    team: Team
    event: Event
    blockchain_ownership: BlockchainOwnership
    url_base: str

    @classmethod
    def setUpTestData(cls) -> None:
        cls.password = "password"
        cls.user = UserWithTeamFactory()
        cls.team = cls.user.membership_set.first().team
        cls.event = EventFactory(team=cls.team, user=cls.user)
        cls.blockchain_ownership = create_testing_blockchain_ownership()
        cls.url_base = "/api/checkout/v0/"
        return super().setUpTestData()


class GetEventDetailsTestCase(TestCaseWrapper):
    def test_get_event_details_200(self):
        """
        Request the most recently created team's details, asserts response is 200 OK and
        that the returned JSON is properly formatted.
        """
        event_id = str(self.event.public_id)
        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.get(f"{self.url_base}retrieve/{event_id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Skipping these asserts for now,
        # since Django is doing some magic on the serializers.
        # Add `from . import serializers` at the top then...
        # self.assertEqual(response.json(), ...)
        self.assertEqual(response.json()["team"]["name"], self.team.name)
        self.assertEqual(response.json()["description"], self.event.description)
        self.assertEqual(response.json()["capacity"], int(self.event.capacity))

    @prevent_warnings
    def test_get_event_details_404(self):
        """
        Request a team's details and asserts 404 NOT FOUND for invalid team UUID.
        """
        invalid_event_id = (
            uuid4()
        )  # Random UUID string that is not contained in the test DB.
        response = self.client.get(f"{self.url_base}retrieve/{invalid_event_id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CheckoutPortalProcessTestCase(TestCaseWrapper):
    @prevent_warnings
    # In progress, having trouble mocking data since it all comes through Moralis
    def test_checkout_portal_process_200_ok(self):
        """
        Access the event portal process checkout API and asserts the checkout went OK.
        """
        event_id = str(self.event.public_id)
        signing_message = self.blockchain_ownership.signing_message
        test_wallet_private_key = (
            "93b8a8d84221fff0f40e62107a9dc61ce883a4dc6b6be5a53b3dc5263be25845"
        )
        test_wallet_address = "0xbD58Ce6Fa4e7867b03568151c1107D22a612Ae12"

        _msg = encode_defunct(text=signing_message)
        _signed = w3.eth.account.sign_message(_msg, private_key=test_wallet_private_key)

        data = {
            "wallet_address": test_wallet_address,
            "signed_message": _signed.signature.hex(),
            "blockchain_ownership_id": self.blockchain_ownership.id,
            "tickets_requested": "1",
        }
        content_type = "application/json"
        self.client.post(
            f"{self.url_base}process/{event_id}/?checkout_type=blockchain_ownership",
            data=data,
            content_type=content_type,
        )

    @prevent_warnings
    def test_checkout_portal_process_403_over_ticket_limit(self):
        """
        Access the event portal process checkout API.
        Asserts 403 when requesting over the ticket limit.
        """
        event_id = str(self.event.public_id)
        signing_message = self.blockchain_ownership.signing_message
        test_wallet_private_key = (
            "93b8a8d84221fff0f40e62107a9dc61ce883a4dc6b6be5a53b3dc5263be25845"
        )
        test_wallet_address = "0xbD58Ce6Fa4e7867b03568151c1107D22a612Ae12"

        _msg = encode_defunct(text=signing_message)
        _signed = w3.eth.account.sign_message(_msg, private_key=test_wallet_private_key)

        data = {
            "wallet_address": test_wallet_address,
            "signed_message": _signed.signature.hex(),
            "blockchain_ownership_id": self.blockchain_ownership.id,
            "tickets_requested": self.event.limit_per_person + 1,
        }
        content_type = "application/json"
        response = self.client.post(
            f"{self.url_base}process/{event_id}/?checkout_type=blockchain_ownership",
            data=data,
            content_type=content_type,
        )
        self.assertContains(
            response, "Tickets requested are over the limit per person", status_code=403
        )

    @prevent_warnings
    def test_checkout_portal_process_403_unable_to_validate(self):
        """
        Access the event portal process checkout API.
        Asserts the signing message couldn't be validated by user.
        """
        event_id = str(self.event.public_id)
        data = {
            "wallet_address": "0x82fa9d444b39259206d6cbAf24027196534c701E",
            "signed_message": "invalid message",
            "blockchain_ownership_id": self.blockchain_ownership.id,
            "tickets_requested": "1",
        }
        content_type = "application/json"
        response = self.client.post(
            f"{self.url_base}process/{event_id}/?checkout_type=blockchain_ownership",
            data=data,
            content_type=content_type,
        )
        self.assertEqual(response.status_code, 403)

    @prevent_warnings
    def test_checkout_portal_process_401_no_checkout_type(self):
        """
        Access the event portal process with a valid Event UUID.
        but without the (checkout_type) parameter.
        """
        event_id = str(self.event.public_id)
        response = self.client.post(f"{self.url_base}process/{event_id}/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @prevent_warnings
    def test_checkout_portal_process_403_invalid_wallet_address(self):
        """
        Access the event portal process checkout API and asserts 403 invalid address
        """
        event_id = str(self.event.public_id)
        data = {
            "wallet_address": "0xI4M1NV4L1D",
            "signed_message": "unused field",
            "blockchain_ownership_id": self.blockchain_ownership.id,
            "tickets_requested": "1",
        }
        content_type = "application/json"
        response = self.client.post(
            f"{self.url_base}process/{event_id}/?checkout_type=blockchain_ownership",
            data=data,
            content_type=content_type,
        )
        self.assertContains(
            response, "Unrecognized wallet_address format", status_code=403
        )

    @prevent_warnings
    def test_checkout_portal_process_404_invalid_team_UUID(self):
        """
        Access the event portal process checkout API.
        Asserts 404 NOT FOUND for invalid team UUID.
        """
        invalid_event_id = uuid4()
        response = self.client.post(f"{self.url_base}process/{invalid_event_id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
