# Generated by Django 3.2.11 on 2022-03-08 20:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0032_auto_20220308_2006'),
    ]

    operations = [
        migrations.AddField(
            model_name='airdrop',
            name='token_id',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='ticket',
            name='token_id',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
