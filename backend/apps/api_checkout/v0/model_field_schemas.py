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

BLOCKCHAINS_ENUM = []
for blockchain_item in BLOCKCHAINS:
    BLOCKCHAINS_ENUM.append(blockchain_item[1])

CHAIN_ID_ENUM = []
for chain_item in CHAIN_IDS:
    CHAIN_ID_ENUM.append(chain_item[0])

ASSET_TYPES_ENUM = []
for asset_type_item in ASSET_TYPES:
    ASSET_TYPES_ENUM.append(asset_type_item[1])

REQUIREMENT = {
    "title": "Requirement",
    "type": "object",
    "required": ["blockchain", "asset_address", "amount", "chain_id", "asset_type"],
    "properties": {
        "blockchain": {
            "type": "string",
            "title": "Blockchain",
            "enum": BLOCKCHAINS_ENUM,
        },
        "chain_id": {"type": "integer", "title": "Network", "enum": CHAIN_ID_ENUM},
        "asset_type": {
            "type": "string",
            "title": "Asset Type",
            "enum": ASSET_TYPES_ENUM,
        },
        "asset_address": {
            "type": "string",
            "title": "Asset Address",
            "pattern": "^(0x|0X).*$",
        },
        "amount": {
            "type": "integer",
            "title": "Required Amount",
            "format": "number",
            "minimum": 1,
        },
        "to_block": {
            "type": "integer",
            "title": "Snapshot block (for fungible tokens)",
            "format": "number",
            "minimum": 1,
        },
        "token_id": {
            "type": "array",
            "title": "Token IDs",
            "items": {
                "type": "integer",
                "title": "Token ID",
            },
            "minItems": 0,
        },
    },
}

REQUIREMENT_SCHEMA = {
    "type": "object",
    "title": "Blockchain Requirements",
    "format": "tabs",
    "properties": REQUIREMENT,
}

BLOCKCHAIN_REQUIREMENTS_SCHEMA = {
    "type": "array",
    "title": "Blockchain Requirements",
    "format": "tabs",
    "properties": {},
    "items": REQUIREMENT,
}
