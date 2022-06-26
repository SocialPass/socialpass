# Generated by Django 4.0.5 on 2022-06-25 21:51

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0008_eventlocation_event_location"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="custom_url_path",
            field=models.CharField(blank=True, max_length=50, null=True, unique=True),
        ),
        migrations.AddField(
            model_name="event",
            name="organizer",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name="event",
            name="publish_date",
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="event",
            name="visibility",
            field=models.CharField(
                blank=True,
                choices=[("PUBLIC", "Public"), ("PRIVATE", "Private")],
                max_length=50,
            ),
        ),
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
            name="limit_per_person",
            field=models.IntegerField(
                blank=True,
                default=1,
                null=True,
                validators=[
                    django.core.validators.MinValueValidator(1),
                    django.core.validators.MaxValueValidator(100),
                ],
            ),
        ),
        migrations.AlterField(
            model_name="event",
            name="start_date",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="event",
            name="title",
            field=models.CharField(blank=True, max_length=255, unique=True),
        ),
    ]
