from datetime import datetime

from eth_account.messages import encode_defunct
from pytz import utc
from web3.auto import w3

from apps.root.models import Signature, TicketedEvent


def validate_signature(
    signature: Signature,
    ticketed_event: TicketedEvent,
    signed_message: str,
    wallet_address: str,
):
    """
    Validate a given signature
    """
    # 401 section: User has not provided invalid authentication details
    # check if already verified
    if signature.is_verified:
        return False, "Signature message already verified."

    # check if expired
    if signature.expires < (datetime.utcnow().replace(tzinfo=utc)):
        return False, f"Signature request expired at {signature.expires}"

    # check for event mismatch
    if signature.ticketed_event != ticketed_event:
        return False, "Signature x TokenGate mismatch."

    # check if wallet_address matches recovered wallet_address
    _msg = encode_defunct(text=signature.signing_message)
    _recovered = w3.eth.account.recover_message(_msg, signature=signed_message)
    if _recovered != wallet_address:
        return False, "Signature x Address mismatch."

    # before success, mark as verified, update wallet_address, and save
    signature.is_verified = True
    signature.wallet_address = _recovered
    signature.save()

    return True, "OK"
