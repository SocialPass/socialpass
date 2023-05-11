from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """
    Custom command to pre-populate database with fake data.
    The command also creates a super-user admin@admin.com with
    password equals to 'password'
    """

    help = "populate database with fake data"

    def handle(self, *args, **kwargs):
        return
