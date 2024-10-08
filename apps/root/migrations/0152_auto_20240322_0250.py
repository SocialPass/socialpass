# Generated by Django 5.0.2 on 2024-03-22 02:50

from django.db import migrations

def localized_address_display(event):
    """
    localized_address_display will be
    "address_1, address_2, city, country, postal_code" joined
    """
    from apps.root.countries import COUNTRIES
    if event.geo_address:
        return event.geo_address

    if not event.city and not event.address_1:
        return ""

    # add postal code to city if exists
    if event.postal_code:
        city = event.city + "-" + event.postal_code
    else:
        city = event.city

    address_fields = [
        event.address_1,
        city,
        COUNTRIES[event.country],
    ]

    # add address_2 to second list position if exists
    if event.address_2:
        address_fields.insert(1, event.address_2)

    # join fields
    localized_address_display = ", ".join(address_fields)
    return localized_address_display

def migrate_localized_address(apps, schema_editor):
    Event = apps.get_model('root', 'Event')

    # Get all events
    events = Event.objects.all()
    for event in events:
        # migrate geo_address based on localized_address
        localized_address = localized_address_display(event)
        event.geo_address = localized_address
        event.save()

class Migration(migrations.Migration):

    dependencies = [
        ("root", "0151_alter_event_fiat_currency"),
    ]

    operations = [
        migrations.RunPython(
            migrate_localized_address,
            reverse_code=migrations.RunPython.noop
        )
    ]
