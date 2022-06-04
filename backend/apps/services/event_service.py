import sentry_sdk

from apps.root.models import Event


class TooManyTicketsRequestedError(Exception):
    pass


class TooManyTicketsIssuedError(Exception):
    pass


class TicketsSoldOutError(Exception):
    pass


def get_available_tickets(event: Event, tickets_requested: int) -> int:
    """
    return how many tickets available for a given event
    In the future, this method can be extended to ticket types vs singular ticket with an event
    """
    # get ticket count
    ticket_count = event.tickets.count()

    # if no tickets_requested, set to limit_per_person
    if not tickets_requested:
        tickets_requested = event.limit_per_person

    # capacity checks
    if ticket_count > event.capacity:
        # send to sentry
        error = TooManyTicketsIssuedError("Too many tickets have been issued")
        sentry_sdk.capture_error(error)
        raise error
    if ticket_count == event.capacity:
        error = TicketsSoldOutError("Tickets sold out")
        sentry_sdk.capture_message(error)
        raise error

    # check available tickets
    if event.limit_per_person + ticket_count > event.capacity:
        raise TooManyTicketsRequestedError(
            "Tickets requested would bring event over capacity. Please lower requested tickets."
        )

    # check tickets_requested requested against limt_per_person
    if tickets_requested > event.limit_per_person:
        raise TooManyTicketsRequestedError(
            "Tickets requested are over the limit per person"
        )

    # all checks passed
    # return initial tickets_requested integer
    return tickets_requested
