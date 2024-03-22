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

# 3rd Party API Exceptions
# Google
class GoogleWalletAPIRequestError(Exception):
    pass