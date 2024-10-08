# Generated by Django 5.0.2 on 2024-03-18 19:20

from django.db import migrations

def set_tx_type_based_on_o2o(apps, schema_editor):
    CheckoutSession = apps.get_model('root', 'CheckoutSession')

    # Get all ticket sessions
    sessions = CheckoutSession.objects.all()

    # loop over ticket sessions, set tx_type
    # skip if already existing tx_type
    # Note: import CheckoutSession from actual apps.root as to access .TransactionType
    from apps.root.models import CheckoutSession
    for session in sessions:
        if session.tx_type:
            continue

        # set session tx_type
        if session.tx_free:
            session.tx_type = CheckoutSession.TransactionType.FREE
        elif session.tx_fiat:
            session.tx_type = CheckoutSession.TransactionType.FIAT
        elif session.tx_asset_ownership:
            session.tx_type = CheckoutSession.TransactionType.ASSET_OWNERSHIP

        # save session
        session.save()


class Migration(migrations.Migration):

    dependencies = [
        ("root", "0132_migrate_tx_asset_ownership"),
    ]

    operations = [
        migrations.RunPython(
            set_tx_type_based_on_o2o,
            reverse_code=migrations.RunPython.noop
        )
    ]
