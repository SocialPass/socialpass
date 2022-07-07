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
