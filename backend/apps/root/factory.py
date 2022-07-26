import email
import random
import string
from uuid import uuid4

from .models import BlockchainOwnership, Event, Team, Ticket, TicketRedemptionKey, User


class DataFactory:

    @staticmethod
    def generate_random_identifier() -> str:
        return uuid4().hex[:6].upper()

    @staticmethod
    def get_random_email() -> str:
        def random_char(char_num):
            return ''.join(random.choice(string.ascii_letters) for _ in range(char_num))

        return random_char(7) + "@tester.com"

    """
    IDEAS:
    @staticmethod
    def get_random_password() -> str:
        def random_char(char_num):
            return ''.join(random.choice(string.ascii_letters) for _ in range(char_num))
        return random_char(10)
    """


class EventFactory(DataFactory):

    def create_user(self) -> User:
        return User.objects.create(
            username=f"testUser_{self.generate_random_identifier()}",
            email=self.get_random_email()
        )

    def create_team(self) -> Team:
        identifier = self.generate_random_identifier()
        return Team.objects.create(
            name=f"testTeam_{identifier}",
            description=f"testTeamDescription_{identifier}",
        )

    def create_event(self, user: User, team: Team) -> Event:
        identifier = self.generate_random_identifier()
        return Event.objects.create(
            title=f"testEvent_{identifier}",
            team=team,
            user=user,
        )

    def create_blockchain_ownership(self, event: Event) -> BlockchainOwnership:
        return BlockchainOwnership.objects.create(
            event=event,
        )


class TicketFactory(DataFactory):

    def create_ticket(self, event: Event) -> Ticket:
        blockchain_asset = {
            "amount": 0.0001,
            "chain_id": 4,
            "token_id": [],
            "asset_type": "ERC20",
            "blockchain": "EVM",
            "asset_address": "0xsocialpass"
        }
        return Ticket.objects.create(
            event=event,
            file="qrcode.png",
            blockchain_asset=blockchain_asset,
        )

    def create_ticket_redemption_key(self, event: Event):
        TicketRedemptionKey.objects.create(
            event=event,
        )
