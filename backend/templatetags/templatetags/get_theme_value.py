import json
from urllib import parse

from django import template
from django.templatetags.static import static

register = template.Library()


@register.simple_tag(takes_context=True)
def get_theme_value(context, key):
    """
    Template tag to return a team's theme_value based on provided key
    Available keys are following
            - brand_name
            - logo
            - favicon
            - css_theme
    Note: If a team does not have its own theme, default to SocialPass
    """
    # Set initial theme to none
    theme = None

    # Team is available in context
    # Use that value
    if "current_team" in context:
        theme = context["current_team"].theme

    # Theme is not available in context
    # Try to load from request.cookies
    else:
        request = context.get("request")
        if request is not None:
            theme = request.COOKIES.get("whiteLabelTheme", None)
            if theme is not None:
                theme = json.loads(parse.unquote(theme))

    # Verify theme has been set
    # If not, set to empty dictionary
    if theme is None:
        theme = {}

    # Get value based on provided key
    # Default is socialpass
    value = None
    if key == "brand_name":
        value = theme.get("brand_name", "SocialPass")
    elif key == "logo":
        value = static(theme.get("logo", "images/SocialPass-Icon-White.svg"))
    elif key == "logo_not_dashboard":
        value = static(theme.get("logo", "images/SocialPass-Icon.svg"))
    elif key == "favicon":
        value = static(theme.get("favicon", "images/favicons/socialpass-favicon.ico"))
    elif key == "css_theme":
        value = static(theme.get("css_theme", "socialpass-theme/socialpass-theme.css"))

    return value
