# Stores schemas for model JSON fields (and alike)

import copy

from .model_field_choices import ASSET_TYPES, BLOCKCHAINS, CHAIN_IDS, SOFTWARE_TYPES

BLOCKCHAINS_ENUM = []
for item in BLOCKCHAINS:
    BLOCKCHAINS_ENUM.append(item[1])

CHAIN_ID_ENUM = []
for item in CHAIN_IDS:
    CHAIN_ID_ENUM.append(item[0])

ASSET_TYPES_ENUM = []
for item in ASSET_TYPES:
    ASSET_TYPES_ENUM.append(item[1])


SOFTWARE_TYPES_ENUM = []
for item in SOFTWARE_TYPES:
    SOFTWARE_TYPES_ENUM.append(item[1])


REQUIREMENTS_SCHEMA = {
    "type": "array",
    "title": "Blockchain Requirements",
    "minItems": 1,
    "properties": {},
    "items": {
        "title": "Requirement",
        "type": "object",
        "required": ["blockchain", "asset_address", "amount"],
        "properties": {
            "blockchain": {
                "type": "string",
                "title": "blockchain",
                "enum": BLOCKCHAINS_ENUM
            },
            "chain_id": {
                "type": "integer",
                "title": "Chain ID",
                "enum": CHAIN_ID_ENUM
            },
            "asset_type": {
                "type": "string",
                "title": "Asset Type",
                "enum": ASSET_TYPES_ENUM
            },
            "asset_address": {
                "type": "string",
                "title": "Asset Address",
                "pattern": "^(0x|0X).*$"
            },
            "amount": {
                "type": "integer",
                "title": "Required Amount",
                "default": 1,
                "minimum": 1
            },
            "token_id": {
                "type": "array",
                "title": "Token IDs",
                "items": {"type": "integer", "title": "Token ID"}, "minItems": 0
            },
        },
    },
}


REQUIREMENTS_SCHEMA_REQUIRED = copy.deepcopy(REQUIREMENTS_SCHEMA)
REQUIREMENTS_SCHEMA_REQUIRED["minItems"] = 1


SOFTWARE_TYPES_SCHEMA = {
    "type": "array",
    "items": {"type": "string", "enum": SOFTWARE_TYPES_ENUM},
    "minItems": 1,
}
