from django import template

from apps.root.models import WhiteLabel

register = template.Library()


@register.simple_tag(takes_context=False)
def get_whitelabel(team=None):
    # by default, there is no whitelabel
    whitelabel = False

    # query the global whitelabel objects first
    global_whitelabel_qs = WhiteLabel.objects.filter(is_global=True)
    if global_whitelabel_qs.count() > 0:
        whitelabel = global_whitelabel_qs[0]

    # check if team (if passed from template) has whitelabel object
    if team:
        if team.whitelabel:
            whitelabel = team.whitelabel

    return whitelabel
