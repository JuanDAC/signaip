from injector import inject
from typing import List, Optional
from app.domain.ports.brand_port import BrandPort
from app.domain.entities.brand import Brand
from app.schemas.brand_dto import BrandCreateDTO, BrandUpdateDTO
from app.core.logger import (
    log_operation_start, log_operation_success, log_operation_error,
    log_entity_created, log_entity_updated, log_entity_deleted
)
from uuid import UUID

class BrandUseCase:
    @inject
    def __init__(self, repo: BrandPort):
        self.repo = repo

    def list_brands(self) -> List[Brand]:
        """Obtener todas las marcas registradas"""
        log_operation_start("list_brands", "Brand")
        
        try:
            brands = self.repo.get_all()
            log_operation_success("list_brands", "Brand", extra={"count": len(brands)})
            return brands
        except Exception as e:
            log_operation_error("list_brands", "Brand", error=str(e))
            raise

    def get_brand(self, brand_id: UUID) -> Optional[Brand]:
        """Obtener una marca por su ID"""
        log_operation_start("get_brand", "Brand", str(brand_id))
        
        try:
            brand = self.repo.get_by_id(brand_id)
            if brand:
                log_operation_success("get_brand", "Brand", str(brand_id))
            return brand
        except Exception as e:
            log_operation_error("get_brand", "Brand", str(brand_id), error=str(e))
            raise

    def create_brand(self, dto: BrandCreateDTO) -> Brand:
        """Crear una nueva marca"""
        log_operation_start("create_brand", "Brand")
        
        try:
            # Crear entidad de dominio desde DTO
            brand = Brand(
                id=None,  # Se generará automáticamente
                name=dto.name,
                owner=dto.owner,
                lang=dto.lang,
                status=dto.status or "Pendiente"
            )
            
            # Persistir usando el repositorio
            created_brand = self.repo.create(brand)
            
            log_entity_created("Brand", str(created_brand.id))
            log_operation_success("create_brand", "Brand", str(created_brand.id))
            
            return created_brand
        except Exception as e:
            log_operation_error("create_brand", "Brand", error=str(e))
            raise

    def update_brand(self, brand_id: UUID, dto: BrandUpdateDTO) -> Brand:
        """Actualizar una marca existente"""
        log_operation_start("update_brand", "Brand", str(brand_id))
        
        try:
            # Crear entidad de dominio con solo los campos a actualizar
            update_data = {}
            if dto.name is not None:
                update_data['name'] = dto.name
            if dto.owner is not None:
                update_data['owner'] = dto.owner
            if dto.lang is not None:
                update_data['lang'] = dto.lang
            if dto.status is not None:
                update_data['status'] = dto.status
            
            # Crear entidad de dominio con campos de actualización
            updated_brand = Brand(
                id=brand_id,
                **update_data
            )
            
            # Actualizar usando el repositorio
            result = self.repo.update(brand_id, updated_brand)
            
            log_entity_updated("Brand", str(brand_id))
            log_operation_success("update_brand", "Brand", str(brand_id))
            
            return result
        except Exception as e:
            log_operation_error("update_brand", "Brand", str(brand_id), error=str(e))
            raise

    def delete_brand(self, brand_id: UUID) -> None:
        """Eliminar una marca (soft delete)"""
        log_operation_start("delete_brand", "Brand", str(brand_id))
        
        try:
            self.repo.delete(brand_id)
            log_entity_deleted("Brand", str(brand_id))
            log_operation_success("delete_brand", "Brand", str(brand_id))
        except Exception as e:
            log_operation_error("delete_brand", "Brand", str(brand_id), error=str(e))
            raise

    def hard_delete_brand(self, brand_id: UUID) -> None:
        """Eliminación física de una marca (solo para casos especiales)"""
        log_operation_start("hard_delete_brand", "Brand", str(brand_id))
        
        try:
            self.repo.hard_delete(brand_id)
            log_operation_success("hard_delete_brand", "Brand", str(brand_id))
        except Exception as e:
            log_operation_error("hard_delete_brand", "Brand", str(brand_id), error=str(e))
            raise
