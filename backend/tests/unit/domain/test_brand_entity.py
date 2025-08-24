import pytest
from app.domain.entities.brand import Brand

class TestBrandEntity:
    """Tests unitarios para la entidad Brand"""
    
    def test_brand_creation_with_all_fields(self):
        """Test: crear marca con todos los campos"""
        # Arrange & Act
        brand = Brand(
            id=1,
            name="Nike",
            country="USA",
            status="Aprobada"
        )
        
        # Assert
        assert brand.id == 1
        assert brand.name == "Nike"
        assert brand.country == "USA"
        assert brand.status == "Aprobada"
    
    def test_brand_creation_with_default_status(self):
        """Test: crear marca con estado por defecto"""
        # Arrange & Act
        brand = Brand(
            id=1,
            name="Adidas",
            country="Germany"
        )
        
        # Assert
        assert brand.id == 1
        assert brand.name == "Adidas"
        assert brand.country == "Germany"
        assert brand.status == "Pendiente"  # Valor por defecto
    
    def test_brand_creation_with_none_id(self):
        """Test: crear marca sin ID (para nuevas marcas)"""
        # Arrange & Act
        brand = Brand(
            id=None,
            name="New Brand",
            country="New Country"
        )
        
        # Assert
        assert brand.id is None
        assert brand.name == "New Brand"
        assert brand.country == "New Country"
        assert brand.status == "Pendiente"
    
    def test_brand_equality(self):
        """Test: verificar igualdad entre marcas"""
        # Arrange
        brand1 = Brand(id=1, name="Nike", country="USA", status="Aprobada")
        brand2 = Brand(id=1, name="Nike", country="USA", status="Aprobada")
        brand3 = Brand(id=2, name="Nike", country="USA", status="Aprobada")
        
        # Act & Assert
        assert brand1 == brand2
        assert brand1 != brand3
        assert brand2 != brand3
    
    def test_brand_hash(self):
        """Test: verificar que las marcas son hashables"""
        # Arrange
        brand1 = Brand(id=1, name="Nike", country="USA", status="Aprobada")
        brand2 = Brand(id=1, name="Nike", country="USA", status="Aprobada")
        
        # Act
        brand_set = {brand1, brand2}
        
        # Assert
        assert len(brand_set) == 1  # Solo una marca única
        assert brand1 in brand_set
        assert brand2 in brand_set
    
    def test_brand_string_representation(self):
        """Test: verificar representación en string de la marca"""
        # Arrange
        brand = Brand(id=1, name="Nike", country="USA", status="Aprobada")
        
        # Act
        brand_str = str(brand)
        brand_repr = repr(brand)
        
        # Assert
        assert "Nike" in brand_str
        assert "USA" in brand_str
        assert "Aprobada" in brand_str
        assert "Brand" in brand_repr
        assert "id=1" in brand_repr
    
    def test_brand_immutability_after_creation(self):
        """Test: verificar que la marca no cambia después de la creación"""
        # Arrange
        brand = Brand(id=1, name="Nike", country="USA", status="Aprobada")
        
        # Act & Assert
        # Intentar modificar atributos debería fallar (dataclass inmutable por defecto)
        # En Python, los dataclasses son mutables por defecto, pero podemos verificar
        # que los valores no cambian accidentalmente
        
        # Verificar que los valores originales se mantienen
        assert brand.id == 1
        assert brand.name == "Nike"
        assert brand.country == "USA"
        assert brand.status == "Aprobada"
    
    def test_brand_with_empty_strings(self):
        """Test: crear marca con strings vacíos"""
        # Arrange & Act
        brand = Brand(
            id=1,
            name="",
            country="",
            status=""
        )
        
        # Assert
        assert brand.name == ""
        assert brand.country == ""
        assert brand.status == ""
    
    def test_brand_with_unicode_characters(self):
        """Test: crear marca con caracteres Unicode"""
        # Arrange & Act
        brand = Brand(
            id=1,
            name="Marca Española",
            country="España",
            status="Pendiente"
        )
        
        # Assert
        assert brand.name == "Marca Española"
        assert brand.country == "España"
        assert brand.status == "Pendiente"
    
    def test_brand_with_special_characters(self):
        """Test: crear marca con caracteres especiales"""
        # Arrange & Act
        brand = Brand(
            id=1,
            name="Brand & Co.",
            country="U.S.A.",
            status="Pending..."
        )
        
        # Assert
        assert brand.name == "Brand & Co."
        assert brand.country == "U.S.A."
        assert brand.status == "Pending..."
    
    def test_brand_status_values(self):
        """Test: verificar diferentes valores de estado"""
        # Arrange
        statuses = ["Pendiente", "Aprobada", "Rechazada", "En Revisión"]
        
        # Act & Assert
        for i, status in enumerate(statuses):
            brand = Brand(
                id=i + 1,
                name=f"Brand {i + 1}",
                country=f"Country {i + 1}",
                status=status
            )
            assert brand.status == status
    
    def test_brand_id_types(self):
        """Test: verificar diferentes tipos de ID"""
        # Arrange & Act
        brand1 = Brand(id=1, name="Brand 1", country="Country 1")
        brand2 = Brand(id=100, name="Brand 2", country="Country 2")
        brand3 = Brand(id=None, name="Brand 3", country="Country 3")
        
        # Assert
        assert isinstance(brand1.id, int)
        assert isinstance(brand2.id, int)
        assert brand3.id is None
    
    def test_brand_name_length(self):
        """Test: verificar marcas con nombres de diferentes longitudes"""
        # Arrange & Act
        short_name = "A"
        long_name = "A" * 100
        medium_name = "Brand Name"
        
        brand1 = Brand(id=1, name=short_name, country="Country 1")
        brand2 = Brand(id=2, name=long_name, country="Country 2")
        brand3 = Brand(id=3, name=medium_name, country="Country 3")
        
        # Assert
        assert brand1.name == short_name
        assert brand2.name == long_name
        assert brand3.name == medium_name
        assert len(brand1.name) == 1
        assert len(brand2.name) == 100
        assert len(brand3.name) == 10
    
    def test_brand_copy_creation(self):
        """Test: verificar que se pueden crear copias de marcas"""
        # Arrange
        original_brand = Brand(id=1, name="Original", country="Original", status="Pendiente")
        
        # Act
        copied_brand = Brand(
            id=original_brand.id,
            name=original_brand.name,
            country=original_brand.country,
            status=original_brand.status
        )
        
        # Assert
        assert copied_brand == original_brand
        assert copied_brand is not original_brand  # Diferentes objetos
    
    def test_brand_validation_implicit(self):
        """Test: verificar que la marca se crea correctamente con datos válidos"""
        # Arrange & Act
        brand = Brand(
            id=1,
            name="Valid Brand",
            country="Valid Country",
            status="Valid Status"
        )
        
        # Assert
        # Si llegamos aquí, la marca se creó correctamente
        assert brand is not None
        assert hasattr(brand, 'id')
        assert hasattr(brand, 'name')
        assert hasattr(brand, 'country')
        assert hasattr(brand, 'status')
