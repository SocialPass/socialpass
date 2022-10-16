from django.core.exceptions import ValidationError


class ForbiddenRedemptionError(Exception):
    pass


class AlreadyRedeemed(Exception):
    pass


class InvalidEmbedCodeError(Exception):
    pass


class TooManyTicketsRequestedError(ValidationError):
    pass
