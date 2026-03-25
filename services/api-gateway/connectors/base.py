from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import httpx

class BaseConnector(ABC):
    """Базовый коннектор для всех интерфейсов"""

    def __init__(self, orchestrator_url: str):
        self.orchestrator_url = orchestrator_url
        self._client = httpx.AsyncClient(timeout=30.0)

    async def _forward(self, endpoint: str, data: Optional[Dict] = None) -> Dict:
        """Отправить запрос в оркестратор"""
        url = f"{self.orchestrator_url}/{endpoint}"
        if data:
            response = await self._client.post(url, json=data)
        else:
            response = await self._client.get(url)
        response.raise_for_status()
        return response.json()

    @abstractmethod
    def format_response(self, data: Dict) -> Dict:
        """Форматирует ответ под конкретный интерфейс"""
        pass

    async def close(self):
        await self._client.aclose()