import json
import rollbar

from django.core.mail import send_mass_mail
from procrastinate import RetryStrategy
from procrastinate.contrib.django import app
from apps.root.models import (
	Event,
	CheckoutItem,
	CheckoutSession,
	MessageBatch,
	RSVPBatch,
	Ticket
)
from apps.root.exceptions import GoogleWalletAPIRequestError
from apps.root.ticketing import GoogleTicket

@app.task(retry=RetryStrategy(max_attempts=5, linear_wait=5))
def task_handle_event_google_class(event_pk):
	"""
	insert/update Google class for event
	- object is NOT saved afterwards (done manually)
	- return class ID for success case, False otherwise
	- we use Boolean to handle fail case (not exceptions), because this
	  functionality should be non-blocking during fail case
	"""
	event_obj = Event.objects.get(pk=event_pk)
	is_insert = True
	if event_obj.google_class_id != "":
		is_insert = False
	response = GoogleTicket.GoogleTicket.insert_update_event_class(
		event_obj=event_obj, is_insert=is_insert
	)
	if 200 <= response.status_code <= 299:
		event_obj.google_class_id = json.loads(response.text)["id"]
		event_obj.save()
	else:
		rollbar.report_message("set_google_event_class ERROR: " + response.text)
		raise GoogleWalletAPIRequestError(response.text)

@app.task
def task_handle_rsvp_delivery(rsvp_batch_pk, emails, guests_allowed):
	rsvp_batch_obj = RSVPBatch.objects.get(pk=rsvp_batch_pk)

	# Create checkout session and items
	# Also track success and failure
	success_list = []
	failure_list = []

	for email in emails:
		try:
			checkout_session = CheckoutSession.objects.create(
				event=rsvp_batch_obj.event,
				rsvp_batch=rsvp_batch_obj,
				email=email.strip(),
				session_type=rsvp_batch_obj.ticket_tier.category,
			)
			CheckoutItem.objects.create(
				ticket_tier=rsvp_batch_obj.ticket_tier,
				checkout_session=checkout_session,
				quantity=1,
				selected_guests=guests_allowed,
			)
			success_list.append(email)
		except Exception as e:
			raise e
			failure_list.append(email)
	rsvp_batch_obj.success_list = ", ".join(map(str, success_list))
	rsvp_batch_obj.failure_list = ", ".join(map(str, failure_list))
	rsvp_batch_obj.save()

	# Fulfill checkout sessions once everything has been set up
	# Querying again, we ensure we get the correct public IDs for the emails
	checkout_sessions = CheckoutSession.objects.filter(rsvp_batch=rsvp_batch_obj)
	for checkout_session in checkout_sessions:
		checkout_session.fulfill_session()

@app.task
def task_handle_message_batch_delivery(message_batch_pk):
	message_batch_obj = MessageBatch.objects.get(pk=message_batch_pk)

	emails = []
	tickets = Ticket.objects.select_related("checkout_session").filter(
		event=message_batch_obj.event, ticket_tier=message_batch_obj.ticket_tier
	)
	for ticket in tickets:
		emails.append(ticket.checkout_session.email)
	emails = list(set(emails))
	message_batch_obj.total_recipients = len(emails)
	message_batch_obj.save()

	# Send mass emails
	# This function opens a connection to the mail server only once
	messages = [
		(
			"[SocialPass] " + message_batch_obj.subject,
			message_batch_obj.message,
			"tickets-no-reply@socialpass.io",
			[email],
		)
		for email in emails
	]
	send_mass_mail(messages)
