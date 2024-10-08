# Generated by Django 4.0.8 on 2022-10-19 00:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0017_remove_tickettier_price"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tickettier",
            name="tier_asset_ownership",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="root.tierassetownership",
            ),
        ),
        migrations.AlterField(
            model_name="tickettier",
            name="tier_blockchain",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="root.tierblockchain",
            ),
        ),
        migrations.AlterField(
            model_name="tickettier",
            name="tier_fiat",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="root.tierfiat",
            ),
        ),
    ]
