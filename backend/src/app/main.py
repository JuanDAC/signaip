from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.brand_routes import router as brand_router
from app.adapters.db.session import engine, Base
from app.adapters.db.models.brand_model import BrandModel

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events para la aplicación"""
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    pass

app = FastAPI(
    title="API de Registro de Marcas",
    description="API completa para el registro y gestión de marcas comerciales",
    version="1.0.0",
    lifespan=lifespan
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas
app.include_router(brand_router, prefix="/api/v1", tags=["Marcas"])

@app.get("/")
def read_root():
    return {"message": "API de Registro de Marcas - Backend Hexagonal con FastAPI"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API funcionando correctamente"}
