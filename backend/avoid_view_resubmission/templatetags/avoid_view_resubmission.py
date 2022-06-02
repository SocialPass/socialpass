from django import template

register = template.Library()


@register.inclusion_tag('avoid_view_resubmission/uuid.html', takes_context=True)
def afr_uuid(context):
    return {
        'afr_uuid_': context['afr_uuid_']
    }
