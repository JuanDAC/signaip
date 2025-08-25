from typing import List, Optional
from sqlalchemy.orm import Session
from app.domain.ports.brand_port import BrandPort
from app.domain.entities.brand import Brand
from app.adapters.db.models.brand_model import BrandModel
from app.core.logger import (
    log_operation_start, log_operation_success, log_operation_error,
    log_entity_created, log_entity_updated, log_entity_deleted, log_entity_not_found
)
from uuid import UUID
from datetime import datetime

class BrandRepository(BrandPort):
    def __init__(self, db: Session = None):
        self.db = db

    def get_all(self) -> List[Brand]:
        """Obtener todas las marcas activas (no eliminadas)"""
        log_operation_start("get_all", "Brand")
        
        if not self.db:
            log_operation_error("get_all", "Brand", error="Database session not provided")
            raise ValueError("Database session not provided")
        
        try:
            # Solo obtener marcas activas (no eliminadas)
            brands = self.db.query(BrandModel).filter(BrandModel.deleted_at.is_(None)).all()
            domain_brands = [brand.to_domain_entity() for brand in brands]
            
            log_operation_success("get_all", "Brand", extra={"count": len(domain_brands)})
            return domain_brands
            
        except Exception as e:
            log_operation_error("get_all", "Brand", error=str(e))
            raise

    def get_by_id(self, brand_id: UUID) -> Optional[Brand]:
        """Obtener una marca por ID (solo activas)"""
        log_operation_start("get_by_id", "Brand", str(brand_id))
        
        if not self.db:
            log_operation_error("get_by_id", "Brand", str(brand_id), error="Database session not provided")
            raise ValueError("Database session not provided")
        
        try:
            # Solo obtener marcas activas
            brand = self.db.query(BrandModel).filter(
                BrandModel.id == brand_id,
                BrandModel.deleted_at.is_(None)
            ).first()
            
            if brand:
                domain_brand = brand.to_domain_entity()
                log_operation_success("get_by_id", "Brand", str(brand_id))
                return domain_brand
            else:
                log_entity_not_found("Brand", str(brand_id))
                return None
                
        except Exception as e:
            log_operation_error("get_by_id", "Brand", str(brand_id), error=str(e))
            raise

    def create(self, brand: Brand) -> Brand:
        """Crear una nueva marca"""
        log_operation_start("create", "Brand")
        
        if not self.db:
            log_operation_error("create", "Brand", error="Database session not provided")
            raise ValueError("Database session not provided")
        
        try:
            # Crear modelo SQLAlchemy desde entidad de dominio
            db_brand = BrandModel.from_domain_entity(brand)
            
            self.db.add(db_brand)
            self.db.commit()
            self.db.refresh(db_brand)
            
            # Convertir de vuelta a entidad de dominio
            created_brand = db_brand.to_domain_entity()
            
            log_entity_created("Brand", str(created_brand.id))
            log_operation_success("create", "Brand", str(created_brand.id))
            
            return created_brand
            
        except Exception as e:
            log_operation_error("create", "Brand", error=str(e))
            self.db.rollback()
            raise

    def update(self, brand_id: UUID, brand: Brand) -> Brand:
        """Actualizar una marca existente"""
        log_operation_start("update", "Brand", str(brand_id))
        
        if not self.db:
            log_operation_error("update", "Brand", str(brand_id), error="Database session not provided")
            raise ValueError("Database session not provided")
        
        try:
            # Obtener marca existente
            db_brand = self.db.query(BrandModel).filter(
                BrandModel.id == brand_id,
                BrandModel.deleted_at.is_(None)
            ).first()
            
            if not db_brand:
                log_entity_not_found("Brand", str(brand_id))
                log_operation_error("update", "Brand", str(brand_id), error="Brand not found")
                raise ValueError(f"Brand with id {brand_id} not found")
            
            # Actualizar solo los campos proporcionados
            if brand.name is not None:
                db_brand.name = brand.name
            if brand.owner is not None:
                db_brand.owner = brand.owner
            if brand.lang is not None:
                db_brand.lang = brand.lang
            if brand.status is not None:
                db_brand.status = brand.status
            
            # Actualizar timestamp
            db_brand.updated_at = datetime.utcnow()
            
            self.db.commit()
            self.db.refresh(db_brand)
            
            updated_brand = db_brand.to_domain_entity()
            
            log_entity_updated("Brand", str(brand_id))
            log_operation_success("update", "Brand", str(brand_id))
            
            return updated_brand
            
        except Exception as e:
            log_operation_error("update", "Brand", str(brand_id), error=str(e))
            self.db.rollback()
            raise

    def delete(self, brand_id: UUID) -> None:
        """Eliminar una marca (soft delete)"""
        log_operation_start("delete", "Brand", str(brand_id))
        
        if not self.db:
            log_operation_error("delete", "Brand", str(brand_id), error="Database session not provided")
            raise ValueError("Database session not provided")
        
        try:
            # Obtener marca existente
            db_brand = self.db.query(BrandModel).filter(
                BrandModel.id == brand_id,
                BrandModel.deleted_at.is_(None)
            ).first()
            
            if not db_brand:
                log_entity_not_found("Brand", str(brand_id))
                log_operation_error("delete", "Brand", str(brand_id), error="Brand not found")
                raise ValueError(f"Brand with id {brand_id} not found")
            
            # Soft delete - marcar como eliminada
            db_brand.deleted_at = datetime.utcnow()
            db_brand.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            log_entity_deleted("Brand", str(brand_id))
            log_operation_success("delete", "Brand", str(brand_id))
            
        except Exception as e:
            log_operation_error("delete", "Brand", str(brand_id), error=str(e))
            self.db.rollback()
            raise

    def hard_delete(self, brand_id: UUID) -> None:
        """Eliminación física de una marca (solo para casos especiales)"""
        log_operation_start("hard_delete", "Brand", str(brand_id))
        
        if not self.db:
            log_operation_error("hard_delete", "Brand", str(brand_id), error="Database session not provided")
            raise ValueError("Database session not provided")
        
        try:
            db_brand = self.db.query(BrandModel).filter(BrandModel.id == brand_id).first()
            
            if not db_brand:
                log_entity_not_found("Brand", str(brand_id))
                log_operation_error("hard_delete", "Brand", str(brand_id), error="Brand not found")
                raise ValueError(f"Brand with id {brand_id} not found")
            
            # Eliminación física
            self.db.delete(db_brand)
            self.db.commit()
            
            log_operation_success("hard_delete", "Brand", str(brand_id))
            
        except Exception as e:
            log_operation_error("hard_delete", "Brand", str(brand_id), error=str(e))
            self.db.rollback()
            raise
