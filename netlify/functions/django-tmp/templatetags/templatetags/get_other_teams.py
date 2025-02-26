from django import template

from apps.root.models import Membership

register = template.Library()


@register.simple_tag(takes_context=True)
def get_other_teams(context, excluded_slug):
    request = context["request"]
    other_teams = []

    for membership in Membership.objects.select_related("team").filter(
        user__id=request.user.id
    ):
        team = membership.team
        if team.slug != excluded_slug:
            other_teams.append({"slug": team.slug, "name": team.name})

    return other_teams
