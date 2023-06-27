# Generated by Django 4.2 on 2023-06-27 08:15

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0065_alter_tierassetownership_balance_required_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tierassetownership",
            name="balance_required",
            field=models.IntegerField(
                default=1,
                help_text="The number of NFTs required to claim your ticket tier.",
            ),
        ),
    ]
