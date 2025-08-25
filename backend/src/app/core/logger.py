"""
Sistema de logging técnico para la aplicación
Configura logging estructurado con contexto de UUID
"""

import logging
import sys
from typing import Optional
from datetime import datetime

# Configurar el logger principal
def setup_logger(name: str = "app_logger", level: str = "INFO") -> logging.Logger:
    """Configurar el logger principal de la aplicación"""
    
    # Crear logger
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper()))
    
    # Evitar duplicar handlers
    if not logger.handlers:
        # Handler para consola
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        
        # Formato estructurado
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s] [%(uuid)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        console_handler.setFormatter(formatter)
        
        # Agregar handler
        logger.addHandler(console_handler)
        
        # Configurar propagación
        logger.propagate = False
    
    return logger

# Logger principal
app_logger = setup_logger()

class UUIDLogAdapter(logging.LoggerAdapter):
    """Adapter para logging con contexto de UUID"""
    
    def process(self, msg, kwargs):
        """Procesar mensaje agregando UUID al contexto"""
        extra = kwargs.get('extra', {})
        if 'uuid' not in extra:
            extra['uuid'] = self.extra.get('uuid', 'N/A')
        kwargs['extra'] = extra
        return msg, kwargs

def get_logger_with_uuid(uuid: Optional[str] = None, logger_name: str = "app_logger") -> UUIDLogAdapter:
    """
    Obtener logger con contexto de UUID
    
    Args:
        uuid: UUID de la entidad para trazabilidad
        logger_name: Nombre del logger a usar
    
    Returns:
        Logger con contexto de UUID
    """
    base_logger = logging.getLogger(logger_name)
    return UUIDLogAdapter(base_logger, {"uuid": str(uuid) if uuid else "N/A"})

def log_operation_start(operation: str, entity_type: str, entity_id: Optional[str] = None, **kwargs):
    """Loggear inicio de operación"""
    logger = get_logger_with_uuid(entity_id)
    logger.info(f"Starting {operation} for {entity_type}", extra=kwargs)

def log_operation_success(operation: str, entity_type: str, entity_id: Optional[str] = None, **kwargs):
    """Loggear éxito de operación"""
    logger = get_logger_with_uuid(entity_id)
    logger.info(f"Successfully completed {operation} for {entity_type}", extra=kwargs)

def log_operation_error(operation: str, entity_type: str, entity_id: Optional[str] = None, error: str = None, **kwargs):
    """Loggear error de operación"""
    logger = get_logger_with_uuid(entity_id)
    logger.error(f"Error in {operation} for {entity_type}: {error}", extra=kwargs)

def log_entity_created(entity_type: str, entity_id: str, **kwargs):
    """Loggear creación de entidad"""
    logger = get_logger_with_uuid(entity_id)
    logger.info(f"{entity_type} created successfully", extra=kwargs)

def log_entity_updated(entity_type: str, entity_id: str, **kwargs):
    """Loggear actualización de entidad"""
    logger = get_logger_with_uuid(entity_id)
    logger.info(f"{entity_type} updated successfully", extra=kwargs)

def log_entity_deleted(entity_type: str, entity_id: str, **kwargs):
    """Loggear eliminación de entidad"""
    logger = get_logger_with_uuid(entity_id)
    logger.info(f"{entity_type} deleted successfully", extra=kwargs)

def log_entity_not_found(entity_type: str, entity_id: str, **kwargs):
    """Loggear entidad no encontrada"""
    logger = get_logger_with_uuid(entity_id)
    logger.warning(f"{entity_type} not found", extra=kwargs)
