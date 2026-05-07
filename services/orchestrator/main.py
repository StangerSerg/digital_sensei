from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from routers import health, internal


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ===== STARTUP =====
    print(f"{settings.service_name} starting on {settings.host}:{settings.port}")
    yield
    # ===== SHUTDOWN =====
    print(f"{settings.service_name} shutting down")


app = FastAPI(
    title=settings.service_name,
    debug=settings.debug,
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(health.router)
app.include_router(internal.router)