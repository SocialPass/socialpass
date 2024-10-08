# Generated by Django 4.0.8 on 2022-10-31 12:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0022_alter_checkoutsession_tx_status"),
    ]

    operations = [
        migrations.AlterField(
            model_name="event",
            name="address_1",
            field=models.CharField(default="", max_length=255),
        ),
        migrations.AlterField(
            model_name="event",
            name="city",
            field=models.CharField(default="", max_length=255),
        ),
        migrations.AlterField(
            model_name="event",
            name="country",
            field=models.CharField(default="", max_length=2),
        ),
        migrations.AlterField(
            model_name="event",
            name="cover_image",
            field=models.ImageField(
                help_text="A banner image for your event. Please make sure the image is a high quality landscape image, ideally 960 x 720 pixels (4:3).",
                upload_to="event__cover_image",
            ),
        ),
        migrations.AlterField(
            model_name="event",
            name="lat",
            field=models.DecimalField(
                blank=True, decimal_places=6, max_digits=9, null=True
            ),
        ),
        migrations.AlterField(
            model_name="event",
            name="long",
            field=models.DecimalField(
                blank=True, decimal_places=6, max_digits=9, null=True
            ),
        ),
    ]
