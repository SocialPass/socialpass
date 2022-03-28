from typing import List, Optional
from fastapi import APIRouter, HTTPException, Response
from . import crud

# router setup
router = APIRouter(
    prefix="/ticketing",
    tags=["ticketing"],
)

# routes
@router.post("/generate-ticket-image")
def generate_ticket(
    event_data: dict,
    filename: str,
    embed: str,
    top_banner_text: Optional[str],
    scene_img_source: Optional[str] = None
):
    """
    Use the request to generate a ticket image and save.
    """
    # Generate ticket image from request data
    ticket_img = crud.generate_ticket(
        event_data=event_data,
        embed=embed,
        scene_img_source=scene_img_source,
        top_banner_text=top_banner_text
    )

    # Store ticket image into bucket
    response = crud.store_ticket(
        ticket_img=ticket_img,
        filename=filename
    )

    # return
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
