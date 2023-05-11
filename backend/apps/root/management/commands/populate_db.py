from django.core.management.base import BaseCommand
from apps.root.testing import LocalDBScaffold


class Command(BaseCommand):
    """
    Custom command to pre-populate database with fake data.
    The command also creates a super-user admin@admin.com with
    password equals to 'password'
    """

    help = "populate database with fake data"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Populating..."))
        LocalDBScaffold.setUp(self)
        self.stdout.write(
            self.style.SUCCESS("Mock data has been populated in the database!")
        )
