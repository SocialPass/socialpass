from typing import Any

from django.core import exceptions
from django.test import TestCase

from apps.root.exceptions import (
    AlreadyRedeemed,
    ForbiddenRedemptionError,
    InvalidEmbedCodeError,
)
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


class TestScannerTicketMethods(TestCase):
    user: Any
    team: Team
    event: Event
    ticket_tier: TicketTier
    ticket: Ticket
    checkout_item: CheckoutItem
    checkout_session: CheckoutSession
    ticket_redemption_key: TicketRedemptionKey
    __event: Event
    __ticket_tier: TicketTier
    __ticket: Ticket
    __checkout_item: CheckoutItem
    __checkout_session: CheckoutSession

    @classmethod
    def setUpTestData(cls) -> None:
        cls.user = UserWithTeamFactory()
        cls.team = cls.user.membership_set.first().team
        cls.event = EventFactory(team=cls.team, user=cls.user)
        cls.ticket_tier = TicketTierFactory(
            event=cls.event, capacity=100, quantity_sold=0
        )
        cls.checkout_session = CheckoutSessionFactory(event=cls.event)
        cls.checkout_item = CheckoutItemFactory(
            ticket_tier=cls.ticket_tier,
            checkout_session=cls.checkout_session,
            quantity=10,
        )
        cls.ticket = TicketFactory(
            checkout_item=cls.checkout_item, event=cls.event, ticket_tier=cls.ticket_tier
        )
        cls.ticket_redemption_key = TicketRedemptionKeyFactory(event=cls.event)
        # for raising errors
        cls.__event = EventFactory(team=cls.team, user=cls.user)
        cls.__ticket_tier = TicketTierFactory(
            event=cls.__event, capacity=100, quantity_sold=0
        )
        cls.__checkout_session = CheckoutSessionFactory(event=cls.__event)
        cls.__checkout_item = CheckoutItemFactory(
            ticket_tier=cls.__ticket_tier,
            checkout_session=cls.__checkout_session,
            quantity=10,
        )
        cls.__ticket = TicketFactory(
            checkout_item=cls.__checkout_item,
            event=cls.__event,
            ticket_tier=cls.__ticket_tier,
        )

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
        self.assertFalse(Ticket.get_claimed_tickets(self.event).exists())

        # assert queryset
        ticket.redeem_ticket(redemption_access_key)
        self.assertTrue(Ticket.get_claimed_tickets(self.event).exists())
