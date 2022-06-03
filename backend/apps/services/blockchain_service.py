import requests
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
            fungible_assets = moralis_get_fungible_assets(
                chain_id=hex(requirement["chain_id"]),
                wallet_address=wallet_address,
                token_addresses=requirement["asset_address"],
                to_block=requirement["to_block"],
            )
            for i in fungible_asset:
                asset_ownership.append({
                    "requirement": requirement,
                    "asset": i
                })

        # non fungible requirement
        if (requirement["asset_type"] == "ERC721") or requirement["asset_type"] == "ERC1155":
            nft_assets = moralis_get_nonfungible_assets(
                chain_id=hex(requirement["chain_id"]),
                wallet_address=wallet_address,
                token_address=requirement["asset_address"],
                token_ids=requirement.get("token_id"),  # optional
            )
            for i in nft_assets:
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
        "X-API-Key": "UgecTEh53XCmf9sft9ZkcZWH5Bpx0wbglo8TYHfrqb7e0mW2NCtAgjFQ4uEKT6V4"
    }
    r = requests.get(url, params=payload, headers=headers)
    if r.status_code == 200:
        json = r.json()
        if json["balance"] > required_amount:
            return json

    return []


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
        "X-API-Key": "UgecTEh53XCmf9sft9ZkcZWH5Bpx0wbglo8TYHfrqb7e0mW2NCtAgjFQ4uEKT6V4"
    }
    r = requests.get(url, params=payload, headers=headers)
    if r.status_code != 200:
        return []

    json = r.json()
    if json["total"] == 0:
        return []

    data = []
    for idx, token in enumerate(json["result"]):
        # check for required_amount
        if int(token["amount"]) < required_amount:
            continue

        # check for token_ids (if applicable)
        if token_ids:
            if int(token["token_id"]) not in token_ids:
                continue
        # append matching data
        data.append(token)

    return data
