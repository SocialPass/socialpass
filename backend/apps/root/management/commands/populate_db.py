from typing import Optional

from django.core.management.base import BaseCommand

from apps.root.factories import (
    CheckoutItemFactory,
    CheckoutSessionFactory,
    EventFactory,
    MembershipFactory,
    TeamFactory,
    TicketFactory,
    TicketRedemptionKeyFactory,
    TicketTierFactory,
    UserFactory,
)
from apps.root.models import Team, User


class Command(BaseCommand):
    """
    Custom command to pre-populate database with fake data.
    The command also creates a super-user admin@admin.com with
    password equals to 'password'
    """

    help = "populate database with fake data"

    def add_arguments(self, parser) -> None:
        """
        Add params to pre-populate database.
        --events param refer to how many Events will be created
        --tickets params refer to how many Tickets will be created per Event
        """
        parser.add_argument(
            "-e",
            "--events",
            type=int,
            help="Number of Events to be created",
        )
        parser.add_argument(
            "-t",
            "--tickets",
            type=int,
            help="Number of Tickets per Event to be created",
        )
        parser.add_argument(
            "-u",
            "--user-default",
            type=bool,
            help="If true, create a user with email user@dummy.com",
        )

    def handle(self, *args, **kwargs) -> None:
        """Execute database population"""
        self.stdout.write("POPULATING DATABASE")

        # get number of events and tickets

        num_events = kwargs["events"] or 1
        num_tickets = kwargs["tickets"] or 1
        user_default = kwargs["user_default"]

        # creates superuser
        self.create_superuser()

        # creates user, team and Membership
        user, team = self.create_user_and_team(user_default)

        try:
            MembershipFactory(user=user, team=team)
        except Exception as e:  # noqa
            self.stdout.write("SKIPPING MEMBERSHIP CREATION")

        for _ in range(num_events):
            # create events, tier, checkout session and item
            event = EventFactory(team=team, user=user)
            ticket_tier = TicketTierFactory(event=event)
            checkout_session = CheckoutSessionFactory(event=event)
            checkout_item = CheckoutItemFactory(
                ticket_tier=ticket_tier, checkout_session=checkout_session
            )

            # create Tickets and TicketRedemptionKeys
            for _ in range(num_tickets):
                TicketFactory(
                    checkout_item=checkout_item, ticket_tier=ticket_tier, event=event
                )
                TicketRedemptionKeyFactory(event=event)

        self.stdout.write(
            self.style.SUCCESS(
                "THE DATABASE POPULATE HAS BEEN POPULATED WITH FAKE DATA"
            )
        )

    def create_superuser(self) -> None:
        """
        create a superuser if not exists
            username: admin
            email: admin@admin.com
            password: password
        """
        queryset = User.objects.filter(username="admin")

        if not queryset.exists():
            User.objects.create_superuser("admin", "admin@admin.com", "password")

    def create_user_and_team(self, default: bool):
        """
        create a user and a team `default team` if not exists
            username: Dummy User
            email: user@dummy.com
            password: password
        """
        user: Optional[User]
        team: Optional[Team]

        if default:
            user_qs = User.objects.filter(username="dummy_user")
            if not user_qs.exists():
                user = UserFactory(username="dummy_user", email="user@dummy.com")
                team = TeamFactory(name="Default Team")
            else:
                user = user_qs.first()
                team = Team.objects.filter(name="Default Team").first()
        else:
            user = UserFactory()
            team = TeamFactory()

        return user, team
