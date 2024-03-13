# Generated by Django 5.0.2 on 2024-03-13 16:04

from django.db import migrations
from apps.root.models import TicketTier

def set_category_based_on_o2o(apps, schema_editor):
    # Get all ticket tiers
    ticket_tiers = TicketTier.objects.all().select_related(
        "tier_free",
        "tier_fiat",
        "tier_asset_ownership"
    )

    # loop over ticket tiers, set category
    # skip if already existing category
    for tier in ticket_tiers:
        if tier.category:
            continue

        # set tier category
        if tier.tier_free:
            tier.category = TicketTier.Category.FREE
        elif tier.tier_fiat:
            tier.category = TicketTier.Category.FIAT
        elif tier.tier_asset_ownership:
            tier.category = TicketTier.Category.ASSET_OWNERSHIP

        # save tier
        tier.save()

def reverse_set_category_based_on_o2o(apps, schema_editor):
    TicketTier = apps.get_model('root', 'TicketTier')

    # Set fields back to their default values
    TicketTier.objects.all().update(
        category=TicketTier._meta.get_field('category').get_default(),
    )

class Migration(migrations.Migration):

    dependencies = [
        ("root", "0121_alter_tickettier_token_address"),
    ]

    operations = [
        migrations.RunPython(
            set_category_based_on_o2o,
            reverse_code=reverse_set_category_based_on_o2o
        )
    ]