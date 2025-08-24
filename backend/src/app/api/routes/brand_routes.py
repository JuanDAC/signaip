from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.domain.services.brand_service import BrandService
from app.adapters.db.repositories.brand_repository import BrandRepository
from app.schemas.brand_dto import BrandCreateDTO, BrandUpdateDTO, BrandReadDTO
from app.api.dependencies.auth_dependency import verify_api_key
from app.adapters.db.session import get_db

router = APIRouter()

def get_service(db: Session = Depends(get_db)) -> BrandService:
    """Obtener el servicio de marcas con la sesión de base de datos inyectada"""
    repository = BrandRepository(db=db)
    return BrandService(repo=repository)

@router.get("/brands", response_model=List[BrandReadDTO], dependencies=[Depends(verify_api_key)])
def list_brands(service: BrandService = Depends(get_service)):
    """Obtener todas las marcas registradas"""
    try:
        brands = service.list_brands()
        return brands
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/brands/{brand_id}", response_model=BrandReadDTO, dependencies=[Depends(verify_api_key)])
def get_brand(brand_id: int, service: BrandService = Depends(get_service)):
    """Obtener una marca por su ID"""
    try:
        brand = service.get_brand(brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Marca no encontrada")
        return brand
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/brands", response_model=BrandReadDTO, dependencies=[Depends(verify_api_key)])
def create_brand(dto: BrandCreateDTO, service: BrandService = Depends(get_service)):
    """Crear una nueva marca"""
    try:
        brand = service.create_brand(dto)
        return brand
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/brands/{brand_id}", response_model=BrandReadDTO, dependencies=[Depends(verify_api_key)])
def update_brand(brand_id: int, dto: BrandUpdateDTO, service: BrandService = Depends(get_service)):
    """Actualizar una marca existente"""
    try:
        brand = service.update_brand(brand_id, dto)
        return brand
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/brands/{brand_id}", dependencies=[Depends(verify_api_key)])
def delete_brand(brand_id: int, service: BrandService = Depends(get_service)):
    """Eliminar una marca"""
    try:
        service.delete_brand(brand_id)
        return {"detail": "Marca eliminada correctamente"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
