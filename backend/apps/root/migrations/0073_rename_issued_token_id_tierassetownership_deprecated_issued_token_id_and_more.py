# Generated by Django 4.2.3 on 2023-08-29 17:17

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0072_tickettier_hidden"),
    ]

    operations = [
        migrations.RenameField(
            model_name="tierassetownership",
            old_name="issued_token_id",
            new_name="deprecated_issued_token_id",
        ),
        migrations.RenameField(
            model_name="txassetownership",
            old_name="token_id",
            new_name="issued_token_id",
        ),
    ]
