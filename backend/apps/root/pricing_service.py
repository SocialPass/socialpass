from .models import PricingRuleGroup


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