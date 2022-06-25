from rest_framework import status
from django.test import TestCase
from apps.root.models import Event, Team, User, BlockchainOwnership
from uuid import uuid4
import logging

# Tests can be run by execing into the container and `python manage.py test`
# P.S. Django tests are run on a separate DB -> must manually create a test dataset.


def prevent_warnings(func):
    """
    Decorator for ignoring 400s status codes for test evaluation. Decorate every 400-500s codes tests with this.
    """
    def new_func(*args, **kwargs):
        # Temporarily increasing logging level so the 404 tests do not pollute the test CLI
        logger = logging.getLogger('django.request')
        previous_logging_level = logger.getEffectiveLevel()
        logger.setLevel(logging.ERROR)

        func(*args, **kwargs)

        logger.setLevel(previous_logging_level)

    return new_func


def generate_random_identifier():
    return uuid4().hex[:6].upper()


def create_testing_user():
    return User.objects.create(username=f'testUser_{generate_random_identifier()}')


def create_testing_team():
    identifier = generate_random_identifier()
    return Team.objects.create(name=f'testTeam_{identifier}',
                               description=f'testTeamDescription_{identifier}',
                               )


def create_testing_event(**kwargs):
    identifier = generate_random_identifier()
    return Event.objects.create(title=f'testEvent_{identifier}',
                                description=f'testEventDescription_{identifier}',
                                date=kwargs.get('date', '2030-08-21 13:30:00+00'),
                                timezone=kwargs.get('timezone', 'America/Bahia'),
                                capacity=kwargs.get('capacity', '1000'),
                                team_id=kwargs.get('team_id', Team.objects.last().id),
                                user_id=kwargs.get('user_id', User.objects.last().id),
                                )


def create_testing_blockchain_ownership(**kwargs):
    return BlockchainOwnership.objects.create(event_id=kwargs.get('event_id', Event.objects.last().id))


class GetEventDetailsTestCase(TestCase):

    @classmethod
    def setUpTestData(cls) -> None:
        cls.user = create_testing_user()
        cls.team = create_testing_team()
        cls.event = create_testing_event()
        return super().setUpTestData()

    def test_get_event_details_200(self):
        """
        Request the most recently created team's details and asserts response is 200 OK.
        """
        event_id = str(self.event.public_id)
        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.get(f'/api/checkout-portal/retrieve/{event_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Skipping these asserts for now since Django is doing some magic on the serializers.
        # Add `from . import serializers` at the top then...
        # print(response.json())
        # print(serializers.EventSerializer(self.event).data)

        # self.assertEqual(response.json(), ...)

    @prevent_warnings
    def test_get_event_details_404(self):
        """
        Request a team's details and asserts 404 NOT FOUND for invalid team UUID.
        """
        invalid_event_id = uuid4()  # Random UUID string that is not contained in the test DB.
        response = self.client.get(f'/api/checkout-portal/retrieve/{invalid_event_id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CheckoutPortalProcessTestCase(TestCase):

    @classmethod
    def setUpTestData(cls) -> None:
        cls.user = create_testing_user()
        cls.team = create_testing_team()
        cls.event = create_testing_event()
        cls.blockchain_ownership = create_testing_blockchain_ownership()
        return super().setUpTestData()

    @prevent_warnings
    def test_checkout_portal_process_403_unable_to_validate(self):
        """
        Access the event portal process checkout API and asserts the signing message couldn't be validated by user.
        """
        event_id = str(self.event.public_id)
        data = {
            "wallet_address": "0x82fa9d444b39259206d6cbAf24027196534c701E",
            "signed_message": "unused field",
            "blockchain_ownership_id": self.blockchain_ownership.id,
            "tickets_requested": "1"
        }
        content_type = "application/json"
        response = self.client.post(f'/api/checkout-portal/process/{event_id}/?checkout_type=blockchain_ownership',
                                    data=data, content_type=content_type)
        self.assertContains(response, 'Unable to decode & validate blockchain_ownership', status_code=403)

    @prevent_warnings
    def test_checkout_portal_process_401_no_checkout_type(self):
        """
        Access the event portal process with a valid Event UUID but without the (checkout_type) parameter.
        """
        event_id = str(self.event.public_id)
        response = self.client.post(f'/api/checkout-portal/process/{event_id}/')
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
            "tickets_requested": "1"
        }
        content_type = "application/json"
        response = self.client.post(f'/api/checkout-portal/process/{event_id}/?checkout_type=blockchain_ownership',
                                    data=data, content_type=content_type)
        self.assertContains(response, 'Unrecognized wallet_address format', status_code=403)

    @prevent_warnings
    def test_checkout_portal_process_404_invalid_team_UUID(self):
        """
        Access the event portal process checkout API and asserts 404 NOT FOUND for invalid team UUID.
        """
        invalid_event_id = uuid4()
        response = self.client.post(f'/api/checkout-portal/process/{invalid_event_id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
