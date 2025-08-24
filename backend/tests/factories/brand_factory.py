from typing import List, Optional
from app.domain.entities.brand import Brand
from app.schemas.brand_dto import BrandCreateDTO, BrandUpdateDTO
from app.adapters.db.models.brand_model import BrandModel

class BrandFactory:
    """Factory para crear entidades y DTOs de marca para testing"""
    
    @staticmethod
    def create_brand(
        id: Optional[int] = None,
        name: str = "Test Brand",
        country: str = "Test Country",
        status: str = "Pendiente"
    ) -> Brand:
        """Crear una entidad Brand para testing"""
        return Brand(
            id=id,
            name=name,
            country=country,
            status=status
        )
    
    @staticmethod
    def create_brand_create_dto(
        name: str = "Test Brand",
        country: str = "Test Country"
    ) -> BrandCreateDTO:
        """Crear un DTO de creación de marca para testing"""
        return BrandCreateDTO(
            name=name,
            country=country
        )
    
    @staticmethod
    def create_brand_update_dto(
        name: Optional[str] = "Updated Brand",
        country: Optional[str] = "Updated Country",
        status: Optional[str] = "Aprobada"
    ) -> BrandUpdateDTO:
        """Crear un DTO de actualización de marca para testing"""
        return BrandUpdateDTO(
            name=name,
            country=country,
            status=status
        )
    
    @staticmethod
    def create_brand_model(
        id: Optional[int] = None,
        name: str = "Test Brand",
        country: str = "Test Country",
        status: str = "Pendiente"
    ) -> BrandModel:
        """Crear un modelo SQLAlchemy de marca para testing"""
        return BrandModel(
            id=id,
            name=name,
            country=country,
            status=status
        )
    
    @staticmethod
    def create_brands_list(count: int = 3) -> List[Brand]:
        """Crear una lista de marcas para testing"""
        brands = []
        for i in range(count):
            brand = BrandFactory.create_brand(
                id=i + 1,
                name=f"Brand {i + 1}",
                country=f"Country {i + 1}",
                status="Pendiente" if i % 2 == 0 else "Aprobada"
            )
            brands.append(brand)
        return brands
    
    @staticmethod
    def create_brand_models_list(count: int = 3) -> List[BrandModel]:
        """Crear una lista de modelos SQLAlchemy de marcas para testing"""
        models = []
        for i in range(count):
            model = BrandFactory.create_brand_model(
                id=i + 1,
                name=f"Brand {i + 1}",
                country=f"Country {i + 1}",
                status="Pendiente" if i % 2 == 0 else "Aprobada"
            )
            models.append(model)
        return models
