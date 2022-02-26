from fastapi import APIRouter

router = APIRouter(
    prefix="/ticketing",
    tags=["ticketing"],
)

@router.get("/")
async def root():
    return "ticketing"
