from django.db.models import Sum

from .models import PricingRuleGroup, Team, TicketedEvent, TicketedEventStripePayment


def identify_pricing_group_errors(pricing_group: PricingRuleGroup) -> list:
    """Identifies if pricing group has any gap between ranges or ranges
    overlap.

    Return a list with all the inconsistencies found.
    """
    pricing_rules = pricing_group.active_rules.filter(active=True)
    pricing_rule_ranges = pricing_rules.order_by("min_capacity")
    pricing_rules_length = pricing_rule_ranges.count()

    errors = []
    last_range = None

    for i, rule_range in enumerate(pricing_rule_ranges):
        if i != 0:
            # there is no validation to be done on the first range
            if last_range.max_capacity > rule_range.min_capacity:
                errors.append(f"Overlap between {last_range} and {rule_range}.")

            elif last_range.max_capacity + 1 != rule_range.min_capacity:
                errors.append(f"Gap between {last_range} and {rule_range}.")

        if i == pricing_rules_length - 1:
            # we need to be sure that the ending range is open-ended
            if rule_range.max_capacity is not None:
                errors.append("Ending range is not open-ended.")

        last_range = rule_range

    return errors


def get_pricing_rule_for_capacity(pricing_group: PricingRuleGroup, capacity: int):
    """Returns the pricing rule for a given capacity."""
    pricing_rules = pricing_group.active_rules.filter(active=True)
    pricing_rule_ranges = pricing_rules.order_by("min_capacity")

    for rule_range in pricing_rule_ranges:
        if (
            capacity >= rule_range.min_capacity
            and capacity <= rule_range.safe_max_capacity
        ):
            return rule_range

    raise ValueError("Could not find pricing_rule for capacity")


def get_pricing_group_for_ticket(ticketed_event: TicketedEvent) -> PricingRuleGroup:
    """Returns the pricing group for a given ticket gate."""
    return ticketed_event.team.pricing_rule_group


def calculate_ticketed_event_price_per_ticket_for_team(
    team: Team, *, capacity: int = None
):
    """Returns the estimated price of a ticket gate for a given team.

    The price is calculated by finding the first pricing rule that matches the
    capacity.
    """
    pricing_group = team.pricing_rule_group
    pricing_rule = get_pricing_rule_for_capacity(pricing_group, capacity)
    return pricing_rule.price_per_ticket


def get_pricing_rule_for_ticket(
    ticketed_event: TicketedEvent,
) -> float:
    """Gets the pricing rule that applies to the ticket capacity"""
    pricing_group = get_pricing_group_for_ticket(ticketed_event)
    return get_pricing_rule_for_capacity(pricing_group, ticketed_event.capacity)


def set_ticketed_event_price(ticketed_event: TicketedEvent):
    """Sets the price of a ticket based on its capacity."""
    ticketed_event.pricing_rule = get_pricing_rule_for_ticket(ticketed_event)
    ticketed_event.price = ticketed_event.pricing_rule.price_per_ticket * ticketed_event.capacity
    ticketed_event.save()


def get_ticketed_event_pending_payment_value(ticketed_event: TicketedEvent):
    """Returns the pending payment value of a ticket gate."""
    effective_payments_value = (
        get_effective_payments(ticketed_event.payments).aggregate(Sum("value"))[
            "value__sum"
        ]
        or 0
    )
    return max((ticketed_event.price or 0) - effective_payments_value, 0)


def get_effective_payments(
    payments: TicketedEventStripePayment.objects,
) -> TicketedEventStripePayment.objects:
    """Returns all succeded payments for a ticket gate."""
    return payments.filter(status="SUCCESS")


def get_in_progress_payment(ticketed_event: TicketedEvent) -> TicketedEventStripePayment:
    """Returns the payment of a ticket gate which is either PENDING or PROCESSING."""
    return ticketed_event.payments.filter(status__in=["PENDING", "PROCESSING"]).first()


def issue_payment(
    ticketed_event: TicketedEvent, stripe_checkout_session_id: str
) -> TicketedEventStripePayment:
    """
    Issues a payment for a ticket gate.
    Adds validation to ensure that there is only one payment in progress issued per ticket gate.
    """
    if get_in_progress_payment(ticketed_event):
        raise ValueError("There is already a pending payment for this ticket gate.")

    payment = TicketedEventStripePayment(
        ticketed_event=ticketed_event,
        value=ticketed_event.price,
        stripe_checkout_session_id=stripe_checkout_session_id,
        status="PENDING",
    )
    payment.save()
    return payment


def fulfill_payment(payment: TicketedEventStripePayment):
    """Fulfills a payment for a ticket gate."""
    payment.status = "SUCCESS"
    payment.save()
