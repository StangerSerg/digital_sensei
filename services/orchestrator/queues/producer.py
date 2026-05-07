from core.rabbitmq import RabbitMQClient
from models.requests import InitRequest, MorningRequest, EveningRequest

async def send_init_task(rabbit: RabbitMQClient, req: InitRequest, task_id: int):
    await rabbit.publish("init_queue", {
        "task_id": task_id,
        "user_id": req.user_id,
        "name": req.name,
        "goal": req.goal,
        "custom_metrics": req.custom_metrics
    })

async def send_morning_task(rabbit: RabbitMQClient, req: MorningRequest, task_id: int):
    await rabbit.publish("daily_queue", {
        "task_id": task_id,
        "user_id": req.user_id,
        "declaration": req.declaration
    })

async def send_evening_task(rabbit: RabbitMQClient, req: EveningRequest, task_id: int):
    await rabbit.publish("report_queue", {
        "task_id": task_id,
        "user_id": req.user_id,
        "report": req.report,
        "metrics": req.metrics
    })