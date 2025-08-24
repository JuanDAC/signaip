import pytest
from app.adapters.auth.auth_adapter import SimpleAuthAdapter

class TestSimpleAuthAdapter:
    """Tests unitarios para SimpleAuthAdapter"""
    
    def test_validate_api_key_success(self):
        """Test: validar API key válida"""
        # Arrange
        valid_key = "super-secret-key-123"
        adapter = SimpleAuthAdapter(valid_key=valid_key)
        
        # Act
        result = adapter.validate_api_key(valid_key)
        
        # Assert
        assert result is True
    
    def test_validate_api_key_invalid(self):
        """Test: validar API key inválida"""
        # Arrange
        valid_key = "super-secret-key-123"
        invalid_key = "wrong-key"
        adapter = SimpleAuthAdapter(valid_key=valid_key)
        
        # Act
        result = adapter.validate_api_key(invalid_key)
        
        # Assert
        assert result is False
    
    def test_validate_api_key_empty(self):
        """Test: validar API key vacía"""
        # Arrange
        valid_key = "super-secret-key-123"
        empty_key = ""
        adapter = SimpleAuthAdapter(valid_key=valid_key)
        
        # Act
        result = adapter.validate_api_key(empty_key)
        
        # Assert
        assert result is False
    
    def test_validate_api_key_none(self):
        """Test: validar API key None"""
        # Arrange
        valid_key = "super-secret-key-123"
        none_key = None
        adapter = SimpleAuthAdapter(valid_key=valid_key)
        
        # Act
        result = adapter.validate_api_key(none_key)
        
        # Assert
        assert result is False
    
    def test_validate_api_key_case_sensitive(self):
        """Test: verificar que la validación es sensible a mayúsculas/minúsculas"""
        # Arrange
        valid_key = "Super-Secret-Key-123"
        case_variation = "super-secret-key-123"
        adapter = SimpleAuthAdapter(valid_key=valid_key)
        
        # Act
        result = adapter.validate_api_key(case_variation)
        
        # Assert
        assert result is False
    
    def test_validate_api_key_whitespace(self):
        """Test: validar API key con espacios en blanco"""
        # Arrange
        valid_key = "super-secret-key-123"
        key_with_whitespace = " super-secret-key-123 "
        adapter = SimpleAuthAdapter(valid_key=valid_key)
        
        # Act
        result = adapter.validate_api_key(key_with_whitespace)
        
        # Assert
        assert result is False
    
    def test_validate_api_key_special_characters(self):
        """Test: validar API key con caracteres especiales"""
        # Arrange
        valid_key = "super-secret-key-123"
        special_key = "super-secret-key-123!"
        adapter = SimpleAuthAdapter(valid_key=valid_key)
        
        # Act
        result = adapter.validate_api_key(special_key)
        
        # Assert
        assert result is False
    
    def test_validate_api_key_very_long(self):
        """Test: validar API key muy larga"""
        # Arrange
        valid_key = "super-secret-key-123"
        long_key = "a" * 1000
        adapter = SimpleAuthAdapter(valid_key=valid_key)
        
        # Act
        result = adapter.validate_api_key(long_key)
        
        # Assert
        assert result is False
    
    def test_validate_api_key_unicode(self):
        """Test: validar API key con caracteres Unicode"""
        # Arrange
        valid_key = "super-secret-key-123"
        unicode_key = "super-secret-key-123ñáéíóú"
        adapter = SimpleAuthAdapter(valid_key=valid_key)
        
        # Act
        result = adapter.validate_api_key(unicode_key)
        
        # Assert
        assert result is False
    
    def test_validate_api_key_numbers_only(self):
        """Test: validar API key que solo contiene números"""
        # Arrange
        valid_key = "123456789"
        adapter = SimpleAuthAdapter(valid_key=valid_key)
        
        # Act
        result = adapter.validate_api_key(valid_key)
        
        # Assert
        assert result is True
    
    def test_validate_api_key_same_key_different_instances(self):
        """Test: verificar que diferentes instancias con la misma key funcionan igual"""
        # Arrange
        valid_key = "same-key-123"
        adapter1 = SimpleAuthAdapter(valid_key=valid_key)
        adapter2 = SimpleAuthAdapter(valid_key=valid_key)
        
        # Act
        result1 = adapter1.validate_api_key(valid_key)
        result2 = adapter2.validate_api_key(valid_key)
        
        # Assert
        assert result1 is True
        assert result2 is True
        assert result1 == result2
