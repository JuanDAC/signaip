from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime

class BrandCreateDTO(BaseModel):
    """DTO para crear una nueva marca - solo campos requeridos"""
    name: str = Field(..., min_length=1, max_length=255, description="Nombre de la marca")
    owner: str = Field(..., min_length=1, max_length=255, description="Propietario de la marca")
    lang: str = Field(..., min_length=2, max_length=10, description="Código de idioma ISO 639-1")
    status: Optional[str] = Field("Pendiente", max_length=50, description="Estado de la marca")

class BrandUpdateDTO(BaseModel):
    """DTO para actualizar una marca - todos los campos son opcionales"""
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Nombre de la marca")
    owner: Optional[str] = Field(None, min_length=1, max_length=255, description="Propietario de la marca")
    lang: Optional[str] = Field(None, min_length=2, max_length=10, description="Código de idioma ISO 639-1")
    status: Optional[str] = Field(None, max_length=50, description="Estado de la marca")

class BrandReadDTO(BaseModel):
    """DTO para leer una marca - solo campos públicos"""
    id: UUID
    name: str
    owner: str
    lang: str
    status: str
    
    # Configuración para conversión desde ORM
    model_config = ConfigDict(from_attributes=True)

class BrandInternalDTO(BaseModel):
    """DTO interno para operaciones del sistema - incluye campos de auditoría"""
    id: UUID
    name: str
    owner: str
    lang: str
    status: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
