class ResultConsumer:
    def __init__(self, rabbit: RabbitMQClient, ws_manager: WSManager):
        self.rabbit = rabbit
        self.ws_manager = ws_manager

    async def start(self):
        queue = await self.rabbit.channel.declare_queue("result_queue", durable=True)
        await queue.consume(self.handle_result)

    async def handle_result(self, message: aio_pika.IncomingMessage):
        async with message.process():
            result = json.loads(message.body)
            user_id = result.get("user_id")
            # Отправляем результат через WebSocket
            await self.ws_manager.send_result(user_id, result)