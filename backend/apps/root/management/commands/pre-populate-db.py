from django.core.management.base import BaseCommand

from apps.root.factories import (
    BlockchainOwnershipFactory,
    EventFactory,
    MembershipFactory,
    TeamFactory,
    TicketFactory,
    TicketRedemptionKeyFactory,
)
from apps.root.models import User


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

    def handle(self, *args, **kwargs) -> None:
        """Execute database population"""

        self.stdout.write("POPULATING DATABASE")

        # get number of events and tickets
        num_events = kwargs["events"] or 1
        num_tickets = kwargs["tickets"] or 1

        # creates user, team and Membership
        user = self.create_super_user()
        team = TeamFactory()
        MembershipFactory(user=user, team=team)

        for _ in range(num_events):

            # create events and BlockchainOwnership
            event = EventFactory(team=team, user=user)
            BlockchainOwnershipFactory(event=event)

            # create Tickets and TicketRedemptionKeys
            for _ in range(num_tickets):
                TicketFactory(event=event)
                TicketRedemptionKeyFactory(event=event)

        self.stdout.write(
            self.style.SUCCESS(
                "THE DATABASE POPULATE HAS BEEN POPULATED WITH FAKE DATA"
            )
        )

    def create_super_user(self):
        """
        create a superuser
            username: admin
            email: admin@admin.com
            password: password
        """

        queryset = User.objects.filter(name="admin", email="admin@admin.com")

        if queryset.exists():
            return queryset.first()
        else:
            return User.objects.create_superuser("admin", "admin@admin.com", "password")
