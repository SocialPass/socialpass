from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.root.models import Event, WhiteLabel
from apps.root.tasks import task_handle_event_google_class

"""
@receiver(post_save, sender=WhiteLabel)
def refresh_google_event_class_on_whitelabel_save(sender, instance, **kwargs):
    # If global, refresh site-wide Google event classes
    if instance.is_global:
        for event in Event.objects.all():
            task_handle_event_google_class.defer(event_pk=event.pk)

    # If not global and has team, refresh team-wide Google event classes
    if not instance.is_global:
        for event in Event.objects.filter(team=instance.team):
            task_handle_event_google_class.defer(event_pk=event.pk)
"""