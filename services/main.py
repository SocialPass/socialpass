from fastapi import Depends, FastAPI
from pydantic import BaseSettings
from routers.requirements import routes as RequirementsRouter

# init settings
class Settings(BaseSettings):
    infura_key: str


# init app
app = FastAPI()

# setup routers
app.include_router(RequirementsRouter.router)
