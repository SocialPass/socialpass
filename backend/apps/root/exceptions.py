from django.core.exceptions import ValidationError


class ForbiddenRedemptionError(ValidationError):
    pass


class AlreadyRedeemed(ValidationError):
    pass


class TooManyTicketsRequestedError(ValidationError):
    pass
