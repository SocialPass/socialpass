# Generated by Django 4.0.4 on 2022-05-27 17:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0003_ticket_redeemed_at_redemptionaccesskey_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='redeemed_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='root.redemptionaccesskey'),
        ),
    ]
