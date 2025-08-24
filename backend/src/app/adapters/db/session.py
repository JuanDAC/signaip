from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

engine = create_engine(settings.DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Función para crear engine de test
def create_test_engine(database_url: str = "sqlite:///:memory:"):
    """Crear un engine de SQLite en memoria para tests"""
    return create_engine(
        database_url,
        connect_args={"check_same_thread": False},
        echo=False
    )

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
