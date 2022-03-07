import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from web3 import Web3
from . import crud

router = APIRouter(
    prefix="/requirements",
    tags=["requirements"],
)


@router.post("/verify")
def verify_requirements(wallet_address: str, requirements_list: List[crud.Requirements]):
    """
    Given a wallet address and array of requirements, `verify_requirements` will loop through
    all requirements until a wallet has passed said requirements, or no requirements could be met.

    This function is to be blockchain & asset agnostic, meaning that the web3 provider,
    as well as the type of asset lookup, will be determined on the `requirements_list` parameter.
    """
    # loop over list of Requirements
    for req in requirements_list:
        # init token_balance && web3 based on chain
        token_balance = 0
        web3 = crud.get_web3(chain_id=req.chain_id)

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
            return "OK"

    return HTTPException(status_code=403, detail="User does not meet requirements")
