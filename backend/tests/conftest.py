import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker
from injector import Injector

from app.main import app
from app.container import AppModule
from app.adapters.db.session import Base, get_db, create_test_engine
from app.domain.entities.brand import Brand
from app.schemas.brand_dto import BrandCreateDTO, BrandUpdateDTO

# Configuración de base de datos para tests
# Usar un archivo temporal en lugar de memoria para evitar problemas de conexión
import tempfile
import os

# Crear un archivo temporal para la base de datos de test
test_db_file = tempfile.NamedTemporaryFile(delete=False, suffix='.db')
test_db_file.close()
test_db_url = f"sqlite:///{test_db_file.name}"

test_engine = create_test_engine(test_db_url)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="function")
def db_session():
    """Fixture para crear una sesión de base de datos temporal"""
    # Crear las tablas en el engine de test
    Base.metadata.create_all(bind=test_engine)
    
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        # Limpiar las tablas después del test
        Base.metadata.drop_all(bind=test_engine)

@pytest.fixture(scope="function")
def client(db_session):
    """Fixture para crear un cliente de test de FastAPI"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    # Usar la aplicación de test que usa SQLite
    from tests.test_app import test_app
    
    # Importar get_db desde session para el override
    from app.adapters.db.session import get_db
    
    # Limpiar cualquier override previo
    test_app.dependency_overrides.clear()
    
    # Override de la dependencia de base de datos
    test_app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(test_app) as test_client:
        yield test_client
    
    # Limpiar el override
    test_app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def brand_repository(db_session):
    """Fixture para crear un repositorio de marcas con sesión de test"""
    from app.adapters.db.repositories.brand_repository import BrandRepository
    return BrandRepository(db=db_session)

@pytest.fixture(scope="function")
def injector():
    """Fixture para crear un contenedor de dependencias para tests"""
    return Injector([AppModule()])

@pytest.fixture
def sample_brand_data():
    """Datos de ejemplo para crear marcas en tests"""
    return {
        "name": "Nike",
        "country": "USA"
    }

@pytest.fixture
def sample_brand_entity():
    """Entidad de marca de ejemplo"""
    return Brand(
        id=1,
        name="Nike",
        country="USA",
        status="Pendiente"
    )

@pytest.fixture
def sample_brand_create_dto():
    """DTO de creación de marca de ejemplo"""
    return BrandCreateDTO(
        name="Nike",
        country="USA"
    )

@pytest.fixture
def sample_brand_update_dto():
    """DTO de actualización de marca de ejemplo"""
    return BrandUpdateDTO(
        name="Nike Updated",
        country="USA",
        status="Aprobada"
    )

@pytest.fixture
def valid_api_key():
    """API Key válida para tests"""
    return "super-secret-key-123"

@pytest.fixture
def invalid_api_key():
    """API Key inválida para tests"""
    return "invalid-key"

@pytest.fixture
def api_headers(valid_api_key):
    """Headers con API Key válida"""
    return {"x-api-key": valid_api_key}

@pytest.fixture
def invalid_api_headers(invalid_api_key):
    """Headers con API Key inválida"""
    return {"x-api-key": invalid_api_key}

# Limpieza al final de la sesión de tests
def pytest_sessionfinish(session, exitstatus):
    """Limpiar el archivo de base de datos temporal al final de los tests"""
    try:
        os.unlink(test_db_file.name)
    except:
        pass
