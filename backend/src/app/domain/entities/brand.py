from dataclasses import dataclass
from typing import Optional
from datetime import datetime
from uuid import UUID

@dataclass(frozen=False)  # Cambiado a False para permitir actualizaciones
class Brand:
    id: Optional[UUID]
    name: str
    owner: str
    lang: str
    status: str = "Pendiente"
    
    # Campos de auditoría y trazabilidad
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
    
    def __post_init__(self):
        """Inicializar campos de auditoría si no están establecidos"""
        if self.created_at is None:
            object.__setattr__(self, 'created_at', datetime.utcnow())
        if self.updated_at is None:
            object.__setattr__(self, 'updated_at', datetime.utcnow())
    
    def mark_as_updated(self):
        """Marcar la entidad como actualizada"""
        object.__setattr__(self, 'updated_at', datetime.utcnow())
    
    def mark_as_deleted(self):
        """Marcar la entidad como eliminada (soft delete)"""
        object.__setattr__(self, 'deleted_at', datetime.utcnow())
    
    def is_deleted(self) -> bool:
        """Verificar si la entidad está marcada como eliminada"""
        return self.deleted_at is not None
    
    def is_active(self) -> bool:
        """Verificar si la entidad está activa"""
        return not self.is_deleted()
