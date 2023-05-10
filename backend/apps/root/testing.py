import logging

from django.test import TestCase
from model_bakery import baker


class BaseTestCaseWrapper(TestCase):
    """
    Base TestCase wrapper.
    Handles default initialization, common vars, methods, etc.
    """

    @classmethod
    def setUpTestData(cls):
        # Setup users
        cls.password = "password"
        cls.user_one = baker.make("root.User")
        cls.user_two = baker.make("root.User")
        cls.user_one.set_password(cls.password)
        cls.user_two.set_password(cls.password)
        cls.user_one.save()
        cls.user_two.save()

        # setup memberships / teams
        cls.team_one = baker.make("root.Team")
        cls.team_one.members.add(cls.user_one)

        # setup event
        cls.event_one = baker.make("root.Event", user=cls.user_one, team=cls.team_one)
        cls.event_two = baker.make("root.Event", user=cls.user_one, team=cls.team_one)
        cls.ticket_tier = baker.make("root.TicketTier", event=cls.event_one)

        # setup checkout / tickets
        cls.checkout_session = baker.make("CheckoutSession", event=cls.event_one)
        cls.checkout_item = baker.make(
            "CheckoutItem", checkout_session=cls.checkout_session
        )
        cls.ticket = baker.make(
            "Ticket",
            checkout_item=cls.checkout_item,
            event=cls.event_one,
            ticket_tier=cls.ticket_tier,
        )

        # TODO:
        """
        # Set Event Live
        cls.ticket_redemption_key =  baker.make("TicketRedemptionKey", event=cls.event)
        cls.access_key = cls.ticket_redemption_key.public_id

        # TODO: for raising errors
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
        """
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
