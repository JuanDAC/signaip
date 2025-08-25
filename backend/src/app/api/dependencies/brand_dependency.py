from fastapi import Depends
from sqlalchemy.orm import Session
from app.adapters.db.session import get_db
from app.adapters.db.repositories.brand_repository import BrandRepository
from app.domain.use_cases.brand_use_case import BrandUseCase
from app.core.logger import get_logger_with_uuid

def get_brand_use_case(db: Session = Depends(get_db)) -> BrandUseCase:
    """Obtener el caso de uso de marcas con la sesión de base de datos inyectada"""
    repository = BrandRepository(db=db)
    return BrandUseCase(repo=repository)

def get_brand_logger(brand_id: str = None):
    """Obtener logger con contexto de UUID para operaciones de marca"""
    return get_logger_with_uuid(brand_id, "brand_operations")
