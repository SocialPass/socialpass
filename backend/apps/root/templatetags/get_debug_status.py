from django import template
from django.conf import settings

register = template.Library()


@register.simple_tag(takes_context=False)
def get_debug_status():
	return settings.DEBUG
