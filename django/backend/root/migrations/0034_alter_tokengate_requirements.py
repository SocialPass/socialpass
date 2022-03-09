# Generated by Django 3.2.11 on 2022-03-09 16:28

from django.db import migrations, models
import root.validators


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0033_auto_20220308_2039'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tokengate',
            name='requirements',
            field=models.JSONField(blank=True, default=list, null=True, validators=[root.validators.JSONSchemaValidator(limit_value={'items': {'anyOf': [{'properties': {'blockchain': {'enum': ['EVM']}}, 'required': ['chain_id', 'asset_type', 'asset_address']}], 'properties': {'amount': {'minimum': 1, 'type': 'integer'}, 'asset_address': {'pattern': '^(0x|0X).*$', 'type': 'string'}, 'asset_type': {'enum': ['ERC20', 'ERC721', 'ERC1155'], 'type': 'string'}, 'blockchain': {'enum': ['EVM'], 'type': 'string'}, 'chain_id': {'enum': [1, 2, 4, 56, 43114, 137], 'type': 'integer'}, 'token_id': {'items': {'type': 'integer'}, 'minItems': 0, 'type': 'array'}}, 'required': ['blockchain', 'amount'], 'type': 'object'}, 'type': 'array'})]),
        ),
    ]
