from typing import Any
from uuid import uuid4

from django.http import Http404
from django.test import RequestFactory, TestCase
from django.views.generic import TemplateView
from rest_framework import status

from apps.api_scanner.views import SetAccessKeyAndEventMixin
from apps.root.factories import (
    CheckoutItemFactory,
    CheckoutSessionFactory,
    EventFactory,
    TicketFactory,
    TicketRedemptionKeyFactory,
    TicketTierFactory,
    UserWithTeamFactory,
)
from apps.root.models import (
    CheckoutItem,
    CheckoutSession,
    Event,
    Team,
    Ticket,
    TicketRedemptionKey,
    TicketTier,
)
from apps.root.utilities.misc import prevent_warnings


class TestCaseWrapper(TestCase):
    password: str
    user: Any
    team: Team
    event: Event
    ticket: Ticket
    ticket_tier: TicketTier
    url_base: str
    access_key: str
    checkout_item: CheckoutItem
    checkout_session: CheckoutSession
    ticket_redemption_key: TicketRedemptionKey
    __event: Event
    __ticket_tier: TicketTier
    __checkout_item: CheckoutItem
    __checkout_session: CheckoutSession
    ticket__: Ticket

    @classmethod
    def setUpTestData(cls) -> None:
        cls.password = "password"
        cls.user = UserWithTeamFactory()
        cls.team = cls.user.membership_set.first().team
        cls.event = EventFactory(team=cls.team, user=cls.user)
        cls.ticket_tier = TicketTierFactory(event=cls.event)
        cls.checkout_session = CheckoutSessionFactory(event=cls.event)
        cls.checkout_item = CheckoutItemFactory(
            ticket_tier=cls.ticket_tier, checkout_session=cls.checkout_session
        )
        cls.ticket = TicketFactory(
            checkout_item=cls.checkout_item, event=cls.event, ticket_tier=cls.ticket_tier
        )
        cls.ticket_redemption_key = TicketRedemptionKeyFactory(event=cls.event)
        cls.url_base = "/api/scanner/v1/"
        cls.access_key = cls.ticket_redemption_key.public_id
        # for raising errors
        cls.__event = EventFactory(team=cls.team, user=cls.user)
        cls.__ticket_tier = TicketTierFactory(event=cls.__event)
        cls.__checkout_session = CheckoutSessionFactory(event=cls.__event)
        cls.__checkout_item = CheckoutItemFactory(
            ticket_tier=cls.__ticket_tier, checkout_session=cls.__checkout_session
        )
        cls.ticket__ = TicketFactory(
            checkout_item=cls.__checkout_item,
            event=cls.__event,
            ticket_tier=cls.__ticket_tier,
        )
        return super().setUpTestData()


class TestMixins(TestCaseWrapper, TestCase):
    """
    Tests api_scanner views mixins
    """

    class DummyView(SetAccessKeyAndEventMixin, TemplateView):
        """
        Dummy view for tests
        """

        template_name = "any_template.html"  # TemplateView requires this attribute

    def setUp(self):
        """
        Setup request and view.
        """
        super().setUp()
        self.request = RequestFactory().get("/fake-path")
        self.view = self.DummyView()

    def test_context_data(self):
        """
        test data in view context
        """

        # initial params
        kwargs = {}

        # test if event and redemption_access_key were initialized correctly
        context = self.view.get_context_data(**kwargs)
        self.assertEqual(context["view"].event, None)
        self.assertEqual(context["view"].redemption_access_key, None)
        self.assertEqual(context["view"].lookup_field, "redemption_access_key")

    def test_set_event_and_redemption_access_key_function(self):
        """
        Test if set_event_and_redemption_access_key set event and redemption_access_key
        properly
        """

        self.view.set_event_and_redemption_access_key(
            redemption_access_key=self.access_key
        )
        self.assertEqual(self.view.redemption_access_key, self.ticket_redemption_key)
        self.assertEqual(self.view.event, self.event)

    def test_set_event_and_redemption_access_key_function_error(self):
        """
        Test if set_event_and_redemption_access_key raise error if giving an invalid
        access_key
        """

        invalid_access_key = (
            uuid4()
        )  # Random UUID string that is not contained in the test DB.

        with self.assertRaises(Http404):
            self.view.set_event_and_redemption_access_key(
                redemption_access_key=invalid_access_key
            )


