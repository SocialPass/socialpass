# Generated by Django 4.0.8 on 2022-11-08 05:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0026_tierassetownership_issued_token_id"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="tickettier",
            name="quantity_sold",
        ),
    ]
