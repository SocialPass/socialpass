from fastapi import APIRouter

router = APIRouter(
    prefix="/airdrop",
    tags=["airdrop"],
)

@router.get("/")
async def root():
    return "airdrop"
