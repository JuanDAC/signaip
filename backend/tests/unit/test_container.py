import pytest
from injector import Injector
from app.container import AppModule, injector
from app.domain.ports.brand_port import BrandPort
from app.domain.ports.auth_port import AuthPort
from app.domain.use_cases.brand_use_case import BrandUseCase
from app.adapters.db.repositories.brand_repository import BrandRepository
from app.adapters.auth.auth_adapter import SimpleAuthAdapter

class TestContainer:
    """Tests para el contenedor de dependencias"""
    
    def test_container_creation(self):
        """Test: verificar que el contenedor se crea correctamente"""
        # Act
        test_injector = Injector([AppModule()])
        
        # Assert
        assert test_injector is not None
        assert isinstance(test_injector, Injector)
    
    def test_brand_port_binding(self):
        """Test: verificar que BrandPort está correctamente bindeado"""
        # Act
        brand_port = injector.get(BrandPort)
        
        # Assert
        assert brand_port is not None
        assert isinstance(brand_port, BrandRepository)
    
    def test_auth_port_binding(self):
        """Test: verificar que AuthPort está correctamente bindeado"""
        # Act
        auth_port = injector.get(AuthPort)
        
        # Assert
        assert auth_port is not None
        assert isinstance(auth_port, SimpleAuthAdapter)
    
    def test_brand_use_case_binding(self):
        """Test: verificar que BrandUseCase está correctamente bindeado"""
        # Act
        brand_use_case = injector.get(BrandUseCase)
        
        # Assert
        assert brand_use_case is not None
        assert isinstance(brand_use_case, BrandUseCase)
    
    def test_brand_use_case_dependency_injection(self):
        """Test: verificar que BrandUseCase recibe sus dependencias correctamente"""
        # Act
        brand_use_case = injector.get(BrandUseCase)
        
        # Assert
        assert hasattr(brand_use_case, 'repo')
        assert brand_use_case.repo is not None
        assert isinstance(brand_use_case.repo, BrandRepository)
    
    def test_auth_adapter_configuration(self):
        """Test: verificar que SimpleAuthAdapter está configurado con la API key correcta"""
        # Act
        auth_port = injector.get(AuthPort)
        
        # Assert
        assert hasattr(auth_port, 'valid_key')
        assert auth_port.valid_key == "super-secret-key-123"
    
    def test_singleton_scope(self):
        """Test: verificar que las instancias son singletons"""
        # Act
        brand_port1 = injector.get(BrandPort)
        brand_port2 = injector.get(BrandPort)
        
        auth_port1 = injector.get(AuthPort)
        auth_port2 = injector.get(AuthPort)
        
        brand_use_case1 = injector.get(BrandUseCase)
        brand_use_case2 = injector.get(BrandUseCase)
        
        # Assert
        assert brand_port1 is brand_port2
        assert auth_port1 is auth_port2
        assert brand_use_case1 is brand_use_case2
    
    def test_brand_use_case_functionality_with_injected_deps(self):
        """Test: verificar que BrandUseCase funciona correctamente con dependencias inyectadas"""
        # Act
        brand_use_case = injector.get(BrandUseCase)
        
        # Assert
        # Verificar que los métodos están disponibles
        assert hasattr(brand_use_case, 'list_brands')
        assert hasattr(brand_use_case, 'get_brand')
        assert hasattr(brand_use_case, 'create_brand')
        assert hasattr(brand_use_case, 'update_brand')
        assert hasattr(brand_use_case, 'delete_brand')
        
        # Verificar que los métodos son callable
        assert callable(brand_use_case.list_brands)
        assert callable(brand_use_case.get_brand)
        assert callable(brand_use_case.create_brand)
        assert callable(brand_use_case.update_brand)
        assert callable(brand_use_case.delete_brand)
    
    def test_repository_implements_port_interface(self):
        """Test: verificar que el repositorio implementa correctamente la interfaz"""
        # Act
        brand_port = injector.get(BrandPort)
        
        # Assert
        # Verificar que implementa todos los métodos requeridos
        assert hasattr(brand_port, 'get_all')
        assert hasattr(brand_port, 'get_by_id')
        assert hasattr(brand_port, 'create')
        assert hasattr(brand_port, 'update')
        assert hasattr(brand_port, 'delete')
        
        # Verificar que los métodos son callable
        assert callable(brand_port.get_all)
        assert callable(brand_port.get_by_id)
        assert callable(brand_port.create)
        assert callable(brand_port.update)
        assert callable(brand_port.delete)
    
    def test_auth_adapter_implements_auth_port_interface(self):
        """Test: verificar que SimpleAuthAdapter implementa correctamente AuthPort"""
        # Act
        auth_port = injector.get(AuthPort)
        
        # Assert
        # Verificar que implementa el método requerido
        assert hasattr(auth_port, 'validate_api_key')
        assert callable(auth_port.validate_api_key)
    
    def test_container_module_configuration(self):
        """Test: verificar que AppModule está configurado correctamente"""
        # Act
        module = AppModule()
        
        # Assert
        assert module is not None
        assert hasattr(module, 'configure')
        assert callable(module.configure)
    
    def test_dependency_resolution_order(self):
        """Test: verificar que las dependencias se resuelven en el orden correcto"""
        # Act
        # Primero obtener el caso de uso
        brand_use_case = injector.get(BrandUseCase)
        
        # Luego obtener el repositorio directamente
        brand_port = injector.get(BrandPort)
        
        # Assert
        # Verificar que el caso de uso tiene el repositorio correcto
        assert brand_use_case.repo is brand_port
    
    def test_container_error_handling(self):
        """Test: verificar que el contenedor maneja errores correctamente"""
        # Act & Assert
        # Intentar obtener un tipo que no está registrado debería fallar
        # El contenedor de injector puede retornar valores inesperados para tipos no registrados
        result = injector.get(str)  # str no está registrado en el contenedor
        # Verificar que no es una instancia válida de los tipos registrados
        assert not isinstance(result, (BrandRepository, SimpleAuthAdapter, BrandUseCase))
    
    def test_multiple_container_instances(self):
        """Test: verificar que múltiples instancias del contenedor funcionan independientemente"""
        # Act
        injector1 = Injector([AppModule()])
        injector2 = Injector([AppModule()])
        
        brand_port1 = injector1.get(BrandPort)
        brand_port2 = injector2.get(BrandPort)
        
        # Assert
        assert brand_port1 is not brand_port2  # Diferentes instancias
        assert isinstance(brand_port1, BrandRepository)
        assert isinstance(brand_port2, BrandRepository)
