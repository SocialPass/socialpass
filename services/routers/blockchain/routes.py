from typing import List

from fastapi import APIRouter, HTTPException

from . import crud

router = APIRouter(
    prefix="/blockchain",
    tags=["blockchain"],
)


@router.post("/verify-requirements")
def verify_requirements(
    wallet_address: str,
    limit_per_person: int,
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
    for idx, req in enumerate(requirements):
        # EVM
        # Requirements failure verification throws HTTP error
        # HTTP Error is not raised until last requirement in list
        if req.blockchain == "EVM":
            try:
                resp = crud.verify_evm_requirement(
                    req=req,
                    limit_per_person=limit_per_person,
                    reward_list=reward_list,
                    wallet_address=wallet_address,
                )
                return resp
            except HTTPException as e:
                if idx == (len(requirements) - 1):
                    raise e
                else:
                    pass
