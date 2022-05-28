from django.test import TestCase

from apps.services.ticketing_service import get_ticket_from_embedded_qr_code
from apps.root.models import Ticket


class TestTicketingService(TestCase):

    # TODO: add ticket fixtures

    def test_get_ticket_from_embedded_qr_code(self):
        ticket = Ticket.objects.last()
        if ticket:
            self.assert_equals(
                get_ticket_from_embedded_qr_code(f"{ticket.embed_code}/{ticket.filename}").id,
                ticket.id
            )
