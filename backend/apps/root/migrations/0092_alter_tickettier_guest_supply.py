# Generated by Django 4.2.6 on 2023-12-21 10:24

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0091_rename_event_capacity_event_total_capacity"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tickettier",
            name="guest_supply",
            field=models.IntegerField(
                blank=True,
                help_text="Denotes the total guest capacity.",
                null=True,
                validators=[django.core.validators.MinValueValidator(0)],
            ),
        ),
    ]
