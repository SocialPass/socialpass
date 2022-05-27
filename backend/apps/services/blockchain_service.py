import requests
from datetime.datetime import utcnow
from eth_account.messages import encode_defunct
from pytz import utc
from web3.auto import w3

def validate_signature(
    signature=None, signed_message="", address="", ticketed_event_id=""
):
    """
    Reusable method to validate a given signature
    """
    # 401 section: User has not provided invalid authentication details
    # check if already verified
    if signature.is_verified:
        return False, "Signature message already verified."

    # check if expired
    if signature.expires < (utcnow().replace(tzinfo=utc)):
        return False, f"Signature request expired at {signature.expires}"

    # check for id mismatch
    if str(signature.ticketed_event.public_id) != str(ticketed_event_id):
        return False, "Signature x TokenGate ID mismatch."

    # check if address matches recovered address
    _msg = encode_defunct(text=signature.signing_message)
    _recovered = w3.eth.account.recover_message(_msg, signature=signed_message)
    if _recovered != address:
        return False, "Signature x Address mismatch."

    # before success, mark as verified, update address, and save
    signature.is_verified = True
    signature.wallet_address = _recovered
    signature.save()

    return True, "OK"
