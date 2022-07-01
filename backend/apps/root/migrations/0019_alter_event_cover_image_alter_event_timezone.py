# Generated by Django 4.0.5 on 2022-06-30 12:13

import django.core.files.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0018_event_publish_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="event",
            name="cover_image",
            field=models.ImageField(
                blank=True,
                null=True,
                storage=django.core.files.storage.FileSystemStorage,
                upload_to="",
            ),
        ),
        migrations.AlterField(
            model_name="event",
            name="timezone",
            field=models.CharField(
                blank=True,
                default="America/New_York",
                max_length=30,
                verbose_name="time zone",
            ),
            preserve_default=False,
        ),
    ]
