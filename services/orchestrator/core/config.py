from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    service_name: str = "orchestrator"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8001

    rabbitmq_url: str = "amqp://sensei:sensei@rabbitmq:5672/"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()