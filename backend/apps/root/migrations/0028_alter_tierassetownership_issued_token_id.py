# Generated by Django 4.0.8 on 2022-11-08 14:05

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0027_remove_tickettier_quantity_sold"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tierassetownership",
            name="issued_token_id",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.IntegerField(), blank=True, default=list, size=None
            ),
        ),
    ]
