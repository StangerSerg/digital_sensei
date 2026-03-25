from typing import Dict, Optional
from .base import BaseConnector
from .web import WebConnector

class ConnectorFactory:
    _instances: Dict[str, BaseConnector] = {}

    @classmethod
    def get(cls, interface: str, orchestrator_url: str) -> BaseConnector:
        if interface not in cls._instances:
            if interface == "web":
                cls._instances[interface] = WebConnector(orchestrator_url)
            else:
                cls._instances[interface] = BaseConnector(orchestrator_url)
        return cls._instances[interface]