import base64
import hashlib
import json
import secrets
import requests
from enum import Enum
from eth_abi import decode_single, encode_abi, encode_single
from pydantic import BaseModel
from typing import Dict, List, Optional
from web3 import Web3


###
### SCHEMAS
###
class Requirements(BaseModel):
    amount: int
    blockchain: str = "EVM"
    chain_id: Optional[int] = 1
    asset_type: Optional[str]
    asset_address: Optional[str]
    token_id: Optional[List[int]]

class GateTypeEnum(Enum):
    TICKET = 'TICKET'
    AIRDROP = 'AIRDROP'


###
### FUNCTIONS
###
def moralis_get_nfts(chain_id:str, wallet_address:str, contract_address:str):
    """
    Gets NFTs owned by the given address

    Use the token_address param to get results for a specific contract only
    Note results will include all indexed NFTs
    Any request which includes the token_address param will start the indexing process for that NFT collection the very first time it is requested
    """
    url = f'https://deep-index.moralis.io/api/v2/{wallet_address}/nft/{contract_address}'
    payload = {
        'chain': chain_id,
        'format': 'decimal',
        'limit': 28072
    }
    headers={'X-API-Key': 'UgecTEh53XCmf9sft9ZkcZWH5Bpx0wbglo8TYHfrqb7e0mW2NCtAgjFQ4uEKT6V4'}
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
        return f"https://mainnet.infura.io/v3/{INFURA_API_KEY}"

    if chain_id == 3:
        # ropsten
        return f"https://ropsten.infura.io/v3/{INFURA_API_KEY}"

    if chain_id == 4:
        # rinkeby
        return f"https://rinkeby.infura.io/v3/{INFURA_API_KEY}"

    if chain_id == 56:
        # bsc
        return "https://bsc-dataseed1.binance.org"

    if chain_id == 137:
        # Matic
        return "https://rpc-mainnet.matic.network"

    if chain_id == 43114:
        # avalanche
        return f"https://api.avax.network/ext/bc/C/rpc"


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


###
### EVM FUNCTIONS
###
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
