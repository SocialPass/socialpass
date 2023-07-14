from django import template

register = template.Library()


@register.simple_tag(takes_context=True)
def get_color_mode(context):
    result = None
    request = context.get("request")
    if request:
        result = request.COOKIES.get("colorMode", "")

    if result:
    	return result
    else:
    	return "light"
