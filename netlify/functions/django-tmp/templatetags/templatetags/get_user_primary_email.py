from django import template

register = template.Library()


@register.simple_tag(takes_context=True)
def get_user_primary_email(context):
    request = context["request"]
    primary_email = "Not set"

    if request.user.email:
        primary_email = request.user.email

    return primary_email
