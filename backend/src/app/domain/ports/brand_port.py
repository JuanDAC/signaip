from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.entities.brand import Brand

class BrandPort(ABC):
    @abstractmethod
    def get_all(self) -> List[Brand]:
        pass

    @abstractmethod
    def get_by_id(self, brand_id: int) -> Optional[Brand]:
        pass

    @abstractmethod
    def create(self, brand: Brand) -> Brand:
        pass

    @abstractmethod
    def update(self, brand_id: int, brand: Brand) -> Brand:
        pass

    @abstractmethod
    def delete(self, brand_id: int) -> None:
        pass
