from django import template
from django.conf import settings

register = template.Library()


@register.simple_tag(takes_context=True)
def get_debug_status(context):
	request = context["request"]
	host = request.get_host()

	for ip in settings.INTERNAL_IPS:
		if host.startswith(ip):
			return True
			
	return False
