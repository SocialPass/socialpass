from enum import Enum

EVENT_VISIBILITY = (
    ("PUBLIC", "Public"),
    ("PRIVATE", "Private"),
)

# Stores choices for model fields
BLOCKCHAINS = (("EVM", "EVM"),)


CHAIN_IDS = (
    (1, "Ethereum"),
    (2, "Ropsten"),
    (4, "Rinkeby"),
    (56, "BNB Chain"),
    (43114, "Avalanche"),
    (137, "Polygon"),
)


ASSET_TYPES = (("ERC20", "ERC20"), ("ERC721", "ERC721"), ("ERC1155", "ERC1155"))


STIPE_PAYMENT_STATUSES = (
    ("PENDING", "Pending"),  # checkout session created
    ("PROCESSING", "Processing"),  # stripe has already called back
    ("CANCELLED", "Cancelled"),  # stripe has called back with a cancel
    (
        "SUCCESS",
        "Succeeded",
    ),  # stripe's async aknowledgement of the payment with success
    ("FAILURE", "Failed"),  # stripe's async aknowledgement of the payment with error
)


class EventStatusEnum(Enum):

    DRAFT = "Draft"
    STAGED = "Staged"
    PENDING_CHECKOUT = "Pending Checkout"
    SCHEDULED = "Scheduled"
    PUBLISHED = "Published"
