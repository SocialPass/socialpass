# Generated by Django 5.0.2 on 2024-03-13 00:22

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0114_remove_tickettier_tier_blockchain_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="tickettier",
            name="asset_type",
            field=models.CharField(
                choices=[("NFT", "NFT")], default="NFT", max_length=50
            ),
        ),
        migrations.AddField(
            model_name="tickettier",
            name="balance_required",
            field=models.IntegerField(
                default=1,
                help_text="The number of NFTs required to claim your ticket tier.",
            ),
        ),
        migrations.AddField(
            model_name="tickettier",
            name="blockchain",
            field=models.CharField(
                choices=[("ETH", "Ethereum")], default="ETH", max_length=50
            ),
        ),
        migrations.AddField(
            model_name="tickettier",
            name="deprecated_issued_token_id",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.IntegerField(), blank=True, default=list, size=None
            ),
        ),
        migrations.AddField(
            model_name="tickettier",
            name="network",
            field=models.IntegerField(
                choices=[
                    (1, "Ethereum"),
                    (5, "Ethereum (Goerli TestNet)"),
                    (11155111, "Ethereum (Sepolia TestNet)"),
                    (80001, "Ethereum (Mumbai TestNet)"),
                    (137, "Polygon"),
                    (56, "Binance Smart Chain"),
                    (97, "Binance Smart Chain (TestNet)"),
                    (43114, "Avalanche"),
                    (43113, "Avalanche (TestNet)"),
                    (250, "Fantom"),
                    (25, "Cronos"),
                    (338, "Cronos (TestNet)"),
                    (42161, "Arbitrum"),
                ],
                default=1,
                help_text="Which blockchain is your NFT collection on?",
            ),
        ),
        migrations.AddField(
            model_name="tickettier",
            name="token_address",
            field=models.CharField(
                default="",
                help_text="What is the contract address of your NFT collection?",
                max_length=42,
            ),
        ),
        migrations.AddField(
            model_name="tickettier",
            name="token_id",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.IntegerField(),
                blank=True,
                help_text="Which specific token IDs of the NFT collection are required?",
                null=True,
                size=None,
            ),
        ),
    ]
