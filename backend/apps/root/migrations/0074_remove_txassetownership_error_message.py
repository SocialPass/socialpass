# Generated by Django 4.2.3 on 2023-08-29 17:29

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        (
            "root",
            "0073_rename_issued_token_id_tierassetownership_deprecated_issued_token_id_and_more",
        ),
    ]

    operations = [
        migrations.RemoveField(
            model_name="txassetownership",
            name="error_message",
        ),
    ]