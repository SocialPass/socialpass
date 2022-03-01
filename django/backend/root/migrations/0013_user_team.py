# Generated by Django 3.2.11 on 2022-02-10 12:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0012_rename_softwareplan_team"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="team",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="users",
                to="root.team",
            ),
        ),
    ]
