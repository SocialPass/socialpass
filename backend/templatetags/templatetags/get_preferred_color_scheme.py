from django import template

register = template.Library()


@register.simple_tag(takes_context=True)
def get_preferred_color_scheme(context):
    result = None
    request = context.get("request")
    if request:
        result = request.COOKIES.get("halfmoon_preferredColorScheme", "")

    if result == "dark-mode":
        return result
    else:
        return ""
