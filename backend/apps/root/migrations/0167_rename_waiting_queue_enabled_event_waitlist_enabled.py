# Generated by Django 5.0.3 on 2024-04-03 15:16

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0166_merge_20240403_0155"),
    ]

    operations = [
        migrations.RenameField(
            model_name="event",
            old_name="waiting_queue_enabled",
            new_name="waitlist_enabled",
        ),
    ]