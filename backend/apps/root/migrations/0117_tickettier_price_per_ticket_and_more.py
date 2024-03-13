# Generated by Django 5.0.2 on 2024-03-13 02:25

import django.core.validators
import django.db.models.expressions
import django.db.models.functions.math
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0116_migrate_tier_asset_ownership"),
    ]

    operations = [
        migrations.AddField(
            model_name="tickettier",
            name="price_per_ticket",
            field=models.DecimalField(
                decimal_places=2,
                default=0,
                help_text="Price of one ticket for this tier.",
                max_digits=19,
                validators=[django.core.validators.MinValueValidator(0)],
            ),
        ),
        migrations.AddField(
            model_name="tickettier",
            name="price_per_ticket_cents",
            field=models.GeneratedField(
                db_persist=True,
                expression=django.db.models.functions.math.Round(
                    django.db.models.expressions.CombinedExpression(
                        models.F("price_per_ticket"), "*", models.Value(100)
                    )
                ),
                output_field=models.IntegerField(),
            ),
        ),
    ]
