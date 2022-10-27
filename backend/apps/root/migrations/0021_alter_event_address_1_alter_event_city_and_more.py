# Generated by Django 4.0.8 on 2022-10-27 08:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0020_alter_event_cover_image_alter_team_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='address_1',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='event',
            name='city',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='event',
            name='country',
            field=models.CharField(default='', max_length=2),
        ),
        migrations.AlterField(
            model_name='event',
            name='postal_code',
            field=models.CharField(default='', max_length=12),
        ),
    ]
