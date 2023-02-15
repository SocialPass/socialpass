import json
import pytz

from django.core.management.base import BaseCommand, CommandError

from apps.root.models import Event, Ticket


def format_to_event_timezone(dt, event_tz):
	if dt:
		formatted = dt
		try:
			formatted = dt.astimezone(pytz.timezone(event_tz))
		except Exception:
			pass
		return formatted.strftime("%b. %-d, %Y, %-I:%M %p")
	else:
		return None


class Command(BaseCommand):
	"""
	Custom command to get tickets data for an event. We print JSON because CSV 
	is super easy to break (commas can exist in user input). And it's fairly 
	simple to turn JSON into whatever data format we need.
	"""

	help = "get tickets data for an event"

	def add_arguments(self, parser):
		parser.add_argument("event_id", type=int,)

	def handle(self, *args, **options):
		try:
			event = Event.objects.get(pk=options["event_id"])
		except Event.DoesNotExist:
			raise CommandError("Event not found.")
		
		tickets = Ticket.objects.select_related(
			"ticket_tier", "checkout_session", "checkout_session__tx_asset_ownership",
		).filter(event=event)

		results = []
		for ticket in tickets:
			results.append({
				"ticket_id": str(ticket.public_id),
				"ticket_tier": ticket.ticket_tier.ticket_type,
				"created": format_to_event_timezone(ticket.created, ticket.event.timezone),
				"redeemed": ticket.redeemed,
				"redeemed_at": format_to_event_timezone(ticket.redeemed_at, ticket.event.timezone),
				"checkout_session": str(ticket.checkout_session.public_id),
				"customer_name": ticket.checkout_session.name,
				"customer_email": ticket.checkout_session.email,
				"wallet_address": ticket.checkout_session.tx_asset_ownership.wallet_address
			})
		print(f"\n{json.dumps(results)}\n")
