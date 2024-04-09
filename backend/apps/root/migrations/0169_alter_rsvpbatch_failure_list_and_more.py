# Generated by Django 5.0.3 on 2024-04-09 16:19

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0168_migrate_rsvp_batch_array_field'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rsvpbatch',
            name='failure_list',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.EmailField(max_length=254), blank=True, default=list, size=None),
        ),
        migrations.AlterField(
            model_name='rsvpbatch',
            name='success_list',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.EmailField(max_length=254), blank=True, default=list, size=None),
        ),
    ]
