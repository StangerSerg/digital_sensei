import aio_pika
import json
from typing import Any

class RabbitMQClient:
    def __init__(self, url: str):
        self.url = url
        self.connection: aio_pika.Connection | None = None
        self.channel: aio_pika.Channel | None = None

    async def connect(self):
        """Подключение к RabbitMQ и создание очередей"""
        self.connection = await aio_pika.connect_robust(self.url)
        self.channel = await self.connection.channel()
        await self._declare_queues()

    async def _declare_queues(self):
        """Создаёт очереди с Dead Letter Exchange"""
        queues = ["init_queue", "morning_queue", "report_queue"]
        for q in queues:
            await self.channel.declare_queue(
                q,
                durable=True,
                arguments={
                    "x-dead-letter-exchange": "dlx",
                    "x-dead-letter-routing-key": f"{q}.dlx"
                }
            )
        # Dead Letter Exchange
        await self.channel.declare_exchange("dlx", aio_pika.ExchangeType.DIRECT, durable=True)
        dead_letter_queue = await self.channel.declare_queue("dead_letters", durable=True)
        await dead_letter_queue.bind("dlx", routing_key="#")

    async def publish(self, queue: str, data: dict):
        await self.channel.default_exchange.publish(
            aio_pika.Message(
                body=json.dumps(data).encode(),
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT
            ),
            routing_key=queue
        )

    async def close(self):
        if self.connection:
            await self.connection.close()