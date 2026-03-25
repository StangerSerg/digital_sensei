from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Service
    service_name: str = "api-gateway"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000

    # Redis
    redis_url: str = "redis://redis:6379/0"
    redis_cache_ttl: int = 86400

    # Orchestrator
    orchestrator_url: str = "http://orchestrator:8001"

    # CORS
    allowed_origins: str = "http://localhost:8080,http://localhost:3000"

    @property
    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()