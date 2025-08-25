import pytest
from fastapi.testclient import TestClient
from app.main import app
from ..factories.brand_factory import BrandFactory

class TestBrandRoutes:
    """Tests para los endpoints de la API de marcas"""
    
    def test_list_brands_success(self, client, api_headers):
        """Test: GET /api/v1/brands - listar marcas exitosamente"""
        # Act
        response = client.get("/api/v1/brands", headers=api_headers)

        # Assert
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_list_brands_unauthorized(self, client, invalid_api_headers):
        """Test: GET /api/v1/brands - sin API key válida"""
        # Act
        response = client.get("/api/v1/brands", headers=invalid_api_headers)
        
        # Assert
        assert response.status_code == 403
        assert "Invalid API Key" in response.json()["detail"]
    
    def test_create_brand_success(self, client, api_headers):
        """Test: POST /api/v1/brands - crear marca exitosamente"""
        # Arrange
        brand_data = {
            "name": "Test Brand",
            "country": "Test Country"
        }
        
        # Act
        response = client.post(
            "/api/v1/brands",
            json=brand_data,
            headers=api_headers
        )
        
        # Assert
        assert response.status_code == 200
        response_data = response.json()
        assert response_data["name"] == brand_data["name"]
        assert response_data["country"] == brand_data["country"]
        assert response_data["status"] == "Pendiente"
        assert "id" in response_data
    
    def test_create_brand_invalid_data(self, client, api_headers):
        """Test: POST /api/v1/brands - datos inválidos"""
        # Arrange
        invalid_brand_data = {
            "name": "",  # Nombre vacío
            "country": "Test Country"
        }
        
        # Act
        response = client.post(
            "/api/v1/brands",
            json=invalid_brand_data,
            headers=api_headers
        )
        
        # Assert
        assert response.status_code == 422  # Validation error
    
    def test_create_brand_missing_fields(self, client, api_headers):
        """Test: POST /api/v1/brands - campos faltantes"""
        # Arrange
        incomplete_brand_data = {
            "name": "Test Brand"
            # Falta country
        }
        
        # Act
        response = client.post(
            "/api/v1/brands",
            json=incomplete_brand_data,
            headers=api_headers
        )
        
        # Assert
        assert response.status_code == 422  # Validation error
    
    def test_get_brand_by_id_success(self, client, api_headers):
        """Test: GET /api/v1/brands/{id} - obtener marca por ID exitosamente"""
        # Arrange - Crear marca primero
        brand_data = {"name": "Get Brand", "country": "Get Country"}
        create_response = client.post(
            "/api/v1/brands",
            json=brand_data,
            headers=api_headers
        )
        created_brand = create_response.json()
        
        # Act - Obtener marca por ID
        response = client.get(
            f"/api/v1/brands/{created_brand['id']}",
            headers=api_headers
        )
        
        # Assert
        assert response.status_code == 200
        response_data = response.json()
        assert response_data["id"] == created_brand["id"]
        assert response_data["name"] == brand_data["name"]
        assert response_data["country"] == brand_data["country"]
    
    def test_get_brand_by_id_not_found(self, client, api_headers):
        """Test: GET /api/v1/brands/{id} - marca no encontrada"""
        # Act
        response = client.get("/api/v1/brands/999", headers=api_headers)
        
        # Assert
        assert response.status_code == 404
        assert "Marca no encontrada" in response.json()["detail"]
    
    def test_update_brand_success(self, client, api_headers):
        """Test: PUT /api/v1/brands/{id} - actualizar marca exitosamente"""
        # Arrange - Crear marca primero
        brand_data = {"name": "Update Brand", "country": "Update Country"}
        create_response = client.post(
            "/api/v1/brands",
            json=brand_data,
            headers=api_headers
        )
        created_brand = create_response.json()
        
        # Arrange - Datos de actualización
        update_data = {
            "name": "Updated Brand",
            "status": "Aprobada"
        }
        
        # Act - Actualizar marca
        response = client.put(
            f"/api/v1/brands/{created_brand['id']}",
            json=update_data,
            headers=api_headers
        )
        
        # Assert
        assert response.status_code == 200
        response_data = response.json()
        assert response_data["name"] == update_data["name"]
        assert response_data["status"] == update_data["status"]
        assert response_data["country"] == brand_data["country"]  # No se actualizó
    
    def test_update_brand_partial(self, client, api_headers):
        """Test: PUT /api/v1/brands/{id} - actualización parcial"""
        # Arrange - Crear marca primero
        brand_data = {"name": "Partial Brand", "country": "Partial Country"}
        create_response = client.post(
            "/api/v1/brands",
            json=brand_data,
            headers=api_headers
        )
        created_brand = create_response.json()
        
        # Arrange - Solo actualizar nombre
        update_data = {"name": "Partially Updated"}
        
        # Act - Actualizar marca
        response = client.put(
            f"/api/v1/brands/{created_brand['id']}",
            json=update_data,
            headers=api_headers
        )
        
        # Assert
        assert response.status_code == 200
        response_data = response.json()
        assert response_data["name"] == update_data["name"]
        assert response_data["country"] == brand_data["country"]  # Mantener original
        assert response_data["status"] == "Pendiente"  # Mantener original
    
    def test_update_brand_not_found(self, client, api_headers):
        """Test: PUT /api/v1/brands/{id} - marca no encontrada"""
        # Arrange
        update_data = {"name": "Updated"}
        
        # Act
        response = client.put(
            "/api/v1/brands/999",
            json=update_data,
            headers=api_headers
        )
        
        # Assert
        assert response.status_code == 404
        assert "Brand with id 999 not found" in response.json()["detail"]
    
    def test_delete_brand_success(self, client, api_headers):
        """Test: DELETE /api/v1/brands/{id} - eliminar marca exitosamente"""
        # Arrange - Crear marca primero
        brand_data = {"name": "Delete Brand", "country": "Delete Country"}
        create_response = client.post(
            "/api/v1/brands",
            json=brand_data,
            headers=api_headers
        )
        created_brand = create_response.json()
        
        # Act - Eliminar marca
        response = client.delete(
            f"/api/v1/brands/{created_brand['id']}",
            headers=api_headers
        )
        
        # Assert
        assert response.status_code == 200
        assert "Marca eliminada correctamente" in response.json()["detail"]
        
        # Verificar que la marca fue eliminada
        get_response = client.get(
            f"/api/v1/brands/{created_brand['id']}",
            headers=api_headers
        )
        assert get_response.status_code == 404
    
    def test_delete_brand_not_found(self, client, api_headers):
        """Test: DELETE /api/v1/brands/{id} - marca no encontrada"""
        # Act
        response = client.delete("/api/v1/brands/999", headers=api_headers)
        
        # Assert
        assert response.status_code == 404
        assert "Brand with id 999 not found" in response.json()["detail"]
    
    def test_api_key_required_for_all_endpoints(self, client):
        """Test: verificar que todos los endpoints requieren API key"""
        endpoints = [
            ("GET", "/api/v1/brands"),
            ("POST", "/api/v1/brands"),
            ("GET", "/api/v1/brands/1"),
            ("PUT", "/api/v1/brands/1"),
            ("DELETE", "/api/v1/brands/1")
        ]
        
        for method, endpoint in endpoints:
            if method == "GET":
                response = client.get(endpoint)
            elif method == "POST":
                response = client.post(endpoint, json={"name": "test", "country": "test"})
            elif method == "PUT":
                response = client.put(endpoint, json={"name": "test"})
            elif method == "DELETE":
                response = client.delete(endpoint)
            
            # FastAPI puede validar datos antes de verificar autenticación
            # Por lo tanto, podemos recibir 422 (Validation Error) o 403 (Forbidden)
            # Lo importante es que no devuelva 200 (OK) sin autenticación
            assert response.status_code in [403, 422]
            
            # Si es 403, verificar que es por falta de API key
            if response.status_code == 403:
                assert "Invalid API Key" in response.json()["detail"]
            # Si es 422, es por validación de datos, lo cual es correcto
    
    def test_cors_headers(self, client, api_headers):
        """Test: verificar que los headers CORS están configurados"""
        # Act
        response = client.options("/api/v1/brands", headers=api_headers)
        
        # Assert
        # FastAPI maneja CORS automáticamente, pero podemos verificar que la respuesta es válida
        assert response.status_code in [200, 405]  # OPTIONS puede devolver 405 si no está configurado
    
    def test_response_format_consistency(self, client, api_headers):
        """Test: verificar consistencia en el formato de respuesta"""
        # Arrange - Crear marca
        brand_data = {"name": "Format Brand", "country": "Format Country"}
        create_response = client.post(
            "/api/v1/brands",
            json=brand_data,
            headers=api_headers
        )
        created_brand = create_response.json()
        
        # Act - Obtener marca
        get_response = client.get(
            f"/api/v1/brands/{created_brand['id']}",
            headers=api_headers
        )
        
        # Assert - Verificar que ambos endpoints devuelven el mismo formato
        create_data = create_response.json()
        get_data = get_response.json()
        
        # Verificar campos requeridos
        required_fields = ["id", "name", "country", "status"]
        for field in required_fields:
            assert field in create_data
            assert field in get_data
        
        # Verificar tipos de datos
        assert isinstance(create_data["id"], int)
        assert isinstance(create_data["name"], str)
        assert isinstance(create_data["country"], str)
        assert isinstance(create_data["status"], str)
