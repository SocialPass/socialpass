import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from web3 import Web3
from . import crud

router = APIRouter(
    prefix="/verify",
    tags=["verify"],
)

@router.get("/requirements")
def verify_requirements(
    wallet_address: str,
    gate_type: crud.GateTypeEnum,
    gate_limit: int,
    reward_list: List[str],
    requirements: List[crud.Requirements]
):
    """
    Given a wallet address and array of requirements, `verify_requirements` will loop through
    the list requirements until a wallet has passed said requirements, or no requirements could be met.

    This function is to be blockchain & asset agnostic, meaning that the web3 provider,
    as well as the type of asset lookup, will be determined on the `requirements` parameter.
    """
    # loop over list of Requirements
    for req in requirements:
        # init token balance
        token_balance = 0
        token_ids = None

        # EVM
        if req.blockchain == "EVM":
            # determine / perform asset lookup
            # simple balanceOf for erc20, use moralis nfts for 721/1155
            if req.asset_type == "ERC20":
                web3 = crud.get_web3(chain_id=req.chain_id)
                token_balance = crud.balanceOf(
                    w3=web3,
                    contract_address=Web3.toChecksumAddress(req.asset_address),
                    wallet_address=Web3.toChecksumAddress(wallet_address),
                )
            if req.asset_type == "ERC721":
                tokens = crud.moralis_get_nfts(
                    chain_id=hex(req.chain_id),
                    contract_address=Web3.toChecksumAddress(req.asset_address),
                    wallet_address=Web3.toChecksumAddress(wallet_address),
                )
                token_ids = tokens['result']
                token_balance = tokens['total']

            if req.asset_type == "ERC1155":
                tokens = crud.moralis_get_nfts(
                    chain_id=hex(req.chain_id),
                    contract_address=Web3.toChecksumAddress(req.asset_address),
                    wallet_address=Web3.toChecksumAddress(wallet_address),
                )
                token_ids = tokens['result']
                token_balance = tokens['total']

            # check if token_balance meets req;
            # token_ids involve reward_list lookup; otherwise simple balanceOf
            if req.asset_type == "ERC721" or req.asset_type == "ERC1155":
                valid_ids = []
                for i in token_ids:
                    if i['token_id'] not in reward_list:
                        valid_ids.append(i['token_id'])
                    if len(valid_ids) >= gate_limit:
                        break
                if len(valid_ids) < req.amount:
                    return HTTPException(status_code=403, detail="User does not meet requirements")
            if req.asset_type == "ERC20":
                if token_balance < req.amount:
                    return HTTPException(status_code=403, detail="User does not meet requirements")

            # return
            if valid_ids:
                return {
                    "wallet_address": wallet_address,
                    "token_balance": token_balance,
                    "valid_passes": valid_ids,
                }
            else:
                # valid_ids's determine non-fungible passes
                # for fungible tokens, divide required amount by the balance to get
                # total valid passes
                passes = []
                counter = 0
                _balance = token_balance
                while _balance > 0:
                    counter+=1
                    passes.append(counter)
                    _balance = _balance / req.amount
                return {
                    "wallet_address": wallet_address,
                    "token_balance": token_balance,
                    "valid_passes": lower
                }
