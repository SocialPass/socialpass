# Generated by Django 5.0.2 on 2024-03-13 00:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0113_rename_tx_type_tickettier_category"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="tickettier",
            name="tier_blockchain",
        ),
        migrations.DeleteModel(
            name="TierBlockchain",
        ),
    ]
