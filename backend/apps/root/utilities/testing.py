import logging
from typing import Any

from django.test import TestCase

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


class BaseTestCaseWrapper(TestCase):
    """
    Base TestCase wrapper.
    Handles default initialization, common vars, methods, etc.
    """

    # Globals
    url_base: str
    user: Any
    password: str
    team: Team
    event: Event
    ticket: Ticket
    ticket_tier: TicketTier
    access_key: str
    checkout_item: CheckoutItem
    checkout_session: CheckoutSession
    ticket_redemption_key: TicketRedemptionKey
    _event: Event
    _ticket: Ticket
    _ticket_tier: TicketTier
    _checkout_item: CheckoutItem
    _checkout_session: CheckoutSession

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
        cls.access_key = cls.ticket_redemption_key.public_id

        # for raising errors
        cls._event = EventFactory(team=cls.team, user=cls.user)
        cls._ticket_tier = TicketTierFactory(event=cls._event)
        cls._checkout_session = CheckoutSessionFactory(event=cls._event)
        cls._checkout_item = CheckoutItemFactory(
            ticket_tier=cls._ticket_tier, checkout_session=cls._checkout_session
        )
        cls._ticket = TicketFactory(
            checkout_item=cls._checkout_item,
            event=cls._event,
            ticket_tier=cls._ticket_tier,
        )
        return super().setUpTestData()


def prevent_warnings(func):
    """
    Decorator for ignoring 400s status codes for test evaluation.
    Decorate every 400-500s codes tests with this.
    """

    def new_func(*args, **kwargs):
        # Temporarily increasing logging level so the 404 tests do not pollute the test CLI
        logger = logging.getLogger("django.request")
        previous_logging_level = logger.getEffectiveLevel()
        logger.setLevel(logging.ERROR)

        func(*args, **kwargs)

        logger.setLevel(previous_logging_level)

    return new_func
