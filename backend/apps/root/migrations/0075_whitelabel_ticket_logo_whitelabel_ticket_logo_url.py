# Generated by Django 4.2 on 2023-08-29 07:16

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0074_whitelabel_font_bold_whitelabel_font_regular"),
    ]

    operations = [
        migrations.AddField(
            model_name="whitelabel",
            name="ticket_logo",
            field=models.ImageField(
                blank=True, null=True, upload_to="whitelabel__logo"
            ),
        ),
        migrations.AddField(
            model_name="whitelabel",
            name="ticket_logo_url",
            field=models.URLField(blank=True, max_length=255),
        ),
    ]
