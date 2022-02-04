from fastapi import Depends, FastAPI

from routers import Blockchain

app = FastAPI()


app.include_router(Blockchain.router)

@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}
