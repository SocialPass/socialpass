from django import template
from django.conf import settings

register = template.Library()


@register.simple_tag(takes_context=True)
def get_debug_status(context):
	return settings.DEBUG
