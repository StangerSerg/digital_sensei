from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings
from routers import internal

class Settings(BaseSettings):
    service_name: str = "orchestrator"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8001

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

app = FastAPI(title=settings.service_name, debug=settings.debug)

# CORS (для внутренних вызовов)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(internal.router)