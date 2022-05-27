import boto3
import io
from django.conf import settings

from apps.root.models import Ticket
from apps.services import TicketGenerator

# s3 client init
s3 = boto3.client(
    "s3",
    region_name="nyc3",
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)


def get_ticket_download_url(ticket:Ticket):
    """
    return s3 pre-signed URL for ticket file download
    """
    return s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket": f"{settings.AWS_STORAGE_BUCKET_NAME}",
            "Key": f"media/tickets/{str(ticket.filename)}.png",
        },
        ExpiresIn=3600,
    )


def create_ticket_store_s3_bucket(
    event_data: {}, filename: str, embed: str,
    top_banner_text: str = "SocialPass Ticket", scene_img_source: str = None
):
    """
    Use the request to generate a ticket image and save into s3-compatible bucket.
    Returns ticket image as well as s3 storage response
    """
    # Generate ticket image from request data
    ticket_img = TicketGenerator.TicketPartGenerator.generate_ticket(
        event_data=event_data,
        embed=embed,
        scene_img_source=scene_img_source,
        top_banner_text=top_banner_text,
    )

    # Store ticket image into bucket
    # Prepare image for S3
    buffer = io.BytesIO()
    ticket_img.save(buffer, "PNG")
    buffer.seek(0)  # Rewind pointer back to start

    # put image into s3
    response = s3.put_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=f"{settings.AWS_TICKET_DIRECTORY}{filename}.png",
        Body=buffer,
        ContentType="image/png",
    )

    # return ticket image from pillow and s3 response
    return ticket_img, response
