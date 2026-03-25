from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional, List
from datetime import datetime

router = APIRouter(prefix="/api/orc/v1", tags=["internal"])

# ===== Pydantic модели =====
class MorningRequest(BaseModel):
    user_id: int
    declaration: str

class EveningRequest(BaseModel):
    user_id: int
    report: str
    metrics: Dict[str, int]

# ===== Заглушки =====

@router.get("/user/{user_id}/dashboard")
async def get_dashboard(user_id: int):
    """Заглушка дашборда"""
    return {
        "user": {
            "id": user_id,
            "rank": "3 кю · Воин",
            "streak": 14,
            "total_days": 45
        },
        "bushido": [
            {"code": "gi", "name": "義 Справедливость", "value": 78, "trend": 0.3},
            {"code": "yu", "name": "勇 Мужество", "value": 65, "trend": -0.2},
            {"code": "jin", "name": "仁 Сострадание", "value": 82, "trend": 0.5},
            {"code": "rei", "name": "礼 Уважение", "value": 80, "trend": 0.1},
            {"code": "makoto", "name": "誠 Честность", "value": 88, "trend": 0.2},
            {"code": "meiyo", "name": "名誉 Честь", "value": 75, "trend": -0.1},
            {"code": "chugi", "name": "忠義 Верность", "value": 70, "trend": 0.0}
        ],
        "sword": [
            {"name": "Математика", "value": 72, "trend": 2},
            {"name": "Программирование", "value": 68, "trend": 5},
            {"name": "Аналитика", "value": 45, "trend": 8}
        ],
        "quality": {
            "energy": 7,
            "movement": 6,
            "clarity": 8
        },
        "recommendations": [
            "Мужество проседает — добавь вызовы",
            "Аналитика растёт — отлично!"
        ]
    }


@router.post("/morning")
async def morning(req: MorningRequest):
    """Заглушка утренней декларации"""
    return {
        "reply": f"🌅 Принято, воин. Твоя цель на сегодня: '{req.declaration[:50]}...' Да пребудет с тобой сила!",
        "rank": "3 кю · Воин",
        "streak": 14
    }


@router.post("/evening")
async def evening(req: EveningRequest):
    """Заглушка вечернего отчёта"""
    metrics_text = f"⚡{req.metrics.get('energy', 0)} 🏃{req.metrics.get('movement', 0)} 👁️{req.metrics.get('clarity', 0)}"
    return {
        "reply": f"🌙 Отчёт получен. Метрики: {metrics_text}\nСенсей-Строгий изучит.",
        "rank": "3 кю · Воин",
        "streak": 14
    }


@router.get("/health")
async def health():
    return {"status": "ok", "service": "orchestrator"}