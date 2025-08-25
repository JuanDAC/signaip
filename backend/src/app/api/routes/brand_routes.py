from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID
from app.schemas.brand_dto import BrandCreateDTO, BrandUpdateDTO, BrandReadDTO
from app.api.dependencies.auth_dependency import verify_api_key
from app.api.dependencies.brand_dependency import get_brand_use_case, get_brand_logger
from app.domain.use_cases.brand_use_case import BrandUseCase
from app.core.logger import log_operation_start, log_operation_error

router = APIRouter()

@router.get("/brands", response_model=List[BrandReadDTO], dependencies=[Depends(verify_api_key)])
def list_brands(use_case: BrandUseCase = Depends(get_brand_use_case)):
    """Obtener todas las marcas registradas"""
    try:
        brands = use_case.list_brands()
        return brands
    except Exception as e:
        log_operation_error("list_brands", "Brand", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/brands/{brand_id}", response_model=BrandReadDTO, dependencies=[Depends(verify_api_key)])
def get_brand(brand_id: UUID, use_case: BrandUseCase = Depends(get_brand_use_case)):
    """Obtener una marca por su ID"""
    try:
        brand = use_case.get_brand(brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Marca no encontrada")
        return brand
    except HTTPException:
        raise
    except Exception as e:
        log_operation_error("get_brand", "Brand", str(brand_id), error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/brands", response_model=BrandReadDTO, dependencies=[Depends(verify_api_key)])
def create_brand(dto: BrandCreateDTO, use_case: BrandUseCase = Depends(get_brand_use_case)):
    """Crear una nueva marca"""
    try:
        brand = use_case.create_brand(dto)
        return brand
    except Exception as e:
        log_operation_error("create_brand", "Brand", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/brands/{brand_id}", response_model=BrandReadDTO, dependencies=[Depends(verify_api_key)])
def update_brand(brand_id: UUID, dto: BrandUpdateDTO, use_case: BrandUseCase = Depends(get_brand_use_case)):
    """Actualizar una marca existente"""
    try:
        brand = use_case.update_brand(brand_id, dto)
        return brand
    except ValueError as e:
        log_operation_error("update_brand", "Brand", str(brand_id), error=str(e))
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        log_operation_error("update_brand", "Brand", str(brand_id), error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/brands/{brand_id}", dependencies=[Depends(verify_api_key)])
def delete_brand(brand_id: UUID, use_case: BrandUseCase = Depends(get_brand_use_case)):
    """Eliminar una marca (soft delete)"""
    try:
        use_case.delete_brand(brand_id)
        return {"detail": "Marca eliminada correctamente"}
    except ValueError as e:
        log_operation_error("delete_brand", "Brand", str(brand_id), error=str(e))
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        log_operation_error("delete_brand", "Brand", str(brand_id), error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/brands/{brand_id}/hard", dependencies=[Depends(verify_api_key)])
def hard_delete_brand(brand_id: UUID, use_case: BrandUseCase = Depends(get_brand_use_case)):
    """Eliminación física de una marca (solo para casos especiales)"""
    try:
        use_case.hard_delete_brand(brand_id)
        return {"detail": "Marca eliminada físicamente"}
    except ValueError as e:
        log_operation_error("hard_delete_brand", "Brand", str(brand_id), error=str(e))
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        log_operation_error("hard_delete_brand", "Brand", str(brand_id), error=str(e))
        raise HTTPException(status_code=500, detail=str(e))
