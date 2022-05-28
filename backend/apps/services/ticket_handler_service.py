import boto3
import io
from django.conf import settings

from apps.root.models import Ticket, TicketedEvent
from apps.services import TicketImageGenerator

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
    ticketed_event: TicketedEvent,
    top_banner_text: str = "SocialPass Ticket",
    scene_img_source: str = None
):
    """
    Use the arguments to generate a ticket image and save into s3-compatible bucket.
    Returns ticket image as well as s3 storage response
    """
    # create ticket entry in DB
    created_ticket_db = Ticket.objects.create(ticketed_event=ticketed_event)

    # Generate ticket image from request data
    created_ticket_img = TicketImageGenerator.TicketPartGenerator.generate_ticket(
        event_data={
            "event_name": ticketed_event.title,
            "event_date": ticketed_event.date.strftime(
                "%m/%d/%Y, %H:%M:%S"
            ),
            "event_location": ticketed_event.location,
        },
        embed=f"{created_ticket_db.embed_code}/{created_ticket_db.filename}",
        scene_img_source=scene_img_source,
        top_banner_text=top_banner_text,
    )

    # Store ticket image into bucket
    # Prepare image for S3
    buffer = io.BytesIO()
    created_ticket_img.save(buffer, "PNG")
    buffer.seek(0)  # Rewind pointer back to start

    # put image into s3
    response = s3.put_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=created_ticket_db.image_location,
        Body=buffer,
        ContentType="image/png",
    )

    # return ticket image from pillow and s3 response
    return created_ticket_img, response
