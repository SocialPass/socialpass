from fastapi import APIRouter

router = APIRouter(
    prefix="/blockchain",
    tags=["blockchain"],
)

@router.get("/")
async def root():
    return "blockchain"
