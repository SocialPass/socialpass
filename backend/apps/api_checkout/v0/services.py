import io
import json

import requests
import sentry_sdk
from django.conf import settings
from eth_account.messages import encode_defunct
from requests.adapters import HTTPAdapter, Retry
from web3 import Web3
from web3.auto import w3

from apps.api_checkout.v0 import TicketImageGenerator
from apps.root.models import BlockchainOwnership, Event, Ticket


class TooManyTicketsRequestedError(Exception):
    pass


class TooManyTicketsIssuedError(Exception):
    pass


class TicketsSoldOutError(Exception):
    pass


class ZeroBlockchainAssetsError(Exception):
    pass


class PartialBlockchainAssetError(Exception):
    pass


def get_available_tickets(event: Event, tickets_requested=None) -> int:
    """
    return how many tickets available for a given event
    """
    # get ticket count
    ticket_count = event.tickets.count()

    # if no tickets_requested, set to limit_per_person
    if not tickets_requested:
        tickets_requested = event.limit_per_person

    # capacity checks
    error: Exception
    if ticket_count > event.capacity:
        # send to sentry
        error = TooManyTicketsIssuedError("Too many tickets have been issued")
        sentry_sdk.capture_exception(error)
        raise error
    elif ticket_count == event.capacity:
        error = TicketsSoldOutError("Tickets sold out")
        sentry_sdk.capture_message(str(error))
        raise error

    # check available tickets
    if event.limit_per_person + ticket_count > event.capacity:
        raise TooManyTicketsRequestedError(
            "Tickets requested would bring event over capacity. \
            Please lower requested tickets."
        )

    # check tickets_requested requested against limt_per_person
    if tickets_requested > event.limit_per_person:
        raise TooManyTicketsRequestedError(
            "Tickets requested are over the limit per person"
        )

    # all checks passed
    # return initial tickets_requested integer
    if isinstance(tickets_requested, int):
        return tickets_requested
    else:
        raise ValueError("Unexpected value for tickets requested")


