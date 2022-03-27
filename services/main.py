from fastapi import Depends, FastAPI
from pydantic import BaseSettings
from routers.blockchain import routes as Blockchain
from routers.tickets import routes as Ticketing


# init settings
class Settings(BaseSettings):
    infura_key: str


# init app
app = FastAPI()

# setup routers
app.include_router(Blockchain.router)
app.include_router(Ticketing.router)
