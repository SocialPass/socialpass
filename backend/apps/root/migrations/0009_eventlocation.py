# Generated by Django 4.0.5 on 2022-06-24 13:08

import uuid

import django.contrib.gis.db.models.fields
import django.utils.timezone
import model_utils.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0008_auto_20220624_0109"),
    ]

    operations = [
        migrations.CreateModel(
            name="EventLocation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                (
                    "public_id",
                    models.UUIDField(
                        db_index=True, default=uuid.uuid4, editable=False, unique=True
                    ),
                ),
                ("address_1", models.CharField(max_length=255)),
                ("address_2", models.CharField(max_length=255)),
                ("city", models.CharField(max_length=255)),
                ("region", models.CharField(max_length=3)),
                ("postal_code", models.IntegerField()),
                ("country", models.CharField(max_length=2)),
                (
                    "point",
                    django.contrib.gis.db.models.fields.PointField(
                        default="POINT(0.0 0.0)", geography=True, srid=4326
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
