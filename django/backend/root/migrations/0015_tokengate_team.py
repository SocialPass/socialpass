# Generated by Django 3.2.11 on 2022-02-10 17:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0014_alter_user_managers'),
    ]

    operations = [
        migrations.AddField(
            model_name='tokengate',
            name='team',
            field=models.ForeignKey(blank=True, default=1, on_delete=django.db.models.deletion.CASCADE, related_name='tokengates', to='root.team'),
            preserve_default=False,
        ),
    ]
