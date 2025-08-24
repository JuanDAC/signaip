from injector import inject
from typing import List, Optional
from app.domain.ports.brand_port import BrandPort
from app.domain.entities.brand import Brand
from app.schemas.brand_dto import BrandCreateDTO, BrandUpdateDTO

class BrandService:
    @inject
    def __init__(self, repo: BrandPort):
        self.repo = repo

    def list_brands(self) -> List[Brand]:
        return self.repo.get_all()

    def get_brand(self, brand_id: int) -> Optional[Brand]:
        return self.repo.get_by_id(brand_id)

    def create_brand(self, dto: BrandCreateDTO) -> Brand:
        brand = Brand(id=None, name=dto.name, country=dto.country)
        return self.repo.create(brand)

    def update_brand(self, brand_id: int, dto: BrandUpdateDTO) -> Brand:
        # Primero obtenemos la marca existente
        existing_brand = self.repo.get_by_id(brand_id)
        if not existing_brand:
            raise ValueError(f"Brand with id {brand_id} not found")
        
        # Actualizamos solo los campos que vienen en el DTO
        updated_brand = Brand(
            id=brand_id,
            name=dto.name if dto.name is not None else existing_brand.name,
            country=dto.country if dto.country is not None else existing_brand.country,
            status=dto.status if dto.status is not None else existing_brand.status
        )
        
        return self.repo.update(brand_id, updated_brand)

    def delete_brand(self, brand_id: int) -> None:
        self.repo.delete(brand_id)
