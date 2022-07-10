from datetime import date, datetime
from decimal import Decimal

from django.db.models import Sum
from djmoney.money import Money

from apps.dashboard.models import EventStripePayment, PricingRuleGroup, Team
from apps.root.models import Event


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


def calculate_event_price_per_ticket_for_team(team: Team, *, capacity: int = None):
    """Returns the estimated price of a ticket gate for a given team.

    The price is calculated by finding the first pricing rule that matches the
    capacity.
    """
    pricing_group = team.pricing_rule_group
    pricing_rule = get_pricing_rule_for_capacity(pricing_group, capacity)
    return pricing_rule.price_per_ticket


def get_pricing_rule_for_ticket(
    event: Event,
) -> float:
    """Gets the pricing rule that applies to the ticket capacity"""
    pricing_group = event.team.pricing_rule_group
    return get_pricing_rule_for_capacity(pricing_group, event.capacity)


def get_event_pending_payment_value(event: Event):
    """Returns the pending payment value of a ticket gate."""
    effective_payments_value = get_effective_payments(event.payments).aggregate(
        Sum("value")
    )["value__sum"] or Money(0, "USD")

    return max(
        (event.price or Money(0, "USD")) - effective_payments_value, Money(0, "USD")
    )


def get_effective_payments(
    payments: EventStripePayment.objects,
) -> EventStripePayment.objects:
    """Returns all succeded payments for a ticket gate."""
    return payments.filter(status="SUCCESS")


def get_in_progress_payment(
    event: Event,
) -> EventStripePayment:
    """Returns the payment of a ticket gate which is either PENDING or PROCESSING."""
    return event.payments.filter(status__in=["PENDING", "PROCESSING"]).first()


def issue_payment(event: Event, stripe_checkout_session_id: str) -> EventStripePayment:
    """
    Issues a payment for a ticket gate.
    Adds validation to ensure that there is only one payment in progress issued per ticket gate.
    """
    if get_in_progress_payment(event):
        raise ValueError("There is already a pending payment for this ticket gate.")

    payment = EventStripePayment(
        event=event,
        value=event.price,
        stripe_checkout_session_id=stripe_checkout_session_id,
        status="PENDING",
    )
    payment.save()
    return payment
