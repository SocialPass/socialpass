from django import template

register = template.Library()


@register.simple_tag(takes_context=True)
def get_sidebar_active_status(context, key):
    url_name = context["request"].resolver_match.url_name

    if key == "events":
        if url_name in [
            "ticketgate_list",
            "ticketgate_create",
            "ticketgate_detail",
            "ticketgate_update",
            "ticketgate_stats",
            "ticketgate_price_estimator",
            "ticketgate_checkout",
            "ticketgate_checkout_success_callback",
            "ticketgate_checkout_failure_callback",
        ]:
            return "active"
    elif key == "team-details":
        if url_name in ["team_detail", "team_update"]:
            return "active"
    elif key == "manage-members":
        if url_name in ["team_members", "team_member_delete"]:
            return "active"
    elif key == "change-password":
        if url_name == "account_change_password":
            return "active"
    elif key == "manage-emails":
        if url_name == "account_email":
            return "active"

    return ""
