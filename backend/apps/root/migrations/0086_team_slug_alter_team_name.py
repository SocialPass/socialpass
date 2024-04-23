# Generated by Django 4.2.6 on 2023-11-06 06:46

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0085_rsvpbatch_failure_list_rsvpbatch_success_list"),
    ]

    operations = [
        migrations.AddField(
            model_name="team",
            name="slug",
            field=models.SlugField()
        ),
        migrations.AlterField(
            model_name="team",
            name="name",
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
