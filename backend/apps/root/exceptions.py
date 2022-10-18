from django.core.exceptions import ValidationError


class EventStateTranstionError(ValidationError):
    pass


class ForbiddenRedemptionError(ValidationError):
    pass


class AlreadyRedeemedError(ValidationError):
    pass


class TooManyTicketsRequestedError(ValidationError):
    pass
