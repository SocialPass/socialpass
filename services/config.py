from functools import lru_cache
from typing import Optional
from pydantic import BaseSettings

# init settings
class Settings(BaseSettings):
    SERVICES_INFURA_KEY: Optional[str]
    SERVICES_SPACES_URL: str
    SERVICES_SPACES_KEY: str
    SERVICES_SPACES_SECRET: str


@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
