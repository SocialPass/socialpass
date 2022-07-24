from typing import Optional

from apps.root.models import Event, EventStripePayment, PricingRuleGroup, Team


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
            if last_range.max_capacity > rule_range.min_capacity:  # type: ignore
                errors.append(f"Overlap between {last_range} and {rule_range}.")

            elif last_range.max_capacity + 1 != rule_range.min_capacity:  # type: ignore
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


def calculate_event_price_per_ticket_for_team(team: Team, *, capacity: int):
    """Returns the estimated price of a event for a given team.

    The price is calculated by finding the first pricing rule that matches the
    capacity.
    """
    pricing_group = team.pricing_rule_group
    pricing_rule = get_pricing_rule_for_capacity(pricing_group, capacity)
    return pricing_rule.price_per_ticket


def get_in_progress_payment(event: Event) -> Optional[EventStripePayment]:
    """Returns the payment of a event which is either PENDING or PROCESSING."""
    p: Optional[EventStripePayment]
    p = event.payments.filter(status__in=["PENDING", "PROCESSING"]).first()
    return p


def issue_payment(event: Event, stripe_checkout_session_id: str) -> EventStripePayment:
    """
    Issues a payment for a event.
    Adds validation to ensure that there is only one payment in progress issued per event.
    """
    if get_in_progress_payment(event):
        raise ValueError("There is already a pending payment for this event.")

    payment = EventStripePayment(
        event=event,
        value=event.price,
        stripe_checkout_session_id=stripe_checkout_session_id,
        status="PENDING",
    )
    payment.save()
    return payment
