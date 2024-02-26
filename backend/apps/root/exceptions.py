from django.core.exceptions import ValidationError


class BaseValidationError(ValidationError):
    pass

class AlreadyRedeemedError(BaseValidationError):
    pass

class EventStateTranstionError(BaseValidationError):
    pass

class ForbiddenRedemptionError(BaseValidationError):
    pass

class GoogleWalletAPIRequestError(BaseValidationError):
    pass

# Transaction Exceptions
class TxAssetOwnershipProcessingError(Exception):
    pass

class TxFreeProcessingError(Exception):
    pass



