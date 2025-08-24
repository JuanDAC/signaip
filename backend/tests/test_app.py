from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.brand_routes import router as brand_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events para la aplicación de test"""
    # No crear tablas aquí, eso lo maneja el fixture db_session
    yield
    # Shutdown
    pass

# Crear aplicación de test
test_app = FastAPI(
    title="API de Registro de Marcas - Test",
    description="API de test para el registro y gestión de marcas comerciales",
    version="1.0.0",
    lifespan=lifespan
)

# Configuración de CORS
test_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas
test_app.include_router(brand_router, prefix="/api/v1", tags=["Marcas"])

@test_app.get("/")
def read_root():
    return {"message": "API de Registro de Marcas - Test Backend"}

@test_app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Test API funcionando correctamente"}
