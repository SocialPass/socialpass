# Generated by Django 5.0.1 on 2024-02-27 06:36

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0107_tickettier_is_archived_alter_event_fiat_currency_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="tickettier",
            options={"ordering": ("is_archived", "-modified")},
        ),
    ]
