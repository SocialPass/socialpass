from django import template
from zoneinfo import ZoneInfo

register = template.Library()


@register.simple_tag(takes_context=False)
def format_to_event_timezone(dt, event_tz):
    formatted = dt
    try:
        formatted = dt.astimezone(ZoneInfo(event_tz))
    except Exception:
        pass

    return formatted.strftime("%b. %-d, %Y, %-I:%M %p")
