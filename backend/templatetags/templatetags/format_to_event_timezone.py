import datetime
import pytz

from django import template

register = template.Library()


@register.simple_tag(takes_context=False)
def format_to_event_timezone(dt, event_tz):
    formatted = dt
    try:
        formatted = dt.astimezone(pytz.timezone(event_tz))
    except Exception:
        pass

    return formatted.strftime("%b. %-d, %Y, %-I:%M %p")
