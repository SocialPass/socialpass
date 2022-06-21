from django import template

from apps.root.models import Membership, Team

register = template.Library()


@register.simple_tag(takes_context=True)
def get_other_teams(context, excluded_public_id):
	request = context["request"]
	other_teams = []

	for membership in Membership.objects.select_related("team").filter(
		user__id=request.user.id
	):
		team = membership.team
		if team.public_id != excluded_public_id:
			other_teams.append({
				"public_id": team.public_id,
				"name": team.name
			})

	return other_teams
