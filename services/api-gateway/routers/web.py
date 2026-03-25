from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional

from core.redis_client import RedisClient
from connectors.factory import ConnectorFactory
from connectors.web import WebConnector
from core.config import settings

router = APIRouter()

# Pydantic модели
class MorningRequest(BaseModel):
    user_id: int
    declaration: str

class EveningRequest(BaseModel):
    user_id: int
    report: str
    metrics: Dict[str, int]  # energy, movement, clarity


# Зависимости
async def get_redis():
    redis_client = RedisClient(settings.redis_url)
    try:
        yield redis_client
    finally:
        await redis_client.close()

def get_web_connector():
    return ConnectorFactory.get("web", settings.orchestrator_url)


@router.get("/api/v1/web/user/{user_id}/dashboard")
async def get_dashboard(
    user_id: int,
    redis: RedisClient = Depends(get_redis),
    connector: WebConnector = Depends(get_web_connector)
):
    """Дашборд с кэшированием"""
    cache_key = f"user:{user_id}:dashboard"

    # Пробуем кэш
    cached = await redis.get(cache_key)
    if cached:
        return cached

    # Кэш промах — идём в оркестратор
    try:
        data = await connector.get_dashboard(user_id)
        formatted = connector.format_response(data)
        await redis.set(cache_key, formatted, ttl=settings.redis_cache_ttl)
        return formatted
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Orchestrator error: {e}")


@router.post("/api/v1/web/morning")
async def morning(
    req: MorningRequest,
    connector: WebConnector = Depends(get_web_connector)
):
    """Утренняя декларация"""
    try:
        result = await connector.send_morning(req.user_id, req.declaration)
        return result
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Orchestrator error: {e}")


@router.post("/api/v1/web/evening")
async def evening(
    req: EveningRequest,
    redis: RedisClient = Depends(get_redis),
    connector: WebConnector = Depends(get_web_connector)
):
    """Вечерний отчёт + инвалидация кэша"""
    try:
        result = await connector.send_evening(req.user_id, req.report, req.metrics)
        # Инвалидируем кэш
        await redis.delete(f"user:{req.user_id}:dashboard")
        return result
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Orchestrator error: {e}")