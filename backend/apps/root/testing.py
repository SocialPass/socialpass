import logging

from django.test import TestCase
from model_bakery import baker


class BaseTestCaseWrapper(TestCase):
    """
    Base TestCase wrapper.
    Handles default initialization, common vars, methods, etc.
    """

    def setUp(self):
        # Setup users
        self.password = "password"
        self.user_one = baker.make("root.User")
        self.user_two = baker.make("root.User")
        self.user_one.set_password(self.password)
        self.user_two.set_password(self.password)
        self.user_one.save()
        self.user_two.save()

        # setup memberships / teams
        self.team_one = baker.make("root.Team")
        self.team_one.members.add(self.user_one)

        # setup event
        self.event = baker.make("root.Event", user=self.user_one, team=self.team_one)
        self.event_two = baker.make("root.Event", user=self.user_one, team=self.team_one)
        self.ticket_tier = baker.make("root.TicketTier", event=self.event)

        # setup checkout / tickets
        self.checkout_session = baker.make("CheckoutSession", event=self.event)
        self.checkout_item = baker.make(
            "CheckoutItem", checkout_session=self.checkout_session
        )
        self.ticket = baker.make(
            "Ticket",
            checkout_item=self.checkout_item,
            event=self.event,
            ticket_tier=self.ticket_tier,
        )

        # TODO:
        """
        # Set Event Live
        self.ticket_redemption_key =  baker.make("TicketRedemptionKey", event=self.event)
        self.access_key = self.ticket_redemption_key.public_id

        # TODO: for raising errors
        self._event = EventFactory(team=self.team, user=self.user)
        self._ticket_tier = TicketTierFactory(event=self._event)
        self._checkout_session = CheckoutSessionFactory(event=self._event)
        self._checkout_item = CheckoutItemFactory(
            ticket_tier=self._ticket_tier, checkout_session=self._checkout_session
        )
        self._ticket = TicketFactory(
            checkout_item=self._checkout_item,
            event=self._event,
            ticket_tier=self._ticket_tier,
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
