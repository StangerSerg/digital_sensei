from pydantic import BaseModel

class InitRequest(BaseModel):
    user_id: int
    name: str
    goal: str
    custom_metrics: list[str] = []

class MorningRequest(BaseModel):
    user_id: int
    declaration: str

class EveningRequest(BaseModel):
    user_id: int
    report: str
    metrics: dict[str, int]