# Generated by Django 4.0.4 on 2022-06-19 22:23
## Note: This is for backwards-compatibility pre `refactor/schema`
## If column already exists, THIS migration is safe to fake.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "dashboard",
            "0002_pricingrulegroup_team_pricingrule_eventstripepayment_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="PricingRuleGroup",
            name="description",
            field=models.TextField(blank=True, null=True),
            preserve_default=False,
        ),
    ]
