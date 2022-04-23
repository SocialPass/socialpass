# Generated by Django 4.0.4 on 2022-04-23 20:00

import apps.root.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("contenttypes", "0002_remove_content_type_name"),
        ("root", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="signature",
            name="expires",
            field=models.DateTimeField(default=apps.root.models.Signature.set_expires),
        ),
        migrations.AlterField(
            model_name="tokengate",
            name="polymorphic_ctype",
            field=models.ForeignKey(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="polymorphic_%(app_label)s.%(class)s_set+",
                to="contenttypes.contenttype",
            ),
        ),
    ]
