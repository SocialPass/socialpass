import logging
import random
import string
import time
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from routers.blockchain import routes as Blockchain
from routers.tickets import routes as Ticketing


# setup main application
app = FastAPI()
# setup logging
logging.config.fileConfig('logging.conf', disable_existing_loggers=False)
# get root logger
logger = logging.getLogger(__name__)

# 422 exception logger
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.info(f"{str(exc)}")
    content = {'status_code': 422, 'message': str(exc), 'data': None}
    return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

# http request time logger
@app.middleware("http")
async def log_requests(request: Request, call_next):
    idem = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    logger.info(f"rid={idem} path={request.url.path}")
    start_time = time.time()

    response = await call_next(request)

    process_time = (time.time() - start_time) * 1000
    formatted_process_time = '{0:.2f}'.format(process_time)
    logger.info(f"rid={idem} completed_in={formatted_process_time}ms status_code={response.status_code}")
    return response


# setup main application routers
app.include_router(Blockchain.router)
app.include_router(Ticketing.router)
