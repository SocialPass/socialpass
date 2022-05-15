# Stores choices for model fields

TOKENGATE_TYPES = (("TICKET", "TICKET"),)

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


SOFTWARE_TYPES = (("TICKET", "TICKET"),)

STIPE_PAYMENT_STATUSES = (
    ("PENDING", "PENDING"), # checkout session created
    ("PROCESSING", "PROCESSING"), # stripe has already called back
    ("CANCELLED", "CANCELLED"), # stripe has called back with a cancel
    ("SUCCESS", "SUCCESS"), # stripe's async aknowledgement of the payment with success
    ("FAILURE", "FAILURE"), # stripe's async aknowledgement of the payment with error
)