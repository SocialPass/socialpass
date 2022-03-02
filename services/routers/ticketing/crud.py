import base64
import io
import json
import boto3
import uuid
from PIL import Image

## GLOBALS
# S3 client
s3 = boto3.client("s3", "us-east-2")

## FUNCTIONS
def get_placeholder_img():
    """
    Open the local placeholder image from local, and return it as binary.
    """
    placeholder_img = Image.open("assets/ticket-placeholder.png")

    # Prepare image to be returned as binary
    buffer = io.BytesIO()
    placeholder_img.save(buffer, "PNG")
    buffer.seek(0)  # Rewind pointer back to start

    return buffer.read()


def ticket_getter_lambda_handler(filename: str):
    """
    Main handler for the function. Given a filename (as query parameter), this
    function will either return the ticket image that corresponds to the given
    filename, or just a placeholder image.
    """
    S3_BUCKET_NAME = "tickets.nftytesting.com"
    S3_KEY = "ticket-images/"
    is_placeholder = "yes"  # Passed as header, which can only be strings

    try:
        response = s3.get_object(Bucket=S3_BUCKET_NAME, Key=f"{S3_KEY}{filename}.png")
        ticket_img = response["Body"].read()
        is_placeholder = "no"
    except Exception as e:
        ticket_img = get_placeholder_img()

    success_response = {
        "headers": {"Content-Type": "image/png", "is-placeholder": is_placeholder},
        "statusCode": 200,
        "body": base64.b64encode(ticket_img).decode("utf-8"),
        "isBase64Encoded": True,
    }
    return success_response
