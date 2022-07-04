# Generated by Django 4.0.5 on 2022-06-26 22:06

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0013_alter_event_capacity_alter_event_description"),
    ]

    operations = [
        migrations.AlterField(
            model_name="event",
            name="capacity",
            field=models.IntegerField(
                blank=True,
                null=True,
                validators=[django.core.validators.MinValueValidator(1)],
            ),
        ),
        migrations.AlterField(
            model_name="event",
            name="description",
            field=models.TextField(blank=True),
        ),
    ]
