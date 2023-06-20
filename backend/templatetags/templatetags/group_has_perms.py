from django import template

register = template.Library()

@register.filter
def group_has_perms(membership, permission):
	if membership and membership.group:
		return membership.group.permissions.filter(codename=permission).exists()
	return False