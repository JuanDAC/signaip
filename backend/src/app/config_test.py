import os
from dotenv import load_dotenv

load_dotenv()

class TestSettings:
    DATABASE_URL: str = "sqlite:///:memory:"
    API_KEY: str = "super-secret-key-123"
    ENVIRONMENT: str = "test"

test_settings = TestSettings()
