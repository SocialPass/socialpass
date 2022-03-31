from functools import lru_cache
from typing import Optional

from pydantic import BaseSettings


# init settings
class Settings(BaseSettings):
    SERVICES_INFURA_KEY: Optional[str]
    SERVICES_SPACES_KEY: Optional[str]
    SERVICES_SPACES_URL: Optional[str]
    SERVICES_SPACES_SECRET: Optional[str]
    SERVICES_SPACES_BUCKET_NAME: Optional[str]
    SERVICES_SPACES_DIRECTORY: Optional[str]


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
