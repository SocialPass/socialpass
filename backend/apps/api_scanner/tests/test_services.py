from django.test import TestCase

from apps.api_scanner.services import get_ticket_from_embedded_qr_code
from apps.root.models import Ticket


class TestScanningService(TestCase):
    def test_get_ticket_from_embedded_qr_code(self):
        ticket = Ticket.objects.last()
        if ticket:
            self.assert_equals(
                get_ticket_from_embedded_qr_code(ticket.full_embed).id,
                ticket.id,
            )
