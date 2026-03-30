from pydantic import BaseModel
from typing import Dict, List, Optional

class InitRequest(BaseModel):
    user_id: int
    name: str
    goal: str
    custom_metrics: Optional[List[str]] = []

class MorningRequest(BaseModel):
    user_id: int
    declaration: str

class EveningRequest(BaseModel):
    user_id: int
    report: str
    metrics: Dict[str, int]