from pydantic import BaseModel, ConfigDict
from typing import Optional

class BrandCreateDTO(BaseModel):
    name: str
    country: str

class BrandUpdateDTO(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    status: Optional[str] = None

class BrandReadDTO(BaseModel):
    id: int
    name: str
    country: str
    status: str

    model_config = ConfigDict(from_attributes=True)
