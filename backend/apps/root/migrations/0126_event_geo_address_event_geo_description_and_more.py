# Generated by Django 5.0.2 on 2024-03-19 02:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0125_remove_tickettier_tier_fiat_delete_tierfiat"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="geo_address",
            field=models.TextField(default=""),
        ),
        migrations.AddField(
            model_name="event",
            name="geo_description",
            field=models.TextField(default=""),
        ),
        migrations.AddField(
            model_name="event",
            name="geo_latitude",
            field=models.DecimalField(decimal_places=6, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name="event",
            name="geo_longitude",
            field=models.DecimalField(decimal_places=6, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name="event",
            name="geo_place_id",
            field=models.CharField(default=""),
        ),
        migrations.AddField(
            model_name="event",
            name="geo_type",
            field=models.CharField(
                choices=[("GOOGLE", "Google"), ("MANUAL", "Manual")],
                default="MANUAL",
                max_length=50,
            ),
        ),
    ]
