from fastapi import APIRouter

from .crud import ticket_getter_lambda_handler

# setup router
router = APIRouter(
    prefix="/ticketing",
    tags=["ticketing"],
)

## ROUTES
@router.get("/ticket-image-getter")
def nftyirl_ticket_image_getter(filename: str = ""):
    # log request
    print(filename)

    # pass filename to ticket_getter_lambda_handler
    response = ticket_getter_lambda_handler(filename=filename)

    # log & return ticket_getter_lambda_handler response
    print(response)
    return response


@router.get("/ticket-generator")
def nftyirl_ticket_generator():
    return


@router.get("/ticket-image-generator")
def nftyirl_ticket_image_generator():
    return
