from django.utils import timezone
from django.utils.crypto import get_random_string


def get_random_passcode():
    """
    Get a random 6-digit passcode.
    """
    return get_random_string(6)


def get_expiration_datetime():
    """
    Get current datetime + 10 minutes
    """
    return timezone.now() + timezone.timedelta(hours=24)
