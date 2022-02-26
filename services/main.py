from fastapi import Depends, FastAPI
from routers.requirements import routes as RequirementsRouter

# init app
app = FastAPI()

# setup routers
app.include_router(RequirementsRouter.router)
