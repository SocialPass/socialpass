# Generated by Django 4.0.6 on 2022-07-26 08:07

import django.core.validators
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0041_alter_event_end_date_alter_event_start_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='capacity',
            field=models.IntegerField(blank=True, default=1, help_text='Maximum amount of attendees for your event.', validators=[django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AlterField(
            model_name='event',
            name='cover_image',
            field=models.ImageField(blank=True, help_text='A banner image for your event.', null=True, upload_to=''),
        ),
        migrations.AlterField(
            model_name='event',
            name='limit_per_person',
            field=models.IntegerField(default=1, help_text='Maximum amount of tickets per attendee.', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(100)]),
        ),
        migrations.AlterField(
            model_name='event',
            name='publication_date',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now, help_text='When your event will be made public.', null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='show_team_image',
            field=models.BooleanField(default=True, help_text='Whether or not your event displays the team image.'),
        ),
        migrations.AlterField(
            model_name='event',
            name='show_ticket_count',
            field=models.BooleanField(default=True, help_text='Whether or not your event displays ticket statistics.'),
        ),
        migrations.AlterField(
            model_name='event',
            name='visibility',
            field=models.CharField(choices=[('PUBLIC', 'Public'), ('PRIVATE', 'Private')], default='PUBLIC', help_text='Whether or not your event is searchable by the public.', max_length=50),
        ),
    ]
