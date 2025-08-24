import pytest
from sqlalchemy.orm import Session
from app.adapters.db.repositories.brand_repository import BrandRepository
from app.domain.entities.brand import Brand
from app.adapters.db.models.brand_model import BrandModel
from ...factories.brand_factory import BrandFactory

class TestBrandRepository:
    """Tests unitarios para BrandRepository"""
    
    def test_get_all_brands_empty(self, brand_repository):
        """Test: obtener todas las marcas cuando no hay ninguna"""
        # Arrange
        repo = brand_repository
        
        # Act
        result = repo.get_all()
        
        # Assert
        assert result == []
    
    def test_get_all_brands_with_data(self, brand_repository, db_session):
        """Test: obtener todas las marcas cuando hay datos"""
        # Arrange
        repo = brand_repository
        brand_models = BrandFactory.create_brand_models_list(3)
        
        # Insertar marcas en la base de datos
        for brand_model in brand_models:
            db_session.add(brand_model)
        db_session.commit()
        
        # Act
        result = repo.get_all()
        
        # Assert
        assert len(result) == 3
        assert all(isinstance(brand, Brand) for brand in result)
        assert result[0].name == "Brand 1"
        assert result[1].name == "Brand 2"
        assert result[2].name == "Brand 3"
    
    def test_get_brand_by_id_success(self, brand_repository, db_session):
        """Test: obtener marca por ID exitosamente"""
        # Arrange
        repo = brand_repository
        brand_model = BrandFactory.create_brand_model(id=1, name="Nike", country="USA")
        db_session.add(brand_model)
        db_session.commit()
        
        # Act
        result = repo.get_by_id(1)
        
        # Assert
        assert result is not None
        assert result.id == 1
        assert result.name == "Nike"
        assert result.country == "USA"
        assert result.status == "Pendiente"
    
    def test_get_brand_by_id_not_found(self, brand_repository):
        """Test: obtener marca por ID cuando no existe"""
        # Arrange
        repo = brand_repository
        
        # Act
        result = repo.get_by_id(999)
        
        # Assert
        assert result is None
    
    def test_create_brand_success(self, brand_repository, db_session):
        """Test: crear marca exitosamente"""
        # Arrange
        repo = brand_repository
        brand = BrandFactory.create_brand(name="Adidas", country="Germany")
        
        # Act
        result = repo.create(brand)
        
        # Assert
        assert result.id is not None
        assert result.name == "Adidas"
        assert result.country == "Germany"
        assert result.status == "Pendiente"
        
        # Verificar que se guardó en la base de datos
        db_brand = db_session.query(BrandModel).filter(BrandModel.id == result.id).first()
        assert db_brand is not None
        assert db_brand.name == "Adidas"
    
    def test_update_brand_success(self, brand_repository, db_session):
        """Test: actualizar marca exitosamente"""
        # Arrange
        repo = brand_repository
        brand_model = BrandFactory.create_brand_model(id=1, name="Original", country="Original")
        db_session.add(brand_model)
        db_session.commit()
        
        updated_brand = BrandFactory.create_brand(
            id=1,
            name="Updated",
            country="Updated",
            status="Aprobada"
        )
        
        # Act
        result = repo.update(1, updated_brand)
        
        # Assert
        assert result.name == "Updated"
        assert result.country == "Updated"
        assert result.status == "Aprobada"
        
        # Verificar que se actualizó en la base de datos
        db_brand = db_session.query(BrandModel).filter(BrandModel.id == 1).first()
        assert db_brand.name == "Updated"
        assert db_brand.country == "Updated"
        assert db_brand.status == "Aprobada"
    
    def test_update_brand_partial_update(self, brand_repository, db_session):
        """Test: actualizar solo algunos campos de la marca"""
        # Arrange
        repo = brand_repository
        brand_model = BrandFactory.create_brand_model(id=1, name="Original", country="Original")
        db_session.add(brand_model)
        db_session.commit()
        
        # Solo actualizar el nombre
        updated_brand = BrandFactory.create_brand(
            id=1,
            name="Only Name Updated",
            country=None,
            status=None
        )
        
        # Act
        result = repo.update(1, updated_brand)
        
        # Assert
        assert result.name == "Only Name Updated"
        assert result.country == "Original"  # No se actualizó
        assert result.status == "Pendiente"  # No se actualizó
        
        # Verificar en la base de datos
        db_brand = db_session.query(BrandModel).filter(BrandModel.id == 1).first()
        assert db_brand.name == "Only Name Updated"
        assert db_brand.country == "Original"
        assert db_brand.status == "Pendiente"
    
    def test_update_brand_not_found(self, brand_repository):
        """Test: actualizar marca que no existe"""
        # Arrange
        repo = brand_repository
        updated_brand = BrandFactory.create_brand(id=999, name="Updated")
        
        # Act & Assert
        with pytest.raises(ValueError, match="Brand with id 999 not found"):
            repo.update(999, updated_brand)
    
    def test_delete_brand_success(self, brand_repository, db_session):
        """Test: eliminar marca exitosamente"""
        # Arrange
        repo = brand_repository
        brand_model = BrandFactory.create_brand_model(id=1, name="To Delete")
        db_session.add(brand_model)
        db_session.commit()
        
        # Verificar que existe
        assert db_session.query(BrandModel).filter(BrandModel.id == 1).first() is not None
        
        # Act
        repo.delete(1)
        
        # Assert
        # Verificar que se eliminó de la base de datos
        deleted_brand = db_session.query(BrandModel).filter(BrandModel.id == 1).first()
        assert deleted_brand is None
    
    def test_delete_brand_not_found(self, brand_repository):
        """Test: eliminar marca que no existe"""
        # Arrange
        repo = brand_repository
        
        # Act & Assert
        with pytest.raises(ValueError, match="Brand with id 999 not found"):
            repo.delete(999)
    
    def test_repository_implements_port_interface(self, brand_repository):
        """Test: verificar que el repositorio implementa correctamente la interfaz"""
        # Arrange
        repo = brand_repository
        
        # Assert
        # Verificar que implementa todos los métodos requeridos
        assert hasattr(repo, 'get_all')
        assert hasattr(repo, 'get_by_id')
        assert hasattr(repo, 'create')
        assert hasattr(repo, 'update')
        assert hasattr(repo, 'delete')
        
        # Verificar que los métodos son callable
        assert callable(repo.get_all)
        assert callable(repo.get_by_id)
        assert callable(repo.create)
        assert callable(repo.update)
        assert callable(repo.delete)
