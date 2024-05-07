# Generated by Django 5.0.1 on 2024-01-26 09:10

import django.db.models.expressions
import django.db.models.functions.math
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0096_ticket_extra_party_alter_event_fiat_currency"),
    ]

    operations = [
        migrations.AddField(
            model_name="tierfiat",
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