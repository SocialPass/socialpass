import json
import requests
from typing import List, Optional
from eth_abi import decode_single, encode_abi, encode_single
from pydantic import BaseModel
from web3 import Web3

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

class SelectedOption(BaseModel):
    blockchain: str = "EVM"
    chain_id: Optional[int] = 1
    asset_type: Optional[str]
    asset_address: Optional[str]
    token_id: Optional[List[int]]


#
# MORALIS FUNCTIONS
#
def moralis_get_fungible(
    chain_id: str, wallet_address: str, contract_addresses: List[str], to_block: int
):
    """
    Gets token balances for a specific address

    Gets token owned by the given address, at the given contract_addresses, up until to_block
    """
    url = f"https://deep-index.moralis.io/api/v2/{wallet_address}/erc20/"
    payload = {
        "chain": chain_id,
        "to_block": to_block,
        "format": "decimal",
        "contract_addresses": contract_addresses,
    }
    headers = {
        "X-API-Key": "UgecTEh53XCmf9sft9ZkcZWH5Bpx0wbglo8TYHfrqb7e0mW2NCtAgjFQ4uEKT6V4"
    }
    r = requests.get(url, params=payload, headers=headers)
    if r.status_code == 200:
        return r.json()


def moralis_get_nfts(chain_id: str, wallet_address: str, contract_address: str):
    """
    Gets NFTs owned by the given address, at the given contract_address

    Use the token_address param to get results for a specific contract only
    Note results will include all indexed NFTs.

    Any request which includes the token_address param
    will start the indexing process for that NFT collection
    the very first time it is requested
    """
    url = (
        f"https://deep-index.moralis.io/api/v2/{wallet_address}/nft/{contract_address}"
    )
    payload = {"chain": chain_id, "format": "decimal", "limit": 28072}
    headers = {
        "X-API-Key": "UgecTEh53XCmf9sft9ZkcZWH5Bpx0wbglo8TYHfrqb7e0mW2NCtAgjFQ4uEKT6V4"
    }
    r = requests.get(url, params=payload, headers=headers)
    if r.status_code == 200:
        return r.json()


#
# Internal functions
#
def validate_evm_fungible(wallet_address: str, choice: SelectedOption, requirement:Requirement):
    print('fungible')
    return False


def validate_evm_nonfungible(wallet_address: str, choice: SelectedOption, requirement:Requirement):
    print('nonfungible')
    return False


#
# Public Utilities class
#
class Utilities():
    def validate_choices_against_requirements(
        wallet_address: str,
        limit_per_person: int,
        requirements: List[Requirement],
        selected_choices: List[SelectedOption]
    ):
        """
        Accepts a wallet address, list of requirements, and list of selected choices (optional)
        This method will will loop through selected_choices, ensuring
        1. SelectedOption data exists in Requirement data
        2. Wallet address possesses Requirement data
        3. Return
        """
        verified_choices = []
        for requirement in requirements:
            for choice in selected_choices:
                # preflight, check verified_choices has not met the limit
                if len(verified_choices) == limit_per_person:
                    break

                # 1. validate choice data against requirement data
                if choice['asset_address'] != requirement['asset_address']:
                    continue
                if choice['blockchain'] != requirement['blockchain']:
                    continue
                if choice['chain_id'] != requirement['chain_id']:
                    continue

                # 2. validate wallet address against requirement
                # EVM
                if requirement['blockchain'] == 'EVM':
                    if requirement['asset_type'] == 'ERC20':
                        is_validated = validate_evm_fungible(
                            choice=choice,
                            wallet_address=wallet_address,
                            requirement=requirement
                        )
                        if is_validated is False:
                            continue
                    if requirement['asset_type'] == 'ERC721' or \
                    requirement['asset_type'] == 'ERC1155':
                        is_validated = validate_evm_nonfungible(
                            choice=choice,
                            wallet_address=wallet_address,
                            requirement=requirement
                        )
                        if is_validated is False:
                            continue

                # 3. validated, append choice to verified_choices
                verified_choices.append(choice)
                print('verified_choices', verified_choices)

            # only executed on preflight check BREAK
            break


        # return
        return verified_choices
