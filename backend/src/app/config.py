import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/brands_db")
    API_KEY: str = os.getenv("API_KEY", "super-secret-key-123")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

settings = Settings()
