# Generated by Django 4.0.8 on 2022-10-28 17:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0021_alter_team_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="checkoutsession",
            name="tx_status",
            field=models.CharField(
                choices=[
                    ("VALID", "Valid"),
                    ("PROCESSING", "Processing"),
                    ("FAILED", "Failed"),
                    ("COMPLETED", "Completed"),
                    ("FULFILLED", "Fulfilled"),
                ],
                default="VALID",
                max_length=50,
            ),
        ),
    ]