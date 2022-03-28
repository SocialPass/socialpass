from fastapi import Depends, FastAPI
from config import Settings
from routers.blockchain import routes as Blockchain
from routers.tickets import routes as Ticketing


# init app
app = FastAPI()

# setup routers
app.include_router(Blockchain.router)
app.include_router(Ticketing.router)
