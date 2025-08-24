from abc import ABC, abstractmethod

class AuthPort(ABC):
    @abstractmethod
    def validate_api_key(self, api_key: str) -> bool:
        pass
