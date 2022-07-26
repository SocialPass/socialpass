import logging
from django.test import TestCase

from apps.api_scanner.services import get_ticket_from_embedded_qr_code, access_key_can_redeem_ticket
from apps.root.factory import EventFactory, TicketFactory


def prevent_warnings(func):
    """
    Decorator for ignoring 400s status codes for test evaluation. Decorate every 400-500s codes tests with this.
    """

    def new_func(*args, **kwargs):
        # Temporarily increasing logging level so the 404 tests do not pollute the test CLI
        logger = logging.getLogger("django.request")
        previous_logging_level = logger.getEffectiveLevel()
        logger.setLevel(logging.ERROR)

        func(*args, **kwargs)

        logger.setLevel(previous_logging_level)

    return new_func


class TestScanningService(TestCase):

    @classmethod
    def setUpTestData(cls) -> None:
        event_factory = EventFactory()
        ticket_factory = TicketFactory()
        cls.user = event_factory.create_user()
        cls.team = event_factory.create_team()
        cls.event = event_factory.create_event(cls.user, cls.team)
        cls.blockchainOwnership = event_factory.create_blockchain_ownership(cls.event)
        cls.ticket = ticket_factory.create_ticket(cls.event)
        cls.ticket_redemption_key = ticket_factory.create_ticket_redemption_key(cls.event)
        return super().setUpTestData()

    def test_get_ticket_from_embedded_qr_code(self):
        ticket_from_qr_code = get_ticket_from_embedded_qr_code(self.ticket.full_embed)
        self.assertEqual(ticket_from_qr_code, self.ticket)
    # TODO: Test fail case.

    def test_access_key_can_redeem_ticket(self):
        ticket = self.ticket
        redemption_access_key = self.ticket_redemption_key
        self.assertEqual(access_key_can_redeem_ticket(ticket, redemption_access_key), True)
    # TODO: Test fail case.

    def test_redeem_ticket(self):
        return "Not yet implemented"
    # TODO: Test fail case such as ticket already redeemed.

    def test_get_claimed_tickets(self):
        return "Not yet implemented"
