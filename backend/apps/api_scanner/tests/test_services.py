import logging
from uuid import uuid4
from django.test import TestCase

from apps.api_scanner.services import get_ticket_from_embedded_qr_code, access_key_can_redeem_ticket
from apps.root.models import Ticket, User, Team, Event, BlockchainOwnership, TicketRedemptionKey


# Commit Goiás


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


def generate_random_identifier():
    return uuid4().hex[:6].upper()


def create_testing_user():
    return User.objects.create(username=f"testUser_{generate_random_identifier()}")


def create_testing_team():
    identifier = generate_random_identifier()
    return Team.objects.create(
        name=f"testTeam_{identifier}",
        description=f"testTeamDescription_{identifier}",
    )


def create_testing_event(**kwargs):
    identifier = generate_random_identifier()
    return Event.objects.create(
        title=f"testEvent_{identifier}",
        description=f"testEventDescription_{identifier}",
        start_date=kwargs.get("start_date", "2030-08-21 13:30:00+00"),
        timezone=kwargs.get("timezone", "America/Bahia"),
        capacity=kwargs.get("capacity", "1000"),
        team_id=kwargs.get("team_id", Team.objects.last().id),
        user_id=kwargs.get("user_id", User.objects.last().id),
    )


def create_testing_blockchain_ownership(**kwargs):
    return BlockchainOwnership.objects.create(
        event_id=kwargs.get("event_id", Event.objects.last().id),
    )


def create_testing_ticket(**kwargs):
    blockchain_asset = {
            "amount": 0.0001,
            "chain_id": 4,
            "token_id": [],
            "asset_type": "ERC20",
            "blockchain": "EVM",
            "asset_address": "0xsocialpass"
        }
    return Ticket.objects.create(
        event=kwargs.get("event", Event.objects.last()),
        file=kwargs.get("file", "qrcode.png"),
        blockchain_asset=kwargs.get("blockchain_asset", blockchain_asset),
    )


def create_testing_ticket_redemption_key(**kwargs):
    TicketRedemptionKey.objects.create(
        event=kwargs.get("event", Event.objects.last()),
    )


class TestScanningService(TestCase):


    @classmethod
    def setUpTestData(cls) -> None:
        cls.user = create_testing_user()
        cls.team = create_testing_team()
        cls.event = create_testing_event()
        cls.blockchainOwnership = create_testing_blockchain_ownership()
        cls.ticket = create_testing_ticket()
        cls.ticketRedemptionKey = create_testing_ticket_redemption_key()
        return super().setUpTestData()


    def test_get_ticket_from_embedded_qr_code(self):
        ticket = Ticket.objects.last()
        ticket_from_qr_code = get_ticket_from_embedded_qr_code(ticket.full_embed)
        self.assertEqual(ticket_from_qr_code, self.ticket)
    # TODO: Test fail case.


    def test_access_key_can_redeem_ticket(self):
        ticket = Ticket.objects.last()
        redemption_access_key = TicketRedemptionKey.objects.last()
        self.assertEqual(access_key_can_redeem_ticket(ticket, redemption_access_key), True) 
    # TODO: Test fail case.


    def test_redeem_ticket(self):
        return "Not yet implemented"
    # TODO: Test fail case such as ticket already redeemed.


    def test_get_claimed_tickets(self):
        return "Not yet implemented"