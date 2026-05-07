from fastapi import APIRouter, Depends
from models.requests import InitRequest, MorningRequest, EveningRequest
from queues import producer

router = APIRouter(prefix="/api/orc/v1", tags=["internal"])

task_counter = 0


def get_rabbit():
    """Зависимость: будет передана из main.py"""
    from main import rabbitmq_client
    return rabbitmq_client


@router.post("/init")
async def init_user(req: InitRequest):
    global task_counter
    task_counter += 1
    print(f"[init] task {task_counter}: user {req.user_id}")

    # Отправляем в RabbitMQ
    rabbit = get_rabbit()
    await producer.send_init_task(rabbit, req, task_counter)

    return {"status": "accepted", "task_id": task_counter}


@router.post("/morning")
async def morning_declaration(req: MorningRequest):
    global task_counter
    task_counter += 1
    print(f"[morning] task {task_counter}: user {req.user_id}")

    rabbit = get_rabbit()
    await producer.send_morning_task(rabbit, req, task_counter)

    return {"status": "accepted", "task_id": task_counter}


@router.post("/evening")
async def evening_report(req: EveningRequest):
    global task_counter
    task_counter += 1
    print(f"[evening] task {task_counter}: user {req.user_id}")

    rabbit = get_rabbit()
    await producer.send_evening_task(rabbit, req, task_counter)

    return {"status": "accepted", "task_id": task_counter}


@router.get("/user/{user_id}/dashboard")
async def get_dashboard(user_id: int):
    """Заглушка"""
    return await plug_dashboard(user_id)


# ===== Заглушки =====

async def plug_dashboard(user_id: int):
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


async def plug_morning(req: MorningRequest):
    """Заглушка утренней декларации"""
    return {
        "reply": f"🌅 Принято, воин. Твоя цель на сегодня: '{req.declaration[:50]}...' Да пребудет с тобой сила!",
        "rank": "3 кю · Воин",
        "streak": 14
    }


async def plug_evening(req: EveningRequest):
    """Заглушка вечернего отчёта"""
    metrics_text = f"⚡{req.metrics.get('energy', 0)} 🏃{req.metrics.get('movement', 0)} 👁️{req.metrics.get('clarity', 0)}"
    return {
        "reply": f"🌙 Отчёт получен. Метрики: {metrics_text}\nСенсей-Строгий изучит.",
        "rank": "3 кю · Воин",
        "streak": 14
    }


async def plug_init(req: InitRequest):
    return {
        "reply": f"🌅 Принято, воин. Сенсеи подумают, какие метрики тебе назначить"
    }