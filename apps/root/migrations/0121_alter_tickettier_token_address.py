# Generated by Django 5.0.2 on 2024-03-13 16:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0120_migrate_tier_free"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tickettier",
            name="token_address",
            field=models.CharField(
                blank=True,
                default="",
                help_text="What is the contract address of your NFT collection?",
                max_length=42,
            ),
        ),
    ]
