from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.entities.brand import Brand
from uuid import UUID

class BrandPort(ABC):
    @abstractmethod
    def get_all(self) -> List[Brand]:
        """Obtener todas las marcas activas"""
        pass

    @abstractmethod
    def get_by_id(self, brand_id: UUID) -> Optional[Brand]:
        """Obtener una marca por ID"""
        pass

    @abstractmethod
    def create(self, brand: Brand) -> Brand:
        """Crear una nueva marca"""
        pass

    @abstractmethod
    def update(self, brand_id: UUID, brand: Brand) -> Brand:
        """Actualizar una marca existente"""
        pass

    @abstractmethod
    def delete(self, brand_id: UUID) -> None:
        """Eliminar una marca (soft delete)"""
        pass

    @abstractmethod
    def hard_delete(self, brand_id: UUID) -> None:
        """Eliminación física de una marca (solo para casos especiales)"""
        pass
