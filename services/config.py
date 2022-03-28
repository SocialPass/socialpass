from functools import lru_cache
from typing import Optional
from pydantic import BaseSettings

# init settings
class Settings(BaseSettings):
    INFURA_KEY: Optional[str]
    SPACES_KEY: str
    SPACES_SECRET: str


@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
