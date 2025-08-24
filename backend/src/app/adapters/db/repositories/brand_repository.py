from typing import List, Optional
from sqlalchemy.orm import Session
from app.domain.ports.brand_port import BrandPort
from app.domain.entities.brand import Brand
from app.adapters.db.models.brand_model import BrandModel

class BrandRepository(BrandPort):
    def __init__(self, db: Session = None):
        self.db = db

    def get_all(self) -> List[Brand]:
        if not self.db:
            raise ValueError("Database session not provided")
        brands = self.db.query(BrandModel).all()
        return [Brand(id=b.id, name=b.name, country=b.country, status=b.status) for b in brands]

    def get_by_id(self, brand_id: int) -> Optional[Brand]:
        if not self.db:
            raise ValueError("Database session not provided")
        brand = self.db.query(BrandModel).filter(BrandModel.id == brand_id).first()
        if brand:
            return Brand(id=brand.id, name=brand.name, country=brand.country, status=brand.status)
        return None

    def create(self, brand: Brand) -> Brand:
        if not self.db:
            raise ValueError("Database session not provided")
        db_brand = BrandModel(name=brand.name, country=brand.country, status=brand.status)
        self.db.add(db_brand)
        self.db.commit()
        self.db.refresh(db_brand)
        return Brand(id=db_brand.id, name=db_brand.name, country=db_brand.country, status=db_brand.status)

    def update(self, brand_id: int, brand: Brand) -> Brand:
        if not self.db:
            raise ValueError("Database session not provided")
        db_brand = self.db.query(BrandModel).filter(BrandModel.id == brand_id).first()
        if not db_brand:
            raise ValueError(f"Brand with id {brand_id} not found")
        
        if brand.name is not None:
            db_brand.name = brand.name
        if brand.country is not None:
            db_brand.country = brand.country
        if brand.status is not None:
            db_brand.status = brand.status
        
        self.db.commit()
        self.db.refresh(db_brand)
        return Brand(id=db_brand.id, name=db_brand.name, country=db_brand.country, status=db_brand.status)

    def delete(self, brand_id: int) -> None:
        if not self.db:
            raise ValueError("Database session not provided")
        db_brand = self.db.query(BrandModel).filter(BrandModel.id == brand_id).first()
        if not db_brand:
            raise ValueError(f"Brand with id {brand_id} not found")
        
        self.db.delete(db_brand)
        self.db.commit()
