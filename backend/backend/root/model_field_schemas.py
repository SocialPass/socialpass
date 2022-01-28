# Stores schemas for model JSON fields (and alike)

from .model_field_choices import BLOCKCHAINS, ASSET_TYPES


BLOCKCHAINS_ENUM = []
for item in BLOCKCHAINS:
	BLOCKCHAINS_ENUM.append(item[0])


ASSET_TYPES_ENUM = []
for item in ASSET_TYPES:
	ASSET_TYPES_ENUM.append(item[0])


REQUIREMENTS_SCHEMA = {
	"type": "array",
	"items": {
		"type": "object",
		"properties": {
			"chain": {
				"type": "string",
				"enum": BLOCKCHAINS_ENUM
			},
			"asset_type": {
				"type": "string",
				"enum": ASSET_TYPES_ENUM
			},
			"asset_address": {
				"type": "string",
				"pattern": "^(0x|0X).*$"
			},
			"amount": {
				"type": "integer",
				"minimum": 1
			},
			"token_id": {
				"type": "array",
				"items": {
					"type": "integer"
				},
				"minItems": 0
			}
		},
		"required": ["chain", "asset_type", "asset_address", "amount"]
	}
}
