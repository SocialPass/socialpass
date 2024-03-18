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
class AssetOwnershipCheckoutError(Exception):
    pass

class FreeCheckoutError(Exception):
    pass



