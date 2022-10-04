from typing import Any

from django.core import exceptions
from django.test import TestCase

from apps.root.exceptions import (
    AlreadyRedeemed,
    ForbiddenRedemptionError,
    InvalidEmbedCodeError,
)
from apps.root.factories import (
    EventFactory,
    TicketFactory,
    TicketRedemptionKeyFactory,
    UserWithTeamFactory,
)
from apps.root.models import Event, Team, Ticket, TicketRedemptionKey


class TestScannerTicketMethods(TestCase):
    user: Any
    team: Team
    event: Event
    ticket: Ticket
    ticket_redemption_key: TicketRedemptionKey
    __event: Event
    __ticket: Ticket

    @classmethod
    def setUpTestData(cls) -> None:
        cls.user = UserWithTeamFactory()
        cls.team = cls.user.membership_set.first().team
        cls.event = EventFactory(team=cls.team, user=cls.user)
        cls.ticket = TicketFactory(event=cls.event)
        cls.ticket_redemption_key = TicketRedemptionKeyFactory(event=cls.event)
        # for raising errors
        cls.__event = EventFactory(team=cls.team, user=cls.user)
        cls.__ticket = TicketFactory(event=cls.__event)

    def test_get_ticket_from_embedded_qr_code(self):
        invalid_qrcode = "xxxxx-xxxx-xxxx-xxxx-xxxxxxx-xxxxxxx"  # can not split("/")
        invalid_uuid_qrcode = "xxxx-xxxx/xxxx-xxxxxxxx"
        valid_qrcode = (
            "a85afb2d-c111-404a-8162-8bedeedfa2f1/01d9b4ce-2aa4-4e3c-bb84-f0f711a6514b"
        )

        # test valid qr_code
        ticket_from_qr_code = Ticket.get_ticket_from_embedded_qr_code(
            self.ticket.full_embed
        )
        self.assertEqual(ticket_from_qr_code, self.ticket)

        # test invalid qr_code (can not split into embed_code and filename)
        with self.assertRaises(InvalidEmbedCodeError):
            Ticket.get_ticket_from_embedded_qr_code(invalid_qrcode)

        # test invalid UUID qr_code (do not match with UUID pattern)
        # djando UUID field raise ValidationError for invalid UUID string
        with self.assertRaises(exceptions.ValidationError):
            Ticket.get_ticket_from_embedded_qr_code(invalid_uuid_qrcode)

        # test no ticket from qr_code (random qrcode)
        with self.assertRaises(Ticket.DoesNotExist):
            Ticket.get_ticket_from_embedded_qr_code(valid_qrcode)

    def test_access_key_can_redeem_ticket(self):
        """
        test if the access key can reedem the given ticket
        for that, redemption_access_key must be null or
            ticket event == redemption_access_key event
        """
        ticket = self.ticket
        __ticket = self.__ticket
        redemption_access_key = self.ticket_redemption_key

        # assert can redeem ticket
        self.assertEqual(
            ticket.access_key_can_redeem_ticket(redemption_access_key), True
        )

        # assert can not redeem ticket
        self.assertEqual(
            __ticket.access_key_can_redeem_ticket(redemption_access_key), False
        )

    def test_redeem_ticket(self):
        """
        tests if the ticket is being successfully redeemed
        - if ticket is already redeemed, must raise AlreadyRedeemed exception
        - if ticket event != redemption_access_key event, must raise
            ForbiddenRedemptionError exception
        """
        ticket = self.ticket
        redemption_access_key = self.ticket_redemption_key

        # test ticket redeemed
        redeemed_ticket = ticket.redeem_ticket(redemption_access_key)
        self.assertEqual(redeemed_ticket.redeemed, True)

        # test already redeemed
        with self.assertRaises(AlreadyRedeemed):
            redeemed_ticket.redeem_ticket()

        # test forbidden redemption
        __ticket = self.__ticket
        with self.assertRaises(ForbiddenRedemptionError):
            __ticket.redeem_ticket(redemption_access_key)

    def test_get_claimed_tickets(self):
        """
        tests if Ticket get_claimed_tickets method is returning redeemed tickets
            from event
        - if an event has no redeemed tickets must return an empty queryset
        """
        ticket = self.ticket
        redemption_access_key = self.ticket_redemption_key

        # assert empty queryset
        self.assertFalse(Ticket.get_claimed_tickets(ticket.event).exists())

        # assert queryset
        ticket.redeem_ticket(redemption_access_key)
        self.assertTrue(Ticket.get_claimed_tickets(ticket.event).exists())
