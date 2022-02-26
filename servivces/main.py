from fastapi import Depends, FastAPI
from routers import (
    Requirements,
    Ticketing,
    Airdrop,
    Discord,
    Telegram
)

# init app
app = FastAPI()

# setup routers
app.include_router(Requirements.router)
app.include_router(Ticketing.router)
app.include_router(Airdrop.router)

@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}
