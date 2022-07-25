from django import template
from django.templatetags.static import static

register = template.Library()


@register.simple_tag(takes_context=True)
def get_theme_value(context, key):
	theme = context["current_team"].theme
	value = None

	if key == "brand_name":
		value = theme.get("brand_name", "SocialPass")
	elif key == "logo":
		value = static(
			theme.get("logo", "images/SocialPass-Icon-White.svg")
		)
	elif key == "favicon":
		value = static(
			theme.get("favicon", "images/favicons/socialpass-favicon.ico")
		)
	elif key == "css_theme":
		value = static(
			theme.get("css_theme", "socialpass-theme/socialpass-theme.css")
		)

	return value
