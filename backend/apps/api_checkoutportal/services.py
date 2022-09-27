import json

import requests
import sentry_sdk
from django.conf import settings
from requests.adapters import HTTPAdapter, Retry


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
