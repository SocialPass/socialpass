import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from web3 import Web3
from .crud import get_web3, balanceOf, tokenOfOwnerByIndex, tokenURI, Requirements

router = APIRouter(
    prefix="/requirements",
    tags=["requirements"],
)


@router.post("/verify")
def verify_requirements(wallet_address: str, requirements_list: List[Requirements]):
    """
    Given a wallet address and array of requirements, `verify_requirements` will loop through
    all requirements until a wallet has passed said requirements, or no requirements could be met.

    This function is to be blockchain & asset agnostic, meaning that the web3 provider,
    as well as the type of asset lookup, will be determined on the `requirements_list` parameter.
    """
    # loop over list of Requirements
    for req in requirements_list:
        # determine chain
        web3 = get_web3(chain_id=req.chain_id)

        # determine / perform asset lookup
        if req.asset_type == "ERC20":
            token_balance = balanceOf(
                w3=web3,
                contract_address=Web3.toChecksumAddress(req.asset_address),
                wallet_address=Web3.toChecksumAddress(wallet_address),
            )
        if req.asset_type == "ERC721":
            token_balance = balanceOf(
                w3=web3,
                contract_address=Web3.toChecksumAddress(req.asset_address),
                wallet_address=Web3.toChecksumAddress(wallet_address),
            )
        if req.asset_type == "ERC1155":
            token_balance = 0

        # check if token_balance meets requirements;
        # if so, return success,
        # if not, continue loop
        if token_balance >= req.amount:
            return "OK"

    return HTTPException(status_code=403, detail="User does not meet requirements")


@router.post("/verify-721-enumerable")
def root(
    contract_address: str,
    wallet_address: str,
    chain_rpc: str,
    current_ticketed_snapshot: dict,
):
    """
    Logic is as follows:
    1. Init web3 with correct chainID

    2. Make `balanceOf` RPC call to get token balance.
        - If balance == 0, FAIL.
        - If balance > 0, continue against mapping validation / update

    3. Make `tokenOfOwnerByIndex` call (without loop) to check if contract has enumerable interface
        - If call reverts, jump to 3
        - If call DOESNT revert, jump to 4

        Note: at this point the wallet has necessary balance,
        Now it's needed to verify if ticket can be issued with this balance in step 3.

    4. Validate With ERC721Enumerable:
        - Loop from 1 => balanceOf result, calling
        ( Note: Filter against existing token ID's as loop index)

        - If un-mapped token ID is found, Update token ID => validated address and exit loop.

        - If un-mapped token ID is NOT found, FAIL.
    """

    # get / parse request variables
    try:
        contract_address = Web3.toChecksumAddress(contract_address)
        wallet_address = Web3.toChecksumAddress(wallet_address)
        chain_rpc = chain_rpc
    except Exception as e:
        error_response = {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "isBase64Encoded": False,
            "body": json.dumps({"errorCode": 10000, "revertMessage": str(e)}),
        }
        print(error_response)
        return error_response

    # init web3
    web3 = get_web3(chain_rpc)

    # get users tokenbalance
    try:
        token_balance = balanceOf(
            w3=web3, contract_address=contract_address, wallet_address=wallet_address
        )
    except Exception as e:
        error_response = {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "isBase64Encoded": False,
            "body": json.dumps({"errorCode": 10010, "revertMessage": str(e)}),
        }

        print(error_response)
        return error_response

    # verify balance > 0
    if token_balance == 0:
        error_response = {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "isBase64Encoded": False,
            "body": json.dumps({"errorCode": 20000}),
        }

        print(error_response)
        return error_response

    # check if ERC721 inherits enumerable interface
    # (will revert / throw exception if not)
    try:
        tokenOfOwnerByIndex(
            w3=web3,
            contract_address=contract_address,
            wallet_address=wallet_address,
            index=0,
        )
        is_enumerable = True
    except Exception as e:
        error_response = {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "isBase64Encoded": False,
            "body": json.dumps({"errorCode": 10010, "revertMessage": str(e)}),
        }

        print(error_response)
        return error_response

    # verify for ticketing on enumerable erc721 contract
    if is_enumerable is True:
        # keep in memory list of token_id, no need for additional lookup later
        token_id_list = []

        # initial for loop checks for token ids not yet redeemed
        for index in range(0, token_balance):
            token_id = tokenOfOwnerByIndex(
                w3=web3,
                contract_address=contract_address,
                wallet_address=wallet_address,
                index=index,
            )
            token_id_list.append(token_id)

            # Don't check already ticketed token_id's
            if str(token_id) not in current_ticketed_snapshot.keys():

                # get token uri
                token_uri = tokenURI(
                    w3=web3, contract_address=contract_address, token_id=token_id
                )

                # successful validation, move to issuing ticket
                # (create sha256 hash for image name)
                random_string = secrets.token_urlsafe(16)
                sucesss_response = {
                    "statusCode": 200,
                    "headers": {"Content-Type": "application/json"},
                    "isBase64Encoded": False,
                    "body": json.dumps(
                        {
                            "image_hash": hashlib.sha256(
                                random_string.encode("utf-8")
                            ).hexdigest(),
                            "token_id": token_id,
                            "token_uri": token_uri,
                        }
                    ),
                }
                print(sucesss_response)
                return sucesss_response

        # If reached here, than account has balance but all token id's have been redeemed
        # Determine if the token_ids were redeemed by requester, or another wallet (20010 or 20020 error)
        for _token_id in token_id_list:
            if str(_token_id) in current_ticketed_snapshot.keys():
                wallet_address = current_ticketed_snapshot[str(token_id)]
                if wallet_address == wallet_address:
                    error_response = {
                        "statusCode": 200,
                        "headers": {"Content-Type": "application/json"},
                        "isBase64Encoded": False,
                        "body": json.dumps({"errorCode": 20010, "token_id": _token_id}),
                    }
                    print(error_response)
                    return error_response

        # all token id's found were redeemed by another wallet
        error_response = {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "isBase64Encoded": False,
            "body": json.dumps({"errorCode": 20020}),
        }

        print(error_response)
        return error_response

    if is_enumerable is False:
        error_response = {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "isBase64Encoded": False,
            "body": json.dumps({"errorCode": 10010}),
        }

        print(error_response)
        return error_response
