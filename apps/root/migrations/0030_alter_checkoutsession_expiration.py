# Generated by Django 4.0.8 on 2022-11-23 13:41

import apps.root.models
from django.db import migrations, models
from django.utils import timezone


def get_expiration_datetime():
    """
    Get current datetime + 10 minutes
    """
    return timezone.now() + timezone.timedelta(hours=24)


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0029_remove_event_localized_address_display"),
    ]

    operations = [
        migrations.AlterField(
            model_name="checkoutsession",
            name="expiration",
            field=models.DateTimeField(
                blank=True, default=get_expiration_datetime, null=True
            ),
        ),
    ]
