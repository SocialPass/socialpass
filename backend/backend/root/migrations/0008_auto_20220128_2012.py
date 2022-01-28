# Generated by Django 3.2.11 on 2022-01-28 20:12

from django.db import migrations, models
import root.validators


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0007_ticketgate_requirements'),
    ]

    operations = [
        migrations.AlterField(
            model_name='airdropgate',
            name='requirements',
            field=models.JSONField(blank=True, default=list, null=True, validators=[root.validators.JSONSchemaValidator(limit_value={'items': {'properties': {'amount': {'minimum': 1, 'type': 'integer'}, 'asset_address': {'pattern': '^(0x|0X).*$', 'type': 'string'}, 'asset_type': {'enum': ['ERC20', 'ERC721', 'ERC1155'], 'type': 'string'}, 'chain': {'enum': ['ETHEREUM', 'WAX'], 'type': 'string'}, 'token_id': {'items': {'type': 'integer'}, 'minItems': 0, 'type': 'array'}}, 'required': ['chain', 'asset_type', 'asset_address', 'amount'], 'type': 'object'}, 'minItems': 1, 'type': 'array'})]),
        ),
        migrations.AlterField(
            model_name='ticketgate',
            name='requirements',
            field=models.JSONField(default=list, validators=[root.validators.JSONSchemaValidator(limit_value={'items': {'properties': {'amount': {'minimum': 1, 'type': 'integer'}, 'asset_address': {'pattern': '^(0x|0X).*$', 'type': 'string'}, 'asset_type': {'enum': ['ERC20', 'ERC721', 'ERC1155'], 'type': 'string'}, 'chain': {'enum': ['ETHEREUM', 'WAX'], 'type': 'string'}, 'token_id': {'items': {'type': 'integer'}, 'minItems': 0, 'type': 'array'}}, 'required': ['chain', 'asset_type', 'asset_address', 'amount'], 'type': 'object'}, 'minItems': 1, 'type': 'array'})]),
        ),
    ]
