from app.domain.ports.auth_port import AuthPort
from app.config import settings

class SimpleAuthAdapter(AuthPort):
    def __init__(self, valid_key: str):
        self.valid_key = valid_key

    def validate_api_key(self, api_key: str) -> bool:
        return api_key == self.valid_key
