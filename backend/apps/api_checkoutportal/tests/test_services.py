from django.test import TestCase

from apps.api_checkoutportal.services import moralis_get_nonfungible_assets


class TestBlockchainService(TestCase):
    def test_moralis_get_nonfungible_assets(self):
        """
        top owner of BAYC
        https://etherscan.io/token/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d?a=0x5b523dc90a79cf5ee5d095825e586e33780f7188

        assets = moralis_get_nonfungible_assets(
            chain_id=hex(1),
            wallet_address="0x1b523dc90a79cf5ee5d095825e586e33780f7188",
            token_address="0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
            token_ids=None,
            required_amount=1,
        )
        # assert assets have been returned
        return self.assertTrue(len(assets) > 1)
        """
        return "Not yet implemented"


class TestTicketService(TestCase):
    def test_create_ticket_image(self):
        """
        event = Event.objects.last()
        ticket = Ticket.objects.create(event=event)
        updated_ticket = create_ticket_image(
            event=event,
            ticket=ticket
        )
        """
        return "Not yet implemented"

    def test_create_tickets_blockchain_ownership(self):
        """
        event = Event.objects.last()
        tickets = create_tickets_blockchain_ownership(
            event=Event,
            blockchain_ownership=BlockchainOwnership,
            tickets_to_issue=int,
        )
        """
        return "Not yet implemented"
