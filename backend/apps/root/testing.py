import logging
from random import randint

from django.test import TestCase
from model_bakery import baker
from apps.root.models import CheckoutSession, User


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


class BaseModelScaffold:
    def setUp(self):
        # Setup users
        self.password = "password"
        self.user_one = baker.make("root.User", username="user_one")
        self.user_two = baker.make("root.User", username="user_two")
        self.user_one.set_password(self.password)
        self.user_two.set_password(self.password)
        self.user_one.save()
        self.user_two.save()

        # setup memberships / teams
        self.team_one = baker.make("root.Team")
        self.team_one.members.add(self.user_one)

        # setup event
        self.event = baker.make("root.Event", user=self.user_one, team=self.team_one)
        self.event.transition_live(save=True, ignore_google_api=True)

        # setup event tiers
        # - free tier
        self.ticket_tier = baker.make(
            "root.TicketTier",
            capacity=randint(1, 10000),
            event=self.event,
            tier_free=baker.make("root.TierFree"),
        )

        # - asset ownership tier
        self.ticket_tier_two = baker.make(
            "root.TicketTier",
            capacity=randint(1, 10000),
            event=self.event,
            tier_asset_ownership=baker.make("root.TierAssetOwnership"),
        )

        # setup checkout session / items / ticket
        # - free tier
        self.checkout_session = baker.make(
            "root.CheckoutSession",
            event=self.event,
            tx_type=CheckoutSession.TransactionType.FREE,
        )
        self.checkout_item = baker.make(
            "CheckoutItem",
            ticket_tier=self.ticket_tier,
            checkout_session=self.checkout_session,
        )
        # TODO: Use checkout code here
        self.ticket = baker.make(
            "Ticket",
            checkout_item=self.checkout_item,
            event=self.event,
            ticket_tier=self.ticket_tier,
        )
        # TODO: Improve returning access keys (currently just URL format)
        self.redemption_access_key = self.event.ticketredemptionkey_set.first()
        self.access_key = self.redemption_access_key.public_id


class BaseTestCaseWrapper(BaseModelScaffold, TestCase):
    pass


class LocalDBScaffold(BaseModelScaffold):
    def setUp(self):
        # Delete test data (user_one / user_two)
        User.objects.filter(username="user_one").delete()
        User.objects.filter(username="user_two").delete()

        # Create superuser
        queryset = User.objects.filter(username="admin")
        if not queryset.exists():
            User.objects.create_superuser("admin", "admin@admin.com", "password")

        # Delete user / related data
        return super(LocalDBScaffold, self).setUp()  # Call parent class method
