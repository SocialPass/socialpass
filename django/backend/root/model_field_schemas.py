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
    "items": {
        "type": "object",
        "properties": {
            "blockchain": {"type": "string", "enum": BLOCKCHAINS_ENUM},
            "chain_id": {"type": "string", "enum": CHAIN_ID_ENUM},
            "asset_type": {"type": "string", "enum": ASSET_TYPES_ENUM},
            "asset_address": {"type": "string", "pattern": "^(0x|0X).*$"},
            "amount": {"type": "integer", "minimum": 1},
            "token_id": {"type": "array", "items": {"type": "integer"}, "minItems": 0},
        },
        "required": ["blockchain", "amount"],
        "anyOf": [
            {
              "properties": {
                "blockchain": { "enum": ["EVM"] }
              },
              "required": ["chain_id", "asset_type", "asset_address"]
            }
        ]
    },
}


REQUIREMENTS_SCHEMA_REQUIRED = copy.deepcopy(REQUIREMENTS_SCHEMA)
REQUIREMENTS_SCHEMA_REQUIRED["minItems"] = 1


SOFTWARE_TYPES_SCHEMA = {
    "type": "array",
    "items": {
        "type": "string",
        "enum": SOFTWARE_TYPES_ENUM
    },
    "minItems": 1
}
