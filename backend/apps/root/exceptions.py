# Event exceptions
class EventStateTranstionError(Exception):
    pass

class GoogleWalletAPIRequestError(Exception):
    pass

# Checkout Session exceptions
class AssetOwnershipCheckoutError(Exception):
    pass

class FreeCheckoutError(Exception):
    pass

# Scanner exceptions
class ForbiddenRedemptionError(Exception):
    pass

class AlreadyRedeemedError(Exception):
    pass