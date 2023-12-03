from datetime import datetime
from zoneinfo import ZoneInfo
from django import template

register = template.Library()

@register.simple_tag(takes_context=False)
def format_to_event_timezone(dt, event_tz):
    formatted = dt
    try:
        event_zone = ZoneInfo(event_tz)
        formatted = dt.astimezone(event_zone)
    except Exception:
        pass

    return formatted.strftime("%b. %-d, %Y, %-I:%M %p")
