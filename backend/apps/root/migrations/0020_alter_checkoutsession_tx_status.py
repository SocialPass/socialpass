# Generated by Django 4.0.8 on 2022-10-22 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0019_alter_tierassetownership_token_id"),
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
                    ("FULFILLED", "Fulfilled"),
                    ("COMPLETED", "Completed"),
                ],
                default="VALID",
                max_length=50,
            ),
        ),
    ]
