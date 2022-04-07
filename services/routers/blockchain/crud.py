import json
from typing import List, Optional

import requests
from eth_abi import decode_single, encode_abi, encode_single
from fastapi import HTTPException
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


#
# MAIN FUNCTIONS
#
def verify_evm_requirement(
    req: Requirement, limit_per_person: int, wallet_address: str
):
    # init token balance
    token_balance = 0
    token_ids = None

    # ERC20 ////////////////////////////////////////////////////////////////////////////
    if req.asset_type == "ERC20":
        # initial balance lookup
        tokens = moralis_get_fungible(
            chain_id=hex(req.chain_id),
            contract_addresses=[Web3.toChecksumAddress(req.asset_address)],
            wallet_address=Web3.toChecksumAddress(wallet_address),
            to_block=req.to_block,
        )
        for token in tokens:
            if token["token_address"].casefold() == req.asset_address.casefold():
                decimals = int(token["decimals"])
                token_balance = int(token["balance"])
                break

        # divide balance by required amount,
        # issue validated_passes as whatever is lower (quotient or limit_per_person)
        if token_balance < req.amount:
            raise HTTPException(
                status_code=403, detail="User does not meet requirements"
            )
        quotient = token_balance / req.amount
        if int(quotient) >= limit_per_person:
            return {
                "wallet_address": wallet_address,
                "token_balance": token_balance,
                "validated_passes": limit_per_person,
            }
        else:
            return {
                "wallet_address": wallet_address,
                "token_balance": token_balance,
                "validated_passes": int(quotient),
            }

    # ERC721 ////////////////////////////////////////////////////////////////////////////
    if req.asset_type == "ERC721":
        # initial token ID lookup
        tokens = moralis_get_nfts(
            chain_id=hex(req.chain_id),
            contract_address=Web3.toChecksumAddress(req.asset_address),
            wallet_address=Web3.toChecksumAddress(wallet_address),
        )
        token_ids = tokens["result"]
        token_balance = tokens["total"]

        # loop retrieved token_id's against given reward_list (until limit_per_person reached)
        # issue passes as whatever is lower (quotient or limit_per_person)
        validated_passes = []
        for i in token_ids:
            validated_passes.append(i["token_id"])
            if len(validated_passes) == limit_per_person:
                break

        if len(validated_passes) < req.amount:
            raise HTTPException(
                status_code=403, detail="User does not meet requirements"
            )
        # return
        return {
            "wallet_address": wallet_address,
            "token_balance": token_balance,
            "validated_passes": validated_passes,
        }

    # ERC1155 ////////////////////////////////////////////////////////////////////////////
    if req.asset_type == "ERC1155":
        raise HTTPException(status_code=400, detail="Not yet implemented")


#
# INTERNAL FUNCTIONS
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


def get_rpc_url(chain_id: str):
    """
    return hard-coded RPC url based on chain ID
    """
    API_KEY = "4sNPIDg5LBJubC6x_6N2Vr_76Xn_o1s9"
    if chain_id == 1:
        # eth
        return f"https://mainnet.infura.io/v3/{API_KEY}"

    if chain_id == 3:
        # ropsten
        return f"https://ropsten.infura.io/v3/{API_KEY}"

    if chain_id == 4:
        # rinkeby
        return f"https://rinkeby.infura.io/v3/{API_KEY}"

    if chain_id == 56:
        # bsc
        return "https://bsc-dataseed1.binance.org"

    if chain_id == 137:
        # Matic
        return "https://rpc-mainnet.matic.network"

    if chain_id == 43114:
        # avalanche
        return "https://api.avax.network/ext/bc/C/rpc"


def get_web3(chain_id: str):
    try:
        rpc_url = get_rpc_url(chain_id)
        web3 = Web3(Web3.HTTPProvider(rpc_url))
        return web3
    except Exception as e:
        rpc_url = get_rpc_url(chain_id)
        print(rpc_url)
        error_response = {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "isBase64Encoded": False,
            "body": json.dumps({"errorCode": 10030, "revertMessage": str(e)}),
        }
        print(error_response)
        return error_response


def get_function_signature_bytes(text: str):
    hex_bytes = Web3.keccak(text=f"{text}")
    hex_bytes = hex_bytes[0:4].hex()
    return hex_bytes


#
# EVM FUNCTIONS
#
def balanceOf(w3=None, contract_address=None, wallet_address=None):
    # build calldata for eth.call (signature_bytes + abi encoded_params)
    signature_bytes = get_function_signature_bytes("balanceOf(address)")
    encoded_params = encode_single("address", wallet_address)
    calldata = signature_bytes + encoded_params.hex()
    # RPC call to contract
    resp = w3.eth.call({"to": contract_address, "data": calldata})

    # get integer from bytes response
    token_balance = decode_single("uint256", resp)
    return token_balance


def balanceOf1155(w3=None, contract_address=None, token_id=None, wallet_address=None):
    # build calldata for eth.call (signature_bytes + abi encoded_params)
    signature_bytes = get_function_signature_bytes("balanceOf(address)")
    encoded_params = encode_abi(["address", "uint256"], [wallet_address, token_id])
    calldata = signature_bytes + encoded_params.hex()
    # RPC call to contract
    resp = w3.eth.call({"to": contract_address, "data": calldata})

    # get integer from bytes response
    token_balance = decode_single("uint256", resp)
    return token_balance


def tokenOfOwnerByIndex(w3=None, contract_address=None, wallet_address=None, index=0):
    # build calldata for eth.call (signature_bytes + abi encoded_params)
    signature_bytes = get_function_signature_bytes(
        "tokenOfOwnerByIndex(address,uint256)"
    )
    encoded_params = encode_abi(["address", "uint256"], [wallet_address, index])
    calldata = signature_bytes + encoded_params.hex()
    # RPC call to contract
    resp = w3.eth.call({"to": contract_address, "data": calldata})
    # get integer from bytes response
    token_balance = decode_single("uint256", resp)
    return token_balance


def tokenURI(w3=None, contract_address=None, token_id=0):
    # build calldata for eth.call (signature_bytes + abi encoded_params)
    signature_bytes = get_function_signature_bytes("tokenURI(uint256)")
    encoded_params = encode_single("uint256", token_id)
    calldata = signature_bytes + encoded_params.hex()
    # RPC call to contract
    resp = w3.eth.call({"to": contract_address, "data": calldata})
    token_uri = Web3.toText(resp)
    # cleanup whitespace bytes
    token_uri = token_uri.replace("\x00", "").strip()
    return token_uri
