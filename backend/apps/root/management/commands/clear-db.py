from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """
    Custom command to clear database.
    The command drops the database, creates a new database and
    apply all migrations
    """

    help = "Clear all data from models"

    def handle(self, *args, **kwargs) -> None:
        """
        Execute clear-db command
        """
        self.stdout.write("CLEANING UP DATABASE...")

        # reset and migrate
        call_command(
            "reset_db", verbosity=3, interactive=False
        )  # command from django-extensions package
        call_command("migrate", verbosity=3, interactive=False)

        self.stdout.write(
            self.style.SUCCESS("THE DATABASE HAS BEEN RESET SUCCESSFULLY")
        )
