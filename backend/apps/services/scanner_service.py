from datetime import datetime

from apps.root.models import RedemptionAccessKey, Ticket


class ForbiddenRedemptionError(Exception):
    pass


class AlreadyRedeemed(Exception):
    pass


class InvalidEmbedCodeError(Exception):
    pass


def get_ticket_from_embedded_qr_code(embed_code: str) -> Ticket:
    """Returns a ticket from the given embed code."""
    try:
        embed_code, filename = embed_code.split("/")
    except ValueError:
        raise InvalidEmbedCodeError("Embed code is invalid.")

    return Ticket.objects.get(embed_code=embed_code, filename=filename)


def access_key_can_redeem_ticket(
    ticket: Ticket, redemption_access_key: RedemptionAccessKey = None
) -> bool:
    """Returns a boolean indicating if the access key can reedem the given ticket."""
    if redemption_access_key is None:
        return True

    return ticket.event.id == redemption_access_key.event.id


def redeem_ticket(ticket: Ticket, redemption_access_key: RedemptionAccessKey = None):
    """Redeems a ticket."""
    if ticket.redeemed:
        raise AlreadyRedeemed("Ticket is already redeemed.")

    if not access_key_can_redeem_ticket(ticket, redemption_access_key):
        raise ForbiddenRedemptionError("Ticketed event does not match.")

    ticket.redeemed = True
    ticket.redeemed_at = datetime.now()
    ticket.redemption_access_key = redemption_access_key
    ticket.save()

    return ticket
