# Generated by Django 4.2.3 on 2023-08-02 17:04

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0070_event_sales_end_date_event_sales_start_date_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="event",
            old_name="sales_end_date",
            new_name="sales_end",
        ),
        migrations.RenameField(
            model_name="event",
            old_name="sales_start_date",
            new_name="sales_start",
        ),
    ]