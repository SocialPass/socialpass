from django.core.exceptions import ValidationError


class EventStateTranstionError(ValidationError):
    pass


class ForbiddenRedemptionError(ValidationError):
    pass


class AlreadyRedeemedError(ValidationError):
    pass


class TooManyTicketsRequestedError(ValidationError):
    pass


class DuplicatesTiersRequestedError(ValidationError):
    pass


class ConflictingTiersRequestedError(ValidationError):
    pass


class ForeignKeyConstraintError(ValidationError):
    pass


class AssetOwnershipSignatureError(ValidationError):
    pass


class AssetOwnershipAddressError(ValidationError):
    pass
