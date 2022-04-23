from datetime import datetime
from typing import List, Optional, Union

import requests
from eth_account.messages import encode_defunct
from pydantic import BaseModel
from pytz import utc
from web3.auto import w3


#
# SCHEMAS
#
class Requirement(BaseModel):
    amount: int
    blockchain: str = "EVM"
    chain_id: Optional[int] = 1
    asset_type: Optional[str]
    asset_address: Optional[str]
    token_id: Optional[List[int]]
    to_block: Optional[int]


class SelectedAsset(BaseModel):
    asset_address: str #token_address
    asset_type: str #contract_type
    metadata: str #metadata
    name: str #name
    token_id: str #token_id
    token_uri: str #token_uri

#
# Public Utilities class
#
class Utilities:
    def validate_signature(
        signature=None, signed_message="", address="", tokengate_id=""
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
        if str(signature.tokengate.public_id) != str(tokengate_id):
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

    def fetch_options_against_requirements(
        wallet_address: str, requirements: List[Requirement]
    ):
        """
        Return list of requirements, each augmented with available asset options
        """
        requirements_with_options = []
        # loop over requirements
        for requirement in requirements:
            # fungible
            if requirement["asset_type"] == "ERC20":
                print("fungible")
                requirements_with_options.append(
                    {
                        "requirement": requirement,
                        "options": moralis_get_fungible(
                            chain_id=hex(requirement["chain_id"]),
                            wallet_address=wallet_address,
                            token_addresses=requirement["asset_address"],
                            to_block=requirement["to_block"],
                        ),
                    }
                )
            # non fungible
            if (
                requirement["asset_type"] == "ERC721"
                or requirement["asset_type"] == "ERC1155"
            ):
                print("nonfungible")
                requirements_with_options.append(
                    {
                        "requirement": requirement,
                        "options": moralis_get_nfts(
                            chain_id=hex(requirement["chain_id"]),
                            wallet_address=wallet_address,
                            token_address=requirement["asset_address"],
                        ),
                    }
                )

        return requirements_with_options

    def validate_options_against_requirements(
        wallet_address: str,
        limit_per_person: int,
        requirements: List[Requirement],
        requirements_with_options: List[Union[Requirement, SelectedAsset]]
    ):
        """
        Validate options against given options (union of requirement ++ selected asset
        """
        verified_options = []
        if len(requirements_with_options) == 0:
            return False, "no requirements_with_options provided"

        for obj in requirements_with_options:
            # check length vs limit_per_person
            if len(requirements_with_options) > limit_per_person:
                return False, "Option length exceeds gate limit"

            # check obj.requirement exists in tokengate.requirements
            if obj['requirement'] not in requirements:
                return False, "Requirement x option mismatch"

            # check obj.requirement data matches obj.option data (address, asset_type, chain_id)
            if (obj['requirement']['asset_address'].upper() != obj['option']['token_address'].upper()):
                return False, "Asset address mismatch"
            if (obj['requirement']['asset_type'] != obj['option']['contract_type']):
                return False, "Asset type mismatch"

            # validate wallet_address against obj.option data
            return(False, 'validate wallet_address against obj.option data - not yet implemented')

            # all verified_options
            # append to verified_options

        # only return if all options succeed
        return True, verified_options


#
# MORALIS FUNCTIONS
#
def moralis_get_fungible(
    chain_id: str, wallet_address: str, token_addresses: List[str], to_block: int
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
    return r.json()


def moralis_get_nfts(chain_id: str, wallet_address: str, token_address: str):
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
    if r.status_code == 200:
        json = r.json()
        if json['total'] > 0:
            return json['result']

    return []
