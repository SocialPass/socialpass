# Generated by Django 4.2.6 on 2023-11-06 13:32

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0087_alter_event_slug_alter_event_title_and_more"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="event",
            unique_together={("team", "title"), ("team", "slug")},
        ),
    ]