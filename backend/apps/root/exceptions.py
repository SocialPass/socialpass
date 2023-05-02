from django.core.exceptions import ValidationError


class BaseValidationError(ValidationError):
    pass


class EventStateTranstionError(BaseValidationError):
    pass


class ForbiddenRedemptionError(BaseValidationError):
    pass


class AlreadyRedeemedError(BaseValidationError):
    pass


class TooManyTicketsRequestedError(BaseValidationError):
    pass


class DuplicatesTiersRequestedError(BaseValidationError):
    pass


class ConflictingTiersRequestedError(BaseValidationError):
    pass


class ForeignKeyConstraintError(BaseValidationError):
    pass


class TxAssetOwnershipProcessingError(BaseValidationError):
    pass


class CheckoutSessionExpired(BaseValidationError):
    pass


class GoogleWalletAPIRequestError(BaseValidationError):
    pass


class TooManyGuestsError(BaseValidationError):
    pass
