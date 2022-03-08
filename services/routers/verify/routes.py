import json
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from web3 import Web3
from . import crud

router = APIRouter(
    prefix="/verify",
    tags=["verify"],
)

@router.post("/requirements")
def verify_requirements(gate_type: str, wallet_address: str, requirements: List[crud.Requirements]):
    """
    Given a wallet address and array of requirements, `verify_requirements` will loop through
    the list requirements until a wallet has passed said requirements, or no requirements could be met.

    This function is to be blockchain & asset agnostic, meaning that the web3 provider,
    as well as the type of asset lookup, will be determined on the `requirements` parameter.
    """
    # loop over list of Requirements
    for req in requirements:
        # init token_balance && web3 based on chain
        token_balance = 0
        web3 = crud.get_web3(chain_id=req.chain_id)
        payload = {'key1': 'value1', 'key2': ['value2', 'value3']}


        # perform asset lookup
        requests.get(f"https://deep-index.moralis.io/api/v2/0xf7a8f04c7fe7c8a6ed692bdf5ee1658559cbe7dc/nft/0x51e613727fdd2e0b91b51c3e5427e9440a7957e4?chain=eth&format=decimal')

        # determine / perform asset lookup
        if req.asset_type == "ERC20":
            token_balance = crud.balanceOf(
                w3=web3,
                contract_address=Web3.toChecksumAddress(req.asset_address),
                wallet_address=Web3.toChecksumAddress(wallet_address),
            )
        if req.asset_type == "ERC721":
            token_balance = crud.balanceOf(
                w3=web3,
                contract_address=Web3.toChecksumAddress(req.asset_address),
                wallet_address=Web3.toChecksumAddress(wallet_address),
            )
        if req.asset_type == "ERC1155":
            token_balance = crud.balanceOf1155(
                w3=web3,
                contract_address=Web3.toChecksumAddress(req.asset_address),
                wallet_address=Web3.toChecksumAddress(wallet_address),
            )

        # check if token_balance meets requirements;
        # if so, return success,
        # if not, continue loop
        if token_balance >= req.amount:
            return {
                "wallet_address": wallet_address,
                "token_balance": token_balance
            }

    return HTTPException(status_code=403, detail="User does not meet requirements")


@router.post("/issuance")
def verify_issuance(gate_type: crud.GateTypeEnum, reward_list:List):
    """
    Given a specific gate type, wallet address, as well as the associated gate reward list,
    determine if a reward (airdop, ticket, invite link, etc.) can be issued.

    `verify_issuance` is meant to protect against double-spends and other spam/bad-actors
    before the final token gate service call.
    """
    return
