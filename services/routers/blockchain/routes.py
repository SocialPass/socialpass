from typing import List

from fastapi import APIRouter, HTTPException
from web3 import Web3

from . import crud

router = APIRouter(
    prefix="/blockchain",
    tags=["blockchain"],
)


@router.post("/verify-requirements")
def verify_requirements(
    wallet_address: str,
    gate_type: crud.GateTypeEnum,
    gate_limit: int,
    reward_list: List[str],
    requirements: List[crud.Requirement],
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
            return crud.verify_evm_requirement(
                req=req,
                gate_limit=gate_limit,
                reward_list=reward_list,
                wallet_address=wallet_address
            )
