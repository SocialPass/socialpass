# Generated by Django 5.0.2 on 2024-03-12 23:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0110_alter_tickettier_hidden_availability"),
    ]

    operations = [
        migrations.RenameField(
            model_name="tickettier",
            old_name="hidden",
            new_name="hidden_from_public",
        ),
    ]
