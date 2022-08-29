from django import template

from apps.root.models import Event

register = template.Library()


@register.simple_tag(takes_context=False)
def get_chain_name(chain_number):
    for item in Event.BlockchainEnum.choices:
        if chain_number == item[0]:
            return item[1]
