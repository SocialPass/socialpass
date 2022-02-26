from fastapi import Depends, FastAPI
from routers.ticketing import routes as TicketingRouter
from routers.requirements import routes as RequirementsRouter

# init app
app = FastAPI()

# setup routers
app.include_router(TicketingRouter.router)
app.include_router(RequirementsRouter.router)
