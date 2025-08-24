import pytest
from app.domain.services.brand_service import BrandService
from app.adapters.db.repositories.brand_repository import BrandRepository
from app.schemas.brand_dto import BrandCreateDTO, BrandUpdateDTO
from ..factories.brand_factory import BrandFactory

class TestBrandCRUDIntegration:
    """Tests de integración para el flujo completo CRUD de marcas"""
    
    def test_crud_flow_complete(self, brand_repository):
        """Test: flujo completo de CRUD (Create, Read, Update, Delete)"""
        # Arrange
        repo = brand_repository
        service = BrandService(repo=repo)
        
        # 1. CREATE - Crear marca
        create_dto = BrandFactory.create_brand_create_dto(
            name="Puma",
            country="Germany"
        )
        
        # Act - Create
        created_brand = service.create_brand(create_dto)
        
        # Assert - Create
        assert created_brand.id is not None
        assert created_brand.name == "Puma"
        assert created_brand.country == "Germany"
        assert created_brand.status == "Pendiente"
        
        # 2. READ - Obtener marca por ID
        # Act - Read
        fetched_brand = service.get_brand(created_brand.id)
        
        # Assert - Read
        assert fetched_brand is not None
        assert fetched_brand.id == created_brand.id
        assert fetched_brand.name == "Puma"
        assert fetched_brand.country == "Germany"
        
        # 3. UPDATE - Actualizar marca
        update_dto = BrandFactory.create_brand_update_dto(
            name="Puma Updated",
            country=None,  # No actualizar el país
            status="Aprobada"
        )
        
        # Act - Update
        updated_brand = service.update_brand(created_brand.id, update_dto)
        
        # Assert - Update
        assert updated_brand.name == "Puma Updated"
        assert updated_brand.status == "Aprobada"
        assert updated_brand.country == "Germany"  # No se actualizó
        
        # 4. READ ALL - Listar todas las marcas
        # Act - Read All
        all_brands = service.list_brands()
        
        # Assert - Read All
        assert len(all_brands) == 1
        assert all_brands[0].id == created_brand.id
        assert all_brands[0].name == "Puma Updated"
        
        # 5. DELETE - Eliminar marca
        # Act - Delete
        service.delete_brand(created_brand.id)
        
        # Assert - Delete
        deleted_brand = service.get_brand(created_brand.id)
        assert deleted_brand is None
        
        # Verificar que no hay marcas
        all_brands_after_delete = service.list_brands()
        assert len(all_brands_after_delete) == 0
    
    def test_multiple_brands_management(self, brand_repository):
        """Test: gestión de múltiples marcas"""
        # Arrange
        repo = brand_repository
        service = BrandService(repo=repo)
        
        # Crear múltiples marcas
        brands_data = [
            {"name": "Nike", "country": "USA"},
            {"name": "Adidas", "country": "Germany"},
            {"name": "Puma", "country": "Germany"}
        ]
        
        created_brands = []
        
        # Act - Create multiple
        for brand_data in brands_data:
            dto = BrandFactory.create_brand_create_dto(**brand_data)
            brand = service.create_brand(dto)
            created_brands.append(brand)
        
        # Assert - Create multiple
        assert len(created_brands) == 3
        assert all(brand.id is not None for brand in created_brands)
        
        # Act - Read all
        all_brands = service.list_brands()
        
        # Assert - Read all
        assert len(all_brands) == 3
        for all_brand in all_brands:
            assert all_brand.name in [brand.name for brand in all_brands]
        
        # Act - Update multiple
        for i, brand in enumerate(created_brands):
            update_dto = BrandFactory.create_brand_update_dto(
                status="Aprobada" if i % 2 == 0 else "Rechazada"
            )
            updated_brand = service.update_brand(brand.id, update_dto)
            assert updated_brand.status in ["Aprobada", "Rechazada"]
        
        # Act - Delete multiple
        for brand in created_brands:
            service.delete_brand(brand.id)
        
        # Assert - Delete multiple
        all_brands_after_delete = service.list_brands()
        assert len(all_brands_after_delete) == 0
    
    def test_brand_status_workflow(self, brand_repository):
        """Test: flujo de trabajo de estados de marca"""
        # Arrange
        repo = brand_repository
        service = BrandService(repo=repo)
        
        # Crear marca
        create_dto = BrandFactory.create_brand_create_dto(
            name="Test Brand",
            country="Test Country"
        )
        brand = service.create_brand(create_dto)
        
        # Assert - Estado inicial
        assert brand.status == "Pendiente"
        
        # Act & Assert - Cambiar a Aprobada
        update_dto = BrandFactory.create_brand_update_dto(status="Aprobada")
        updated_brand = service.update_brand(brand.id, update_dto)
        assert updated_brand.status == "Aprobada"
        
        # Act & Assert - Cambiar a Rechazada
        update_dto = BrandFactory.create_brand_update_dto(status="Rechazada")
        updated_brand = service.update_brand(brand.id, update_dto)
        assert updated_brand.status == "Rechazada"
        
        # Act & Assert - Volver a Pendiente
        update_dto = BrandFactory.create_brand_update_dto(status="Pendiente")
        updated_brand = service.update_brand(brand.id, update_dto)
        assert updated_brand.status == "Pendiente"
    
    def test_error_handling_integration(self, brand_repository):
        """Test: manejo de errores en el flujo de integración"""
        # Arrange
        repo = brand_repository
        service = BrandService(repo=repo)
        
        # Test: Actualizar marca que no existe
        update_dto = BrandFactory.create_brand_update_dto(name="Updated")
        
        with pytest.raises(ValueError, match="Brand with id 999 not found"):
            service.update_brand(999, update_dto)
        
        # Test: Eliminar marca que no existe
        with pytest.raises(ValueError, match="Brand with id 999 not found"):
            service.delete_brand(999)
        
        # Test: Obtener marca que no existe
        result = service.get_brand(999)
        assert result is None
    
    def test_data_consistency_across_operations(self, brand_repository):
        """Test: consistencia de datos a través de operaciones"""
        # Arrange
        repo = brand_repository
        service = BrandService(repo=repo)
        
        # Crear marca
        create_dto = BrandFactory.create_brand_create_dto(
            name="Consistent Brand",
            country="Consistent Country"
        )
        brand = service.create_brand(create_dto)
        
        # Verificar consistencia después de crear
        fetched_brand = service.get_brand(brand.id)
        assert fetched_brand.name == brand.name
        assert fetched_brand.country == brand.country
        assert fetched_brand.status == brand.status
        
        # Actualizar marca
        update_dto = BrandFactory.create_brand_update_dto(
            name="Updated Consistent Brand",
            country="Updated Consistent Country"
        )
        updated_brand = service.update_brand(brand.id, update_dto)
        
        # Verificar consistencia después de actualizar
        fetched_updated_brand = service.get_brand(brand.id)
        assert fetched_updated_brand.name == updated_brand.name
        assert fetched_updated_brand.country == updated_brand.country
        assert fetched_updated_brand.status == updated_brand.status
        
        # Verificar que la lista también refleja los cambios
        all_brands = service.list_brands()
        assert len(all_brands) == 1
        assert all_brands[0].name == "Updated Consistent Brand"
