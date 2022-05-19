# Stores schemas for model JSON fields (and alike)
from .model_field_choices import ASSET_TYPES, BLOCKCHAINS, CHAIN_IDS

BLOCKCHAINS_ENUM = []
for item in BLOCKCHAINS:
    BLOCKCHAINS_ENUM.append(item[1])

CHAIN_ID_ENUM = []
for item in CHAIN_IDS:
    CHAIN_ID_ENUM.append(item[0])

ASSET_TYPES_ENUM = []
for item in ASSET_TYPES:
    ASSET_TYPES_ENUM.append(item[1])

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

REQUIREMENTS_SCHEMA = {
    "type": "array",
    "title": "Blockchain Requirements",
    "format": "tabs",
    "properties": {},
    "items": REQUIREMENT,
}
