from injector import Binder, Module, Injector, singleton
from sqlalchemy.orm import Session
from app.domain.ports.brand_port import BrandPort
from app.domain.ports.auth_port import AuthPort
from app.adapters.db.repositories.brand_repository import BrandRepository
from app.adapters.auth.auth_adapter import SimpleAuthAdapter
from app.domain.use_cases.brand_use_case import BrandUseCase
from app.config import settings

class AppModule(Module):
    def __init__(self, db_session: Session = None):
        self.db_session = db_session
    
    def configure(self, binder: Binder) -> None:
        # Bindings para el dominio
        if self.db_session:
            # Para tests, usar la sesión proporcionada
            binder.bind(BrandPort, to=BrandRepository(db=self.db_session), scope=singleton)
        else:
            # Para producción, crear sin sesión (se manejará en las rutas)
            binder.bind(BrandPort, to=BrandRepository(), scope=singleton)
        
        binder.bind(BrandUseCase, to=BrandUseCase, scope=singleton)
        
        # Binding para autenticación
        binder.bind(AuthPort, to=SimpleAuthAdapter(valid_key=settings.API_KEY), scope=singleton)

# Crear el contenedor global para producción
injector = Injector([AppModule()])

def create_test_container(db_session: Session) -> Injector:
    """Crear un contenedor de test con una sesión de base de datos específica"""
    return Injector([AppModule(db_session=db_session)])
