# Generated by Django 5.0.2 on 2024-03-12 23:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0108_rename_delegated_wallets_txassetownership_delegated_wallet"),
    ]

    operations = [
        migrations.RenameField(
            model_name="tickettier",
            old_name="hidden_tickets",
            new_name="hidden_availability",
        ),
    ]
