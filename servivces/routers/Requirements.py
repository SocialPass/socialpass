from fastapi import APIRouter

router = APIRouter(
    prefix="/requirements",
    tags=["requirements"],
)

@router.get("/")
async def root():
    return "requirements"
