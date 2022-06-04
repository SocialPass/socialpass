import io

from apps.root.models import BlockchainOwnership, Event, Ticket
from apps.services import TicketImageGenerator, blockchain_service


class ZeroBlockchainAssetsError(Exception):
    pass


class PartialBlockchainAssetError(Exception):
    pass


def create_ticket_image(
    event: Event,
    ticket: Ticket,
    top_banner_text: str = "SocialPass Ticket",
    scene_img_source: str = None,
):
    """
    Use the arguments to generate a ticket image and save into s3-compatible bucket.
    Returns ticket image as well as s3 storage response
    """
    # Generate ticket image from event data
    created_ticket_img = TicketImageGenerator.TicketPartGenerator.generate_ticket(
        event_data={
            "event_name": event.title,
            "event_date": event.date.strftime("%m/%d/%Y, %H:%M:%S"),
            "event_location": event.location,
        },
        embed=f"{ticket.embed_code}/{ticket.filename}",
        scene_img_source=scene_img_source,
        top_banner_text=top_banner_text,
    )

    # Store ticket image into bucket
    # Prepare image for S3
    _buffer = io.BytesIO()
    created_ticket_img.save(_buffer, "PNG")
    _buffer.seek(0)  # Rewind pointer back to start

    # save ticket image
    # todo: ensure .png format (or whatever format)
    ticket.file.save(f"{str(ticket.filename)}.png", _buffer)
    return ticket


def create_tickets_blockchain_ownership(
    event: Event,
    blockchain_ownership: BlockchainOwnership,
    tickets_to_issue: int,
):
    """
    issue tickets for a given event based on blockchain_ownership checkout
    """
    # vars
    tickets = []

    # get blockchain asset ownership
    asset_ownership = blockchain_service.get_blockchain_asset_ownership(
        event=event,
        wallet_address=blockchain_ownership.wallet_address,
    )
    if not asset_ownership:
        raise ZeroBlockchainAssetsError("No blockchain assets found")

    if len(asset_ownership) < tickets_to_issue:
        raise PartialBlockchainAssetError(
            "Not enough blockchain assets found",
            {
                "expected": tickets_to_issue,
                "actual": len(asset_ownership) - tickets_to_issue,
            },
        )

    # generate tickets based on blockchain assets
    for blockchain_asset in asset_ownership:
        # break once ticket issuance length is met
        if len(tickets) == tickets_to_issue:
            break

        # check for existing ticket
        existing_ticket = Ticket.objects.filter(
            event=event, blockchain_asset=blockchain_asset
        )
        # First-time claim
        if not existing_ticket:
            new_ticket = Ticket.objects.create(
                event=event,
                blockchain_asset=blockchain_asset,
                blockchain_ownership=blockchain_ownership,
            )
        # existing asset claim, archive old ticket and create new one
        # TODO: Delete? Mark as archived?
        else:
            existing_ticket.delete()
            new_ticket = Ticket.objects.create(
                event=event,
                blockchain_asset=blockchain_asset,
                blockchain_ownership=blockchain_ownership,
            )

        create_ticket_image(event=event, ticket=new_ticket)
        # append ticket to list
        tickets.append(new_ticket)

    return tickets
