from django.core.exceptions import ValidationError


class BaseValidationError(ValidationError):
    pass


class EventStateTranstionError(BaseValidationError):
    pass


class ForbiddenRedemptionError(BaseValidationError):
    pass


class AlreadyRedeemedError(BaseValidationError):
    pass


class TxAssetOwnershipProcessingError(BaseValidationError):
    pass


class TxFreeProcessingError(BaseValidationError):
    pass


class GoogleWalletAPIRequestError(BaseValidationError):
    pass


class TxCreationError(BaseValidationError):
    pass