from fastapi import Depends, FastAPI
from routers.ticketing import routes as TicketingRouter

# init app
app = FastAPI()

# setup routers
app.include_router(TicketingRouter.router)

@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}
