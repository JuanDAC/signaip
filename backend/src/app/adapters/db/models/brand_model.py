from sqlalchemy import Column, Integer, String
from app.adapters.db.session import Base

class BrandModel(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    country = Column(String, nullable=False)
    status = Column(String, default="Pendiente")
