# Generated by Django 4.2.3 on 2023-08-30 13:59

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields
import uuid


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0076_remove_txassetownership_issued_token_id_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="WhiteLabel",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                (
                    "public_id",
                    models.UUIDField(
                        db_index=True, default=uuid.uuid4, editable=False, unique=True
                    ),
                ),
                ("brand_name", models.CharField(blank=True, max_length=255)),
                (
                    "logo",
                    models.ImageField(
                        blank=True, null=True, upload_to="whitelabel__logo"
                    ),
                ),
                (
                    "ticket_logo",
                    models.FileField(
                        blank=True, null=True, upload_to="whitelabel__logo"
                    ),
                ),
                ("ticket_logo_google", models.URLField(blank=True, max_length=255)),
                (
                    "ticket_logo_apple",
                    models.ImageField(
                        blank=True, null=True, upload_to="whitelabel__logo"
                    ),
                ),
                (
                    "favicon",
                    models.ImageField(
                        blank=True, null=True, upload_to="whitelabel__favicon"
                    ),
                ),
                ("css", models.TextField(blank=True, default="")),
                (
                    "font_regular",
                    models.FileField(
                        blank=True, null=True, upload_to="whitelabel__font"
                    ),
                ),
                (
                    "font_bold",
                    models.FileField(
                        blank=True, null=True, upload_to="whitelabel__font"
                    ),
                ),
                ("ticket_bg_color", models.CharField(blank=True, max_length=255)),
                ("ticket_text_color", models.CharField(blank=True, max_length=255)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.AddField(
            model_name="team",
            name="whitelabel",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="root.whitelabel",
            ),
        ),
    ]