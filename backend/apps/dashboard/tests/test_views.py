from django.contrib.auth.models import AnonymousUser, get_user_model
from django.test import RequestFactory, TestCase

from apps.dashboard import views
from apps.dashboard.models import Membership, Team

User = get_user_model()


class DashboardTest(TestCase):
    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = RequestFactory()
        # TODO: Move this to some sort of factory
        self.user = User.objects.create_user(
            username="jacob", email="jacob@…", password="top_secret"
        )
        self.team = Team.objects.create(name="Test team")
        self.membership = None

    def test_details(self):
        """
        # Create an instance of a GET request.
        request = self.factory.get("/customer/details")

        # Recall that middleware are not supported. You can simulate a
        # logged-in user by setting request.user manually.
        request.user = self.user

        # Or you can simulate an anonymous user by setting request.user to
        # an AnonymousUser instance.
        request.user = AnonymousUser()

        # Test my_view() as if it were deployed at /customer/details
        response = my_view(request)
        # Use this syntax for class-based views.
        response = MyView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        """
        return
