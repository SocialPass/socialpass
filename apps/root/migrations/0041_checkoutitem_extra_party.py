# Generated by Django 4.0.8 on 2023-03-29 15:58

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0040_alter_ticket_party_size'),
    ]

    operations = [
        migrations.AddField(
            model_name='checkoutitem',
            name='extra_party',
            field=models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)]),
        ),
    ]
