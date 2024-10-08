# Generated by Django 4.2 on 2023-06-15 13:52

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("root", "0056_team_stripe_account_country_team_stripe_account_id_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="txfiat",
            name="stripe_line_items",
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="txfiat",
            name="stripe_session_id",
            field=models.CharField(
                blank=True,
                default="",
                help_text="Stripe checkout session ID.",
                max_length=255,
            ),
        ),
        migrations.AddField(
            model_name="txfiat",
            name="stripe_session_url",
            field=models.URLField(
                blank=True, default="", help_text="Stripe checkout session URL."
            ),
        ),
    ]
