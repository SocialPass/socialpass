# Generated by Django 5.0.3 on 2024-04-01 19:06

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0163_remove_tickettier_price_per_ticket_cents"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tickettier",
            name="network",
            field=models.IntegerField(
                choices=[
                    (42161, "Arbitrum"),
                    (43114, "Avalanche"),
                    (8453, "Base"),
                    (84531, "Base (Goerli Testnet)"),
                    (84532, "Base (Sepolia Testnet)"),
                    (56, "Binance Smart Chain"),
                    (97, "Binance Smart Chain (Testnet)"),
                    (25, "Cronos"),
                    (1, "Ethereum"),
                    (5, "Ethereum (Görli Testnet)"),
                    (17000, "Ethereum (Holesky Testnet)"),
                    (11155111, "Ethereum (Sepolia Testnet)"),
                    (250, "Fantom"),
                    (100, "Gnosis"),
                    (10200, "Gnosis (Chiado Testnet)"),
                    (10, "Optimism"),
                    (11297108109, "Palm"),
                    (137, "Polygon"),
                    (80001, "Polygon (Mumbai Testnet)"),
                ],
                default=1,
                help_text="Which blockchain is your NFT collection on?",
            ),
        ),
    ]
