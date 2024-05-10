from django import template

from apps.root.models import WhiteLabel

register = template.Library()


@register.simple_tag(takes_context=False)
def get_brand_name():
    # by default, brand name is "SocialPass"
    brand_name = "SocialPass"

    # query the global whitelabel objects
    global_whitelabel_qs = WhiteLabel.objects.filter(is_global=True)
    if global_whitelabel_qs.count() > 0:
        brand_name = global_whitelabel_qs[0].brand_name

    return brand_name
