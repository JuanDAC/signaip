import pytest
from unittest.mock import Mock, MagicMock
from app.domain.use_cases.brand_use_case import BrandUseCase
from app.domain.ports.brand_port import BrandPort
from app.domain.entities.brand import Brand
from app.schemas.brand_dto import BrandCreateDTO, BrandUpdateDTO
from ...factories.brand_factory import BrandFactory

class TestBrandUseCase:
    """Tests unitarios para BrandUseCase"""
    
    def setup_method(self):
        """Setup para cada test"""
        self.mock_repo = Mock(spec=BrandPort)
        self.use_case = BrandUseCase(repo=self.mock_repo)
    
    def test_list_brands_success(self):
        """Test: listar marcas exitosamente"""
        # Arrange
        expected_brands = BrandFactory.create_brands_list(2)
        self.mock_repo.get_all.return_value = expected_brands
        
        # Act
        result = self.use_case.list_brands()
        
        # Assert
        assert result == expected_brands
        self.mock_repo.get_all.assert_called_once()
    
    def test_get_brand_by_id_success(self):
        """Test: obtener marca por ID exitosamente"""
        # Arrange
        brand_id = 1
        expected_brand = BrandFactory.create_brand(id=brand_id)
        self.mock_repo.get_by_id.return_value = expected_brand
        
        # Act
        result = self.use_case.get_brand(brand_id)
        
        # Assert
        assert result == expected_brand
        self.mock_repo.get_by_id.assert_called_once_with(brand_id)
    
    def test_get_brand_by_id_not_found(self):
        """Test: obtener marca por ID cuando no existe"""
        # Arrange
        brand_id = 999
        self.mock_repo.get_by_id.return_value = None
        
        # Act
        result = self.use_case.get_brand(brand_id)
        
        # Assert
        assert result is None
        self.mock_repo.get_by_id.assert_called_once_with(brand_id)
    
    def test_create_brand_success(self):
        """Test: crear marca exitosamente"""
        # Arrange
        dto = BrandFactory.create_brand_create_dto()
        expected_brand = BrandFactory.create_brand(id=1, name=dto.name, country=dto.country)
        self.mock_repo.create.return_value = expected_brand
        
        # Act
        result = self.use_case.create_brand(dto)
        
        # Assert
        assert result == expected_brand
        self.mock_repo.create.assert_called_once()
        # Verificar que se creó la entidad Brand correctamente
        call_args = self.mock_repo.create.call_args[0][0]
        assert call_args.name == dto.name
        assert call_args.country == dto.country
        assert call_args.status == "Pendiente"
    
    def test_update_brand_success(self):
        """Test: actualizar marca exitosamente"""
        # Arrange
        brand_id = 1
        dto = BrandFactory.create_brand_update_dto()
        existing_brand = BrandFactory.create_brand(id=brand_id)
        updated_brand = BrandFactory.create_brand(
            id=brand_id,
            name=dto.name,
            country=dto.country,
            status=dto.status
        )
        
        self.mock_repo.get_by_id.return_value = existing_brand
        self.mock_repo.update.return_value = updated_brand
        
        # Act
        result = self.use_case.update_brand(brand_id, dto)
        
        # Assert
        assert result == updated_brand
        self.mock_repo.get_by_id.assert_called_once_with(brand_id)
        self.mock_repo.update.assert_called_once()
    
    def test_update_brand_partial_update(self):
        """Test: actualizar marca con campos parciales"""
        # Arrange
        brand_id = 1
        dto = BrandUpdateDTO(name="Updated Name")  # Solo actualizar nombre
        existing_brand = BrandFactory.create_brand(id=brand_id)
        updated_brand = BrandFactory.create_brand(
            id=brand_id,
            name=dto.name,
            country=existing_brand.country,  # Mantener país original
            status=existing_brand.status     # Mantener estado original
        )
        
        self.mock_repo.get_by_id.return_value = existing_brand
        self.mock_repo.update.return_value = updated_brand
        
        # Act
        result = self.use_case.update_brand(brand_id, dto)
        
        # Assert
        assert result == updated_brand
        # Verificar que se actualizó solo el nombre
        call_args = self.mock_repo.update.call_args[0][1]
        assert call_args.name == dto.name
        assert call_args.country == existing_brand.country
        assert call_args.status == existing_brand.status
    
    def test_update_brand_not_found(self):
        """Test: actualizar marca que no existe"""
        # Arrange
        brand_id = 999
        dto = BrandFactory.create_brand_update_dto()
        self.mock_repo.get_by_id.return_value = None
        
        # Act & Assert
        with pytest.raises(ValueError, match=f"Brand with id {brand_id} not found"):
            self.use_case.update_brand(brand_id, dto)
        
        self.mock_repo.get_by_id.assert_called_once_with(brand_id)
        self.mock_repo.update.assert_not_called()
    
    def test_delete_brand_success(self):
        """Test: eliminar marca exitosamente"""
        # Arrange
        brand_id = 1
        
        # Act
        self.use_case.delete_brand(brand_id)
        
        # Assert
        self.mock_repo.delete.assert_called_once_with(brand_id)
    
    def test_delete_brand_not_found(self):
        """Test: eliminar marca que no existe"""
        # Arrange
        brand_id = 999
        self.mock_repo.delete.side_effect = ValueError(f"Brand with id {brand_id} not found")
        
        # Act & Assert
        with pytest.raises(ValueError, match=f"Brand with id {brand_id} not found"):
            self.use_case.delete_brand(brand_id)
        
        self.mock_repo.delete.assert_called_once_with(brand_id)
