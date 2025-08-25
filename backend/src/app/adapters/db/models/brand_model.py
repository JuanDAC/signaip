from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.adapters.db.session import Base
import uuid

class BrandModel(Base):
    __tablename__ = "brands"

    # Identificador único usando UUID
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Campos de negocio
    name = Column(String(255), nullable=False, index=True)
    owner = Column(String(255), nullable=False, index=True)
    lang = Column(String(10), nullable=False, index=True)  # ISO 639-1 language codes
    status = Column(String(50), default="Pendiente", index=True)
    
    # Campos de auditoría y trazabilidad
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True, index=True)
    
    def __repr__(self):
        return f"<BrandModel(id={self.id}, name='{self.name}', owner='{self.owner}', lang='{self.lang}')>"
    
    def to_domain_entity(self):
        """Convertir el modelo SQLAlchemy a entidad de dominio"""
        from app.domain.entities.brand import Brand
        return Brand(
            id=self.id,
            name=self.name,
            owner=self.owner,
            lang=self.lang,
            status=self.status,
            created_at=self.created_at,
            updated_at=self.updated_at,
            deleted_at=self.deleted_at
        )
    
    @classmethod
    def from_domain_entity(cls, brand):
        """Crear modelo SQLAlchemy desde entidad de dominio"""
        return cls(
            id=brand.id,
            name=brand.name,
            owner=brand.owner,
            lang=brand.lang,
            status=brand.status,
            created_at=brand.created_at,
            updated_at=brand.updated_at,
            deleted_at=brand.deleted_at
        )
