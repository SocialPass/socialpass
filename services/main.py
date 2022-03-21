from fastapi import Depends, FastAPI
from pydantic import BaseSettings
from routers.blockchain import routes as Blockchain


# init settings
class Settings(BaseSettings):
    infura_key: str


# init app
app = FastAPI()

# setup routers
app.include_router(Blockchain.router)
