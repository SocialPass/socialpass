# MAJOR REFACTOR
## Models.py
- Overhaul `CheckoutSession` and related code.
	- Cleanup `CheckoutSession` statuses
		```
		class OrderStatus(models.TextChoices):
		INITIAL = "INITIAL", "Initial"  # Session is valid. (Initial state)
		INVALID = "INVALID", "Failed"  # Session is failed. Can retry.
		FULFILLED = "FULFILLED", "Fulfilled"  # Session has been fulfilled.
		WAITLIST = "WAITLIST", "Waitlisted"  # Session has been waitlisted.
		```
	- Get rid of transaction models and relations.
		- Delete the `tx_*` OneToOneField's from the `CheckoutSession` model.
		- Delete `TxAssetOwnership`, `TxFree`, `TxBlockchain`, `TxFiat` models entirely.
	- Delete unneeded transaction methods, now that transaction models are removed.
		- Delete `process_transaction`
		- Delete `finalize_transaction`
		- Delete `create_transaction`
	- Delete and decouple processing code.
		- Move `process` methods into the `CheckoutSession`. This means `TxFree.process()` would become `CheckoutSession.processFree()`, and so on.
		- Move `CheckoutFiat.post()` view method logic into `processStripe()` method.
		- Remove call to `.fulfill` from the `CheckoutSession.process` methods. This separates processing from fulfillment.
	- Delete `CheckoutSession.TransactionType` and `tx_type`
	- Delete `is_waiting_list` and `skip_validation`. Use new `WAITLIST` status to handle this.


- Overhaul `TicketTier` code.
	- Delete the `tier_*` OneToOneField's from the `TicketTier` model.
	- Delete `tx_type` from `TicketTier model`
	- Delete `TierFree`, `TierBlockchain`, `TierFiat` models entirely.
		- Move `TierFiat.price_per_ticket` into new field `TicketTier.price_per_ticket`. This should be expressed as a currency field and not a decimal field.
		-
	- Refactor `TierAssetOwnership`
		- Rename into `TokenGate` model.
		- Rename `tier_asset_ownership` -> `tokengate`





# Minor Refactors

## Exceptions.py
- Change all errors to `Exception` over `ValidationError`

## Models.py
### `Event`
- remove `state` and related FSM logic. This clutters the event code unnecssarily, with the only benefit being side-effect handling.
- Remove `is_featured_top`. Unused.
- Remove `@has_ended`. Unusued.
- Rework `Event.fiat_currency`. Use hard-coded currency_choices in application over DJMoney, similar to how we do with COUNTRIES. Relatedly, uninstall djmoney.

### `Ticket`
- Rework `party_size` and `extra_party`. Confusing as it stands.

### `TicketTier`
- Rename `ticket_type` -> `name`
- Rename `hidden` -> `hidden_display`

### CheckoutSession
- Remove `passcode_expiration`, `refresh_passcode`. Passcode does not expire.
-

### `ManualAttendee`
- Delete altogether. VIP list has been unused almost entirely. This makes ticket statistics more confusing as well.













# Thoughts to consider
- Checkout States to Manage
	Note: For paid, must support various payment methods, and not just stripe.

	- Free
	- Paid
	- Free TokenGated
	- Paid TokenGated


	- Free Waitlist
	- Paid WaitList
	- Free TokenGated Waitlist
	- Paid TokenGated Waitlist

	Checkout Page One:
	To solve for tokengated attachment, we should make "tokengated" tickets a sub-field of either PAID or FREE. Meaning that, when either FREE or PAID is selected, there is another button/toggle to show tokengated or not. This isolates the the flow to a specific criteria of tickets.

	- Free Tickets
		- Free
		- TokenGated
	- Paid Tickets
		- Paid
		- TokenGated


	Checkout Page Two:


-