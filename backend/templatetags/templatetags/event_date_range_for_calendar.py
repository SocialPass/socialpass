from datetime import timedelta
from django import template
from zoneinfo import ZoneInfo

register = template.Library()


@register.simple_tag(takes_context=False)
def event_date_range_for_calendar(event):
	result = False

	try:
		if event.start_date and event.timezone:
			result = ""
			tz_offset = event.start_date.astimezone(ZoneInfo(event.timezone)).strftime("%z")
			result += event.start_date.strftime("%Y/%m/%d %H:%M:%S") + tz_offset + "|"

			# Handle end date
			if event.end_date:
				result += event.end_date.strftime("%Y/%m/%d %H:%M:%S") + tz_offset
			else:
				end_date = event.start_date + timedelta(hours=1)
				result += end_date.strftime("%Y/%m/%d %H:%M:%S") + tz_offset
	except Exception:
		result = False

	return result
