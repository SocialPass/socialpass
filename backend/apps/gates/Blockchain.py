from datetime import datetime

import requests
from eth_account.messages import encode_defunct
from pytz import utc
from web3.auto import w3


#
# MORALIS FUNCTIONS
#
def moralis_get_fungible(
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


def moralis_get_nfts(
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


#
# Public Utilities class
#
class Utilities:
    def validate_signature(
        signature=None, signed_message="", address="", ticketed_event_id=""
    ):
        """
        Reusable method to validate a given signature
        """
        # 401 section: User has not provided invalid authentication details
        # check if already verified
        if signature.is_verified:
            return False, "Signature message already verified."

        # check if expired
        if signature.expires < (datetime.utcnow().replace(tzinfo=utc)):
            return False, f"Signature request expired at {signature.expires}"

        # check for id mismatch
        if str(signature.tokengate.public_id) != str(ticketed_event_id):
            return False, "Signature x TokenGate ID mismatch."

        # check if address matches recovered address
        _msg = encode_defunct(text=signature.signing_message)
        _recovered = w3.eth.account.recover_message(_msg, signature=signed_message)
        if _recovered != address:
            return False, "Signature x Address mismatch."

        # before success, mark as verified, update address, and save
        signature.is_verified = True
        signature.wallet_address = _recovered
        signature.save()

        return True, "OK"

    def fetch_checkout_options_against_requirements(wallet_address="", requirements=[]):
        """
        Return list of requirements, each augmented with available asset options
        """
        requirements_with_options = []
        for requirement in requirements:
            # fungible
            if requirement["asset_type"] == "ERC20":
                fungible_options = moralis_get_fungible(
                    chain_id=hex(requirement["chain_id"]),
                    wallet_address=wallet_address,
                    token_addresses=requirement["asset_address"],
                    to_block=requirement["to_block"],
                )
                if fungible_options:
                    requirements_with_options.append(
                        {"requirement": requirement, "options": fungible_options}
                    )
            # non fungible
            if (
                requirement["asset_type"] == "ERC721"
                or requirement["asset_type"] == "ERC1155"
            ):
                nft_options = moralis_get_nfts(
                    chain_id=hex(requirement["chain_id"]),
                    wallet_address=wallet_address,
                    token_address=requirement["asset_address"],
                    token_ids=requirement.get("token_id"),  # optional
                )
                if nft_options:
                    requirements_with_options.append(
                        {"requirement": requirement, "options": nft_options}
                    )

        return requirements_with_options

    def validate_checkout_selections_against_requirements(
        wallet_address="",
        limit_per_person=1,
        requirements=[],
        requirements_with_options=[],
    ):
        """
        Validate options against given options (union of requirement ++ selected asset
        """
        validated_options = []
        if len(requirements_with_options) == 0:
            return False, "no requirements_with_options provided"

        for obj in requirements_with_options:
            requirement = obj["requirement"]
            option = obj["option"]

            # check length vs limit_per_person
            if len(requirements_with_options) > limit_per_person:
                return False, "Option length exceeds gate limit"

            # check obj.requirement exists in tokengate.requirements
            if requirement not in requirements:
                return False, "Requirement x option mismatch"

            # check obj.requirement data matches obj.option data (address, asset_type, chain_id)
            if requirement["asset_address"].upper() != option["token_address"].upper():
                return False, "Asset address mismatch"
            if requirement["asset_type"] != option["contract_type"]:
                return False, "Asset type mismatch"

            # validate wallet_address against obj.option data
            if requirement["asset_type"] == "ERC20":
                data = moralis_get_fungible(
                    wallet_address=wallet_address,
                    chain_id=hex(requirement["chain_id"]),
                    token_addresses=requirement["asset_address"],
                    to_block=requirement["to_block"],
                )
                # check data exists
                if not data:
                    return False, "ERC20 token lookup not found"
            if requirement["asset_type"] == "ERC721":
                data = moralis_get_nfts(
                    wallet_address=wallet_address,
                    chain_id=hex(requirement["chain_id"]),
                    token_address=requirement["asset_address"],
                    token_ids=[int(option["token_id"])],
                )
                # check data exists
                if not data:
                    return False, "ERC721 NFT lookup not found"
            if requirement["asset_type"] == "ERC1155":
                data = moralis_get_nfts(
                    wallet_address=wallet_address,
                    chain_id=hex(requirement["chain_id"]),
                    token_address=requirement["asset_address"],
                    token_ids=[option["token_id"]],
                )
                # check data exists
                if not data:
                    return False, "ERC1155 NFT lookup not found"

            # validation completed
            # append to validated_options
            validated_options.append({"option": option, "requirement": requirement})

        # only return if all options succeed
        return True, validated_options
