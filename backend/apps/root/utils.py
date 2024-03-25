from django.utils.crypto import get_random_string


def get_random_passcode():
    """
    Get a random 6-digit passcode.
    """
    return get_random_string(6)
