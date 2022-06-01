import io

from django.conf import settings

from apps.root.models import Ticket, Event, s3_client
from apps.services import TicketImageGenerator


def create_ticket_store_s3_bucket(
    event: Event,
    top_banner_text: str = "SocialPass Ticket",
    scene_img_source: str = None,
):
    """
    Use the arguments to generate a ticket image and save into s3-compatible bucket.
    Returns ticket image as well as s3 storage response
    """
    # create ticket entry in DB
    created_ticket_db = Ticket.objects.create(event=event)

    # Generate ticket image from request data
    created_ticket_img = TicketImageGenerator.TicketPartGenerator.generate_ticket(
        event_data={
            "event_name": event.title,
            "event_date": event.date.strftime("%m/%d/%Y, %H:%M:%S"),
            "event_location": event.location,
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
    response = s3_client.put_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=created_ticket_db.image_location,
        Body=buffer,
        ContentType="image/png",
    )

    # return ticket image from pillow and s3 response
    return created_ticket_img, response
