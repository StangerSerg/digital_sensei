import redis.asyncio as redis
import json
from typing import Optional, Any

class RedisClient:
    def __init__(self, url: str):
        self.client = redis.from_url(url, decode_responses=True)

    async def get(self, key: str) -> Optional[Any]:
        data = await self.client.get(key)
        return json.loads(data) if data else None

    async def set(self, key: str, value: Any, ttl: int = 86400) -> None:
        await self.client.setex(key, ttl, json.dumps(value))

    async def delete(self, key: str) -> None:
        await self.client.delete(key)

    async def close(self):
        await self.client.close()