def create_ticket_image(
    event: Event,
    ticket: Ticket,
    top_banner_text="SocialPass Ticket",
    scene_img_source=None,
):
    """
    Use the arguments to generate a ticket image and save into s3-compatible bucket.
    Returns ticket image as well as s3 storage response
    """
    if event.start_date and event.title and event.initial_place:
        # Generate ticket image from event data
        created_ticket_img = TicketImageGenerator.TicketPartGenerator.generate_ticket(
            event_data={
                "event_name": event.title,
                "event_date": event.start_date.strftime("%m/%d/%Y, %H:%M:%S"),
                "event_location": event.initial_place,
            },
            embed=ticket.full_embed,
            scene_img_source=scene_img_source,
            top_banner_text=top_banner_text,
        )

        # Store ticket image into bucket
        # Prepare image for S3
        print("preparing image s3...")
        _buffer = io.BytesIO()
        created_ticket_img.save(_buffer, "PNG")
        _buffer.seek(0)  # Rewind pointer back to start

        # save ticket image
        print("saving image...")
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
    tickets: list[Ticket] = []

    # get blockchain asset ownership
    asset_ownership = get_blockchain_asset_ownership(
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


def validate_blockchain_wallet_ownership(
    event: Event,
    blockchain_ownership: BlockchainOwnership,
    signed_message: str,
    wallet_address: str,
):
    """
    Sets a blockchain_ownership as verified after successful verification
    Returns tuple of (verified:bool, verification_msg:str)
    """
    verified = False
    verification_msg = None
    # check if already verified
    if blockchain_ownership.is_verified:
        verification_msg = "BlockchainOwnership message already verified."

    # check if expired
    if blockchain_ownership.is_expired:
        verification_msg = (
            f"BlockchainOwnership request expired at {blockchain_ownership.expires}"
        )
        return verified, verification_msg

    # check for id mismatch
    if blockchain_ownership.event != event:
        verification_msg = "BlockchainOwnership x TokenGate ID mismatch."
        return verified, verification_msg

    # check for valid wallet_address
    if not Web3.isAddress(wallet_address):
        verification_msg = "Unrecognized wallet_address format"
        return verified, verification_msg

    # check if wallet_address matches recovered wallet_address
    try:
        _msg = encode_defunct(text=blockchain_ownership.signing_message)
        _recovered = w3.eth.account.recover_message(_msg, signature=signed_message)
        if _recovered != wallet_address:
            verification_msg = "BlockchainOwnership x Address mismatch."
            return verified, verification_msg
    except Exception:
        # forgery?
        verification_msg = f"Unable to decode {wallet_address} for {event.public_id}"
        sentry_sdk.capture_message(verification_msg)
        return verified, verification_msg

    # before success, mark as verified, update wallet_address, and save
    verified = True
    blockchain_ownership.is_verified = True
    blockchain_ownership.wallet_address = _recovered
    blockchain_ownership.save()
    verification_msg = "OK"
    return verified, verification_msg


def get_blockchain_asset_ownership(event: Event, wallet_address: str):
    """
    Return list of blockchain asset verified along with requirement verified against
    """
    asset_ownership = []
    for requirement in event.requirements:

        # fungible requirement
        if requirement["asset_type"] == "ERC20":
            try:
                fetched_assets = moralis_get_fungible_assets(
                    chain_id=hex(requirement["chain_id"]),
                    wallet_address=wallet_address,
                    token_addresses=requirement["asset_address"],
                    to_block=requirement["to_block"],
                )
            except Exception:
                continue

        # non fungible requirement
        if (requirement["asset_type"] == "ERC721") or requirement[
            "asset_type"
        ] == "ERC1155":
            try:
                fetched_assets = moralis_get_nonfungible_assets(
                    chain_id=hex(requirement["chain_id"]),
                    wallet_address=wallet_address,
                    token_address=requirement["asset_address"],
                    token_ids=requirement.get("token_id"),  # optional
                )
            except Exception:
                continue

        # check for fetched_assets
        if not fetched_assets:
            continue

        # append fetched assets
        for i in fetched_assets:
            asset_ownership.append({"requirement": requirement, "asset": i})

    return asset_ownership


#
# MORALIS FUNCTIONS
#
def moralis_get_fungible_assets(
    chain_id="", wallet_address="", token_addresses=[], to_block=None, required_amount=0
):
    """
    Gets token balances for a specific address
    Gets token owned by the given address, at the given token_addresses, up until to_block
    """
    url = f"https://deep-index.moralis.io/api/v2/{wallet_address}/erc20/"
    payload = {
        "chain": chain_id,
        "to_block": to_block,
        "format": "decimal",
        "token_addresses": token_addresses,
    }
    headers = {"X-API-Key": settings.MORALIS_API_KEY}

    # setup retry logic
    _requests = requests.Session()
    retries = Retry(total=5, backoff_factor=1, status_forcelist=[502, 503, 504])
    _requests.mount("http://", HTTPAdapter(max_retries=retries))

    # requests try catch
    try:
        r = _requests.get(url, params=payload, headers=headers)
    except requests.exceptions.HTTPError as e:
        sentry_sdk.capture_exception(e)
        raise e
    except requests.exceptions.Timeout as e:
        sentry_sdk.capture_exception(e)
        raise e
    except requests.exceptions.TooManyRedirects as e:
        sentry_sdk.capture_exception(e)
        raise e
    except requests.exceptions.RequestException as e:
        # catastrophic error. bail.
        sentry_sdk.capture_exception(e)
        raise e

    # SANITY CHECKS
    # parse _json response, check if balance and other stats are returned
    _json = r.json()
    if "balance" not in _json:
        sentry_sdk.capture_message(r)
        return []

    # check if asset response total less than required_amount
    if _json["balance"] < required_amount:
        return []

    return _json


def moralis_get_nonfungible_assets(
    chain_id="", wallet_address="", token_address="", token_ids=None, required_amount=0
):
    """
    Gets NFTs owned by the given address, at the given token_address
    Use the token_address param to get results for a specific contract only
    Note results will include all indexed NFTs.
    Any request which includes the token_address param
    will start the indexing process for that NFT collection
    the very first time it is requested
    """
    url = f"https://deep-index.moralis.io/api/v2/{wallet_address}/nft/{token_address}"
    payload = {"chain": chain_id, "format": "decimal"}
    headers = {"X-API-Key": settings.MORALIS_API_KEY}

    # setup retry logic
    _requests = requests.Session()
    retries = Retry(total=5, backoff_factor=1, status_forcelist=[502, 503, 504])
    _requests.mount("http://", HTTPAdapter(max_retries=retries))

    # requests try catch
    try:
        r = _requests.get(url, params=payload, headers=headers)
    except requests.exceptions.HTTPError as e:
        sentry_sdk.capture_exception(e)
        raise e
    except requests.exceptions.Timeout as e:
        sentry_sdk.capture_exception(e)
        raise e
    except requests.exceptions.TooManyRedirects as e:
        sentry_sdk.capture_exception(e)
        raise e
    except requests.exceptions.RequestException as e:
        # catastrophic error. bail.
        sentry_sdk.capture_exception(e)
        raise SystemExit(e)

    # SANITY CHECKS
    # parse _json response, check if total and other stats are returned
    _json = r.json()
    if "total" not in _json:
        sentry_sdk.capture_message(r)
        return _json

    # check if asset response total is 0
    if _json["total"] == 0:
        return []

    # Result parsing
    parsed_data = []
    for token in _json["result"]:
        # check for required_amount
        if int(token["amount"]) < required_amount:
            continue

        # check for token_ids (if applicable)
        if token_ids and int(token["token_id"]) not in token_ids:
            continue

        if token.get("metadata"):
            # append matching token to parsed_data
            metadata = json.loads(token["metadata"])
        else:
            metadata = {}
        parsed_data.append(
            {
                "token_address": token["token_address"],
                "token_id": token["token_id"],
                "token_hash": token["token_hash"],
                "token_image": metadata.get("image", ""),
            }
        )

    return parsed_data
