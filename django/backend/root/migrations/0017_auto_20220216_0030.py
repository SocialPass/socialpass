# Generated by Django 3.2.11 on 2022-02-16 00:30

from django.db import migrations
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0016_auto_20220216_0028'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='airdroplist',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='airdroplist',
            name='updated_at',
        ),
        migrations.RemoveField(
            model_name='signature',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='signature',
            name='updated_at',
        ),
        migrations.RemoveField(
            model_name='team',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='team',
            name='updated_at',
        ),
        migrations.RemoveField(
            model_name='ticketlist',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='ticketlist',
            name='updated_at',
        ),
        migrations.RemoveField(
            model_name='tokengate',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='tokengate',
            name='updated_at',
        ),
        migrations.AddField(
            model_name='airdroplist',
            name='created',
            field=model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created'),
        ),
        migrations.AddField(
            model_name='airdroplist',
            name='modified',
            field=model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified'),
        ),
        migrations.AddField(
            model_name='signature',
            name='created',
            field=model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created'),
        ),
        migrations.AddField(
            model_name='signature',
            name='modified',
            field=model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified'),
        ),
        migrations.AddField(
            model_name='team',
            name='created',
            field=model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created'),
        ),
        migrations.AddField(
            model_name='team',
            name='modified',
            field=model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified'),
        ),
        migrations.AddField(
            model_name='ticketlist',
            name='created',
            field=model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created'),
        ),
        migrations.AddField(
            model_name='ticketlist',
            name='modified',
            field=model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified'),
        ),
        migrations.AddField(
            model_name='tokengate',
            name='created',
            field=model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created'),
        ),
        migrations.AddField(
            model_name='tokengate',
            name='modified',
            field=model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified'),
        ),
    ]
