from django import template

from ..model_field_choices import BLOCKCHAINS

register = template.Library()

@register.simple_tag(takes_context=False)
def get_chain_name(chain_number):
	for item in BLOCKCHAINS:
		if chain_number == item[0]:
			return item[1]
    