class GetEventDetailsTestCase(TestCaseWrapper):
    def test_get_event_details_200(self) -> None:
        """
        Request the most recently created team's details, asserts response is 200 OK and
        that the returned JSON is properly formatted.
        """
        # Not using reverse because we want URL changes to explicitly break tests.
        response = self.client.get(f"{self.url_base}{self.access_key}/event/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["team"]["name"], self.team.name)
        self.assertEqual(response.json()["description"], self.event.description)
        self.assertEqual(response.json()["capacity"], int(self.event.capacity))

    @prevent_warnings
    def test_get_event_details_404(self):
        """
        Request a team's details and asserts 404 NOT FOUND for invalid team UUID.
        """
        invalid_access_key = (
            uuid4()
        )  # Random UUID string that is not contained in the test DB.
        response = self.client.get(f"{self.url_base}{invalid_access_key}/event/")
        #
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ScanTicketTestCase(TestCaseWrapper):
    """
    Class to test scan ticket process
    """

    def make_claim_ticket_post_request(self, data: dict):
        """
        POST request to claim-ticket endpoint
        """

        return self.client.post(
            f"{self.url_base}{self.access_key}/claim-ticket/",
            data=data,
            content_type="application/json",
        )

    @prevent_warnings
    def test_scan_ticket_process_200_ok(self):
        """
        Access the scanner API and asserts if went OK.
        """

        ticket = self.ticket
        embed_code = str(ticket.embed_code) + "/" + str(ticket.filename)
        data = {"embed_code": embed_code}

        response = self.make_claim_ticket_post_request(data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["ticket_count"], 1)
        self.assertEqual(response.json()["redeemed_count"], 1)

    @prevent_warnings
    def test_scan_ticket_process_4xx_status_code(self):
        """
        Test if some error occurs during scan claim ticket process
        status_code 403:
            access key can not redeem ticket
        status_code 404:
            no ticket has the embed_code given
        status_code 409:
            ticket already redeemed
        status_code 422:
            embed_code format is invalid
        """

        # TEST 403 FORBIDDEN
        ticket = (
            self.ticket__
        )  # ticket with different access key (access key can not redeem this ticket)
        embed_code = str(ticket.embed_code) + "/" + str(ticket.filename)
        data = {"embed_code": embed_code}
        response = self.make_claim_ticket_post_request(data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # TEST 404 NOT FOUND
        embed_code = str(uuid4()) + "/" + str(uuid4())  # random embed_code
        data = {"embed_code": embed_code}
        response = self.make_claim_ticket_post_request(data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # TEST 409 CONFLICT
        ticket = self.ticket
        redemption_access_key = self.ticket_redemption_key
        redeemed_ticket = ticket.redeem_ticket(redemption_access_key)
        embed_code = (
            str(redeemed_ticket.embed_code) + "/" + str(redeemed_ticket.filename)
        )
        data = {"embed_code": embed_code}
        response = self.make_claim_ticket_post_request(
            data
        )  # try redeem already redeemed ticket
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

        # TEST 422 UNPROCESSABLE ENTITY
        embed_code = uuid4()
        data = {"embed_code": embed_code}
        response = self.make_claim_ticket_post_request(data)
        self.assertEqual(response.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY)

    @prevent_warnings
    def test_not_implemented_methods(self):
        """
        Request methods that were not implemented return 405 status code
        If the method is implemented then need to implement the test
        """

        url = f"{self.url_base}{self.access_key}/claim-ticket/"

        # test get method
        response = self.client.get(url)
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


class TicketsListViewTestCase(TestCaseWrapper):
    """
    Test list tickets view
    """

    @prevent_warnings
    def test_list_tickets_200_ok(self):

        response = self.client.get(f"{self.url_base}{self.access_key}/tickets/")
        ticket_dict = response.json()["results"][0]

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ticket_dict["public_id"], str(self.ticket.public_id))
        self.assertEqual(ticket_dict["wallet_address"], "TODOTHISPR")

    @prevent_warnings
    def test_list_tickets_redeemed_200_ok(self):
        """
        test redeemed query param
        - redeemed must be 'true' or 'false' string
        """

        response = self.client.get(
            f"{self.url_base}{self.access_key}/tickets/?redeemed=true"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["results"], [])

    @prevent_warnings
    def test_list_tickets_400_bad_request(self):
        """
        test not allowed redeemed query
        """

        response = self.client.get(
            f"{self.url_base}{self.access_key}/tickets/?redeemed=random_not_allowed_param"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @prevent_warnings
    def test_not_implemented_methods(self):
        """
        Request methods that were not implemented return 405 status code
        If the method is implemented then need to implement the test
        """

        url = f"{self.url_base}{self.access_key}/tickets/"

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
