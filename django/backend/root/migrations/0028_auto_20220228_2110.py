# Generated by Django 3.2.11 on 2022-02-28 21:10

from django.db import migrations, models
import root.validators


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0027_alter_team_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='airdropgate',
            name='chain',
            field=models.CharField(choices=[('EVM', 'Ethereum Virtual Machine')], max_length=50),
        ),
        migrations.AlterField(
            model_name='airdropgate',
            name='requirements',
            field=models.JSONField(blank=True, default=list, null=True, validators=[root.validators.JSONSchemaValidator(limit_value={'items': {'properties': {'amount': {'minimum': 1, 'type': 'integer'}, 'asset_address': {'pattern': '^(0x|0X).*$', 'type': 'string'}, 'asset_type': {'enum': ['ERC20', 'ERC721', 'ERC1155'], 'type': 'string'}, 'blockchain': {'enum': ['Ethereum Virtual Machine'], 'type': 'string'}, 'chain_id': {'enum': (('1', 'Ethereum'), ('56', 'BNB Chain'), ('43114', 'Avalanche'), ('137', 'Polygon')), 'type': 'string'}, 'token_id': {'items': {'type': 'integer'}, 'minItems': 0, 'type': 'array'}}, 'required': ['blockchain'], 'type': 'object'}, 'type': 'array'})]),
        ),
        migrations.AlterField(
            model_name='ticketgate',
            name='requirements',
            field=models.JSONField(default=list, validators=[root.validators.JSONSchemaValidator(limit_value={'items': {'properties': {'amount': {'minimum': 1, 'type': 'integer'}, 'asset_address': {'pattern': '^(0x|0X).*$', 'type': 'string'}, 'asset_type': {'enum': ['ERC20', 'ERC721', 'ERC1155'], 'type': 'string'}, 'blockchain': {'enum': ['Ethereum Virtual Machine'], 'type': 'string'}, 'chain_id': {'enum': (('1', 'Ethereum'), ('56', 'BNB Chain'), ('43114', 'Avalanche'), ('137', 'Polygon')), 'type': 'string'}, 'token_id': {'items': {'type': 'integer'}, 'minItems': 0, 'type': 'array'}}, 'required': ['blockchain'], 'type': 'object'}, 'minItems': 1, 'type': 'array'})]),
        ),
    ]
