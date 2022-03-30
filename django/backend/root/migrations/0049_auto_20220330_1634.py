# Generated by Django 3.2.11 on 2022-03-30 16:34

from django.db import migrations, models
import root.validators


class Migration(migrations.Migration):

    dependencies = [
        ('root', '0048_alter_ticket_temporary_download_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='airdropgate',
            name='tokengate_ptr',
        ),
        migrations.AlterField(
            model_name='team',
            name='software_types',
            field=models.JSONField(default=list, validators=[root.validators.JSONSchemaValidator(limit_value={'items': {'enum': ['TICKET'], 'type': 'string'}, 'minItems': 1, 'type': 'array'})]),
        ),
        migrations.AlterField(
            model_name='tokengate',
            name='general_type',
            field=models.CharField(choices=[('TICKET', 'TICKET')], max_length=50),
        ),
        migrations.DeleteModel(
            name='Airdrop',
        ),
        migrations.DeleteModel(
            name='AirdropGate',
        ),
    ]
