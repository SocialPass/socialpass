from django.test import TestCase

from apps.root.models import BlockchainOwnership, Event, Ticket
from apps.services.ticket_service import create_ticket_image, create_tickets_blockchain_ownership


class TestTicketService(TestCase):
    def test_create_ticket_image(self):
        """
        todo: need method for creating event
        event = Event.objects.last()
        ticket = Ticket.objects.create(event=event)
        updated_ticket = create_ticket_image(
            event=event,
            ticket=ticket
        )
        """
        return self.assertTrue(True)

    def test_create_tickets_blockchain_ownership(self):
        """
        event = Event.objects.last()
        tickets = create_tickets_blockchain_ownership(
            event=Event,
            blockchain_ownership=BlockchainOwnership,
            tickets_to_issue=int,
        )
        """
