import json
import requests
import sentry_sdk
from requests.adapters import HTTPAdapter, Retry
from django.conf import settings
from eth_account.messages import encode_defunct
from web3.auto import w3
from web3 import Web3
from apps.root.models import BlockchainOwnership, Event

def validate_blockchain_wallet_ownership(
    event: Event, blockchain_ownership: BlockchainOwnership,
    signed_message: str, wallet_address:str
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
        verification_msg = f"BlockchainOwnership request expired at {blockchain_ownership.expires}"
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
    except Exception as e:
        verification_msg = "Unable to decode & validate blockchain_ownership, likely a forgery attempt."
        return verified, verification_msg

    # before success, mark as verified, update wallet_address, and save
    verified = True
    blockchain_ownership.is_verified = True
    blockchain_ownership.wallet_address = _recovered
    blockchain_ownership.save()
    verification_msg = "OK"
    return verified, verification_msg


def get_blockchain_asset_ownership(
    event:Event.requirements,
    wallet_address:BlockchainOwnership.wallet_address,
):
    """
    Return list of blockchain asset verified along with requirement verified against
    """
    asset_ownership = []
    for requirement in event.requirements:
        # fungible requirement
        if requirement["asset_type"] == "ERC20":
            fetched_assets = moralis_get_fungible_assets(
                chain_id=hex(requirement["chain_id"]),
                wallet_address=wallet_address,
                token_addresses=requirement["asset_address"],
                to_block=requirement["to_block"],
            )
        # non fungible requirement
        if (requirement["asset_type"] == "ERC721") or requirement["asset_type"] == "ERC1155":
            fetched_assets = moralis_get_nonfungible_assets(
                chain_id=hex(requirement["chain_id"]),
                wallet_address=wallet_address,
                token_address=requirement["asset_address"],
                token_ids=requirement.get("token_id"),  # optional
            )
        # append fetched assets
        for i in fetched_assets:
            asset_ownership.append({
                "requirement": requirement,
                "asset": i
            })

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
    headers = {
        "X-API-Key": settings.MORALIS_API_KEY
    }

    # setup retry logic
    _requests = requests.Session()
    retries = Retry(total=5, backoff_factor=1, status_forcelist=[ 502, 503, 504 ])
    _requests.mount('http://', HTTPAdapter(max_retries=retries))

    # requests try catch
    try:
        r = _requests.get(url, params=payload, headers=headers)
    except requests.exceptions.HTTPError as e:
        sentry_sdk.capture_error(e)
        raise e
    except requests.exceptions.Timeout:
        # Maybe set up for a retry, or continue in a retry loop
        sentry_sdk.capture_error(e)
    except requests.exceptions.TooManyRedirects:
        sentry_sdk.capture_error(e)
        raise e
    except requests.exceptions.RequestException as e:
        # catastrophic error. bail.
        sentry_sdk.capture_error(e)
        raise SystemExit(e)

    # SANITY CHECKS
    # parse _json response, check if balance and other stats are returned
    _json = r.json()
    if "balance" not in _json:
        sentry_sdk.capture_message(r, _json)
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
    headers = {
        "X-API-Key": settings.MORALIS_API_KEY
    }

    # setup retry logic
    _requests = requests.Session()
    retries = Retry(total=5, backoff_factor=1, status_forcelist=[ 502, 503, 504 ])
    _requests.mount('http://', HTTPAdapter(max_retries=retries))

    # requests try catch
    try:
        r = _requests.get(url, params=payload, headers=headers)
    except requests.exceptions.HTTPError as e:
        sentry_sdk.capture_error(e)
        raise e
    except requests.exceptions.Timeout:
        # Maybe set up for a retry, or continue in a retry loop
        sentry_sdk.capture_error(e)
    except requests.exceptions.TooManyRedirects:
        sentry_sdk.capture_error(e)
        raise e
    except requests.exceptions.RequestException as e:
        # catastrophic error. bail.
        sentry_sdk.capture_error(e)
        raise SystemExit(e)

    # SANITY CHECKS
    # parse _json response, check if total and other stats are returned
    _json = r.json()
    if "total" not in _json:
        sentry_sdk.capture_message(r, _json)
        return _json

    # check if asset response total is 0
    if _json["total"] == 0:
        return []

    # Result parsing
    parsed_data = []
    parsed_token = {}
    for token in _json["result"]:
        # check for required_amount
        if int(token["amount"]) < required_amount:
            continue

        # check for token_ids (if applicable)
        if token_ids and int(token["token_id"]) not in token_ids:
            continue

        # append matching token to parsed_data
        metadata = json.loads(token['metadata'])
        parsed_data.append({
            "token_address": token['token_address'],
            "token_id": token['token_id'],
            "token_hash": token['token_hash'],
            "token_image": metadata.get('image', ''),
        })


    return parsed_data
