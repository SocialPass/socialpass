from typing import Optional

from fastapi import APIRouter

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
    scene_img_source: Optional[str] = None,
):
    """
    Use the request to generate a ticket image and save.
    Generating & storing ticket are passed into a background task
    """

    (ticket_img, response) = crud.generate_and_store_ticket(
        event_data=event_data,
        embed=embed,
        scene_img_source=scene_img_source,
        top_banner_text=top_banner_text,
        filename=filename,
    )

    # return
    success_response = {
        "filename": filename,
        "message": "Success! Ticket image generated.",
    }
    return success_response
