# Generated by Django 5.0.2 on 2024-03-13 18:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0122_migrate_tickettier_category"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="tickettier",
            name="tier_asset_ownership",
        ),
        migrations.DeleteModel(
            name="TierAssetOwnership",
        ),
    ]