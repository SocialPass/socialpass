# Generated by Django 4.2 on 2023-04-20 16:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0041_checkoutitem_extra_party"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tickettier",
            name="ticket_type",
            field=models.CharField(
                help_text="A short descriptive label for your ticket tier.",
                max_length=255,
            ),
        ),
    ]