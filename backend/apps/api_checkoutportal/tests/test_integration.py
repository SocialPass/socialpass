from rest_framework.test import APIRequestFactory, APITestCase
from rest_framework import status
from apps.api_eventportal.views import EventPortalRetrieve
from apps.root.models import User, Team, Event


# This test should return information about that previously created event.
# Tests can be run by execing into the container and `python manage.py test`
# P.S. Django tests are run on a separate DB!!! (only took me 1h to read that)
# TODO: Refactor logging in into a class and derive subclasses for tests


class GetEventDetailsTestCase(APITestCase):

    def test_get_event_details(self):
        """
        Request a team's details.
        """

        User.objects.create(username='beautyfades', is_staff=True)
        Team.objects.create(name='UgaMaster', description='Rei dos Ugas')
        Event.objects.create(title='uhul', description='uga', date='2022-06-15 04:38:00+00',
                             timezone='America/Bahia', capacity='1000', team_id='1', user_id='1',
                             public_id='901b0474-6278-42a1-bf55-618ee69b7402')

        event = Event.objects.last()
        print(event.public_id)

        factory = APIRequestFactory()
        view = EventPortalRetrieve.as_view()
        request = factory.get(f'/event-portal/retrieve/{str(event.public_id)}/')
        print(request)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
