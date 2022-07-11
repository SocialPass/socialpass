from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.root.models import Event, TicketRedemptionKey


@receiver(post_save, sender=Event, dispatch_uid="create_ticket_redemption_key")
def create_ticket_redemption_key(sender, instance, created, **kwargs):
    """
    Creates TicketRedemptionKey from Event on post_save
    """
    if created:
        TicketRedemptionKey.objects.get_or_create(event=instance)
