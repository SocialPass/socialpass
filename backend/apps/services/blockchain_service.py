from datetime import datetime

from eth_account.messages import encode_defunct
from pytz import utc
from web3.auto import w3
from web3 import Web3
from apps.root.models import BlockchainOwnership, Event


def validate_signature(event: Event, blockchain_ownership: BlockchainOwnership, signed_message: str, wallet_address:str):
    """
    Sets a signature as verified after successful verification
    Returns tuple of (verified:bool, verification_msg:str)
    """
    verified = False
    verification_msg = None
    if signature.is_verified:
        verification_msg = "BlockchainOwnership message already verified."

    # check if expired
    if signature.expires < (datetime.utcnow().replace(tzinfo=utc)):
        verification_msg = f"BlockchainOwnership request expired at {signature.expires}"
        return verified, verification_msg

    # check for id mismatch
    if signature.event != event:
        verification_msg = "BlockchainOwnership x TokenGate ID mismatch."
        return verified, verification_msg

    # check for valid wallet_address
    if not Web3.isAddress(wallet_address):
        verification_msg = "Unrecognized wallet_address format"
        return verified, verification_msg

    # check if wallet_address matches recovered wallet_address
    try:
        _msg = encode_defunct(text=signature.signing_message)
        _recovered = w3.eth.account.recover_message(_msg, signature=signed_message)
        if _recovered != wallet_address:
            verification_msg = "BlockchainOwnership x Address mismatch."
            return verified, verification_msg
    except Exception as e:
        verification_msg = "Unable to decode & validate signature, likely a forgery attempt."
        return verified, verification_msg

    # before success, mark as verified, update wallet_address, and save
    signature.is_verified = True
    signature.wallet_address = _recovered
    signature.save()
    verification_msg = "OK"
    return verified, verification_msg
