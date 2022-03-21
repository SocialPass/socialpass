from fastapi import Depends, FastAPI
from pydantic import BaseSettings
from routers.verify import routes as VerifyRouter


# init settings
class Settings(BaseSettings):
    infura_key: str


# init app
app = FastAPI()

# setup routers
app.include_router(VerifyRouter.router)
