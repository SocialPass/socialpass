# Generated by Django 3.2.11 on 2022-02-20 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0022_auto_20220220_2005"),
    ]

    operations = [
        migrations.AddField(
            model_name="tokengate",
            name="public_id",
            field=models.CharField(
                blank=True, db_index=True, max_length=64, unique=True
            ),
        ),
    ]
