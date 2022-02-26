import base64
import hashlib
import json
import secrets
from eth_abi import decode_single, encode_abi, encode_single
from web3 import Web3

def get_network(chain_rpc):
    # init web3 && token contract
    try:
        web3 = Web3(Web3.HTTPProvider(chain_rpc))
        return web3
    except Exception as e:
        error_response = {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "isBase64Encoded": False,
            "body": json.dumps({"errorCode": 10030, "revertMessage": str(e)}),
        }
        print(error_response)
        return error_response


def get_function_signature_bytes(text:str):
    hex_bytes = Web3.keccak(text=f"{text}")
    hex_bytes = hex_bytes[0:4].hex()
    return hex_bytes


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
