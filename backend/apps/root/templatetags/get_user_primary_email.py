from django import template

register = template.Library()


@register.simple_tag(takes_context=True)
def get_user_primary_email(context):
    request = context["request"]
    primary_email = "Not set"

    for email in request.user.emailaddress_set.all():
        if email.primary:
            primary_email = email
            continue

    return primary_email
