# Generated by Django 5.0.1 on 2024-02-07 06:00

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0098_tickettier_tx_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="waiting_queue_enabled",
            field=models.BooleanField(default=False),
        ),
    ]