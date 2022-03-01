# Generated by Django 3.2.11 on 2022-02-25 14:12

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields
import root.validators


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0025_alter_signature_signing_message"),
    ]

    operations = [
        migrations.CreateModel(
            name="Airdrop",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                ("wallet_address", models.CharField(max_length=400)),
                ("transaction_hash", models.CharField(max_length=400)),
                (
                    "signature",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="airdrops",
                        to="root.signature",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Ticket",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                ("wallet_address", models.CharField(max_length=400)),
                ("ticket_url", models.URLField()),
                (
                    "signature",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="tickets",
                        to="root.signature",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.RemoveField(
            model_name="ticketlist",
            name="tokengate",
        ),
        migrations.AddField(
            model_name="team",
            name="image",
            field=models.ImageField(max_length=255, null=True, upload_to=""),
        ),
        migrations.AlterField(
            model_name="airdropgate",
            name="requirements",
            field=models.JSONField(
                blank=True,
                default=list,
                null=True,
                validators=[
                    root.validators.JSONSchemaValidator(
                        limit_value={
                            "items": {
                                "properties": {
                                    "amount": {"minimum": 1, "type": "integer"},
                                    "asset_address": {
                                        "pattern": "^(0x|0X).*$",
                                        "type": "string",
                                    },
                                    "asset_type": {
                                        "enum": ["ERC20", "ERC721", "ERC1155"],
                                        "type": "string",
                                    },
                                    "chain": {
                                        "enum": [
                                            "Ethereum",
                                            "BNB Chain",
                                            "Avalanche",
                                            "Polygon",
                                        ],
                                        "type": "string",
                                    },
                                    "token_id": {
                                        "items": {"type": "integer"},
                                        "minItems": 0,
                                        "type": "array",
                                    },
                                },
                                "required": [
                                    "chain",
                                    "asset_type",
                                    "asset_address",
                                    "amount",
                                ],
                                "type": "object",
                            },
                            "type": "array",
                        }
                    )
                ],
            ),
        ),
        migrations.AlterField(
            model_name="ticketgate",
            name="requirements",
            field=models.JSONField(
                default=list,
                validators=[
                    root.validators.JSONSchemaValidator(
                        limit_value={
                            "items": {
                                "properties": {
                                    "amount": {"minimum": 1, "type": "integer"},
                                    "asset_address": {
                                        "pattern": "^(0x|0X).*$",
                                        "type": "string",
                                    },
                                    "asset_type": {
                                        "enum": ["ERC20", "ERC721", "ERC1155"],
                                        "type": "string",
                                    },
                                    "chain": {
                                        "enum": [
                                            "Ethereum",
                                            "BNB Chain",
                                            "Avalanche",
                                            "Polygon",
                                        ],
                                        "type": "string",
                                    },
                                    "token_id": {
                                        "items": {"type": "integer"},
                                        "minItems": 0,
                                        "type": "array",
                                    },
                                },
                                "required": [
                                    "chain",
                                    "asset_type",
                                    "asset_address",
                                    "amount",
                                ],
                                "type": "object",
                            },
                            "minItems": 1,
                            "type": "array",
                        }
                    )
                ],
            ),
        ),
        migrations.DeleteModel(
            name="AirdropList",
        ),
        migrations.DeleteModel(
            name="TicketList",
        ),
        migrations.AddField(
            model_name="ticket",
            name="tokengate",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="tickets",
                to="root.ticketgate",
            ),
        ),
        migrations.AddField(
            model_name="airdrop",
            name="tokengate",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="airdrops",
                to="root.airdropgate",
            ),
        ),
    ]
