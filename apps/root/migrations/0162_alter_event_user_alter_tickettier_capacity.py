# Generated by Django 5.0.2 on 2024-03-25 16:09

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0161_delete_manualattendee"),
    ]

    operations = [
        migrations.AlterField(
            model_name="event",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="tickettier",
            name="capacity",
            field=models.IntegerField(
                default=1,
                help_text="Maximum amount of attendees for your event.",
                validators=[django.core.validators.MinValueValidator(1)],
            ),
        ),
    ]