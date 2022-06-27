from django import template

register = template.Library()


@register.simple_tag(takes_context=False)
def format_address(address):
    formatted = address
    try:
        formatted = address[:2] + "..." + address[-5:]
    except Exception:
        pass

    return formatted
