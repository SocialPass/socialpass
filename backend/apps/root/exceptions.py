class ForbiddenRedemptionError(Exception):
    pass


class AlreadyRedeemed(Exception):
    pass


class InvalidEmbedCodeError(Exception):
    pass


class TooManyTicketsRequestedError(Exception):
    pass


class TooManyTicketsIssuedError(Exception):
    pass


class TicketsSoldOutError(Exception):
    pass


class ZeroBlockchainAssetsError(Exception):
    pass


class PartialBlockchainAssetError(Exception):
    pass
