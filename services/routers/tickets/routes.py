import io
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Response

from . import crud

router = APIRouter(
    prefix="/ticketing",
    tags=["ticketing"],
)


@router.post("/generate-ticket")
def generate_ticket(
    event_data: dict,
    embed: str,
    top_banner_text: Optional[str],
    scene_img_source: Optional[str] = None
):
    """
    Use the request to generate a ticket image and save.
    """

    # Generage image from request data
    ticket_img = crud.generate_ticket(
        event_data=event_data,
        embed=embed,
        scene_img_source=scene_img_source,
        top_banner_text=top_banner_text
    )
    ticket_img.show()

    # Prepare image for S3
    buffer = io.BytesIO()
    ticket_img.save(buffer, "PNG")
    buffer.seek(0)  # Rewind pointer back to start

    success_response = {
        "headers": {"Content-Type": "application/json"},
        "isBase64Encoded": False,
        "statusCode": 200,
        "body":
            {
                "s3_response": 'response',
                "filename": 'filename',
                "message": "Success! Ticket image generated.",
            }
        ,
    }
    return success_response
