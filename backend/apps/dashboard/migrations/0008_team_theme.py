# Generated by Django 4.0.5 on 2022-07-12 01:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("dashboard", "0007_alter_eventstripepayment_event"),
    ]

    operations = [
        migrations.AddField(
            model_name="team",
            name="theme",
            field=models.JSONField(null=True),
        ),
    ]
