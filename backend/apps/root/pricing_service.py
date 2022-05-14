from .models import PricingRuleGroup, Team, TicketGate


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


def get_pricing_rule_for_capacity(
    pricing_group: PricingRuleGroup, capacity: int
):
    """Returns the pricing rule for a given capacity."""
    pricing_rules = pricing_group.active_rules.filter(active=True)
    pricing_rule_ranges = pricing_rules.order_by("min_capacity")

    for rule_range in pricing_rule_ranges:
        if (
            capacity >= rule_range.min_capacity
            and capacity <= rule_range.max_capacity
        ):
            return rule_range

    raise ValueError("Could not find pricing_rule for capacity")


def get_pricing_group_for_ticket(ticket_gate: TicketGate) -> PricingRuleGroup:
    """Returns the pricing group for a given ticket gate."""
    return ticket_gate.team.pricing_group


def calculate_ticket_gate_price_per_ticket_for_team(team: Team, *, capacity: int = None):
    """Returns the estimated price of a ticket gate for a given team.

    The price is calculated by finding the first pricing rule that matches the
    capacity.
    """
    pricing_group = team.pricing_group
    pricing_rule = get_pricing_rule_for_capacity(pricing_group, capacity)
    return pricing_rule.price_per_ticket


def calculate_ticket_gate_price_per_ticket(
    ticket_gate: TicketGate,
) -> float:
    """Calculates the price of a ticket gate for a given capacity.

    The price is calculated by finding the first pricing rule that matches the
    capacity.
    """
    pricing_group = get_pricing_group_for_ticket(ticket_gate)
    pricing_rule = get_pricing_rule_for_capacity(
        pricing_group, ticket_gate.capacity)
    return pricing_rule.price_per_ticket


def set_ticket_gate_price(ticket_gate: TicketGate):
    """Sets the price of a ticket gate for a given capacity."""
    ticket_gate.price = calculate_ticket_gate_price_per_ticket(ticket_gate) * ticket_gate.capacity
    ticket_gate.save()


def get_ticket_gate_pending_payment_value(ticket_gate: TicketGate):
    """Returns the pending payment value of a ticket gate."""
    total_payments = ticket_gate.payments.all().sum('value')
    return min(ticket_gate.price - total_payments, 0)
