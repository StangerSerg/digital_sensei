from .base import BaseConnector
from typing import Dict

class WebConnector(BaseConnector):
    """Коннектор для веб-интерфейса"""

    def format_response(self, data: Dict) -> Dict:
        """Веб-морда получает всё без изменений"""
        return data

    async def get_dashboard(self, user_id: int) -> Dict:
        """Получить дашборд из оркестратора"""
        return await self._forward(f"api/orc/v1/user/{user_id}/dashboard")

    async def send_morning(self, user_id: int, declaration: str) -> Dict:
        """Отправить утреннюю декларацию"""
        return await self._forward(
            "api/orc/v1/morning",
            {"user_id": user_id, "declaration": declaration}
        )

    async def send_evening(self, user_id: int, report: str, metrics: Dict) -> Dict:
        """Отправить вечерний отчёт"""
        return await self._forward(
            "api/orc/v1/evening",
            {"user_id": user_id, "report": report, "metrics": metrics}
        )