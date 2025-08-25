# Sistema de Registro de Marcas

Sistema completo para el registro y gestión de marcas comerciales con arquitectura hexagonal.

## 🚀 Acceso Público

- **Frontend**: http://localhost:3000

## 📚 Librerías Utilizadas

### Frontend (Next.js)
- **Next.js 15.5.0** - Framework React
- **React 19.1.0** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Framework CSS
- **next-intl** - Internacionalización

### Backend (FastAPI)
- **FastAPI 0.110.0** - Framework web
- **SQLAlchemy 2.0.0** - ORM
- **Pydantic 2.6.0** - Validación de datos
- **Uvicorn** - Servidor ASGI
- **PostgreSQL** - Base de datos
- **Poetry** - Gestión de dependencias

## 🔌 Endpoints CRUD

### Marcas (`/api/v1/brands`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/brands` | Listar todas las marcas |
| `GET` | `/api/v1/brands/{id}` | Obtener marca por ID |
| `POST` | `/api/v1/brands` | Crear nueva marca |
| `PUT` | `/api/v1/brands/{id}` | Actualizar marca |
| `DELETE` | `/api/v1/brands/{id}` | Eliminar marca (soft delete) |
| `DELETE` | `/api/v1/brands/{id}/hard` | Eliminación física |

## 🏗️ Arquitectura

- **Frontend**: Next.js con TypeScript y Tailwind CSS
- **Backend**: FastAPI con arquitectura hexagonal
- **Base de Datos**: PostgreSQL
- **Contenedores**: Docker con docker-compose

## 🚀 Inicio Rápido

```bash
# Desarrollo
./start-dev.ps1

# Producción
./start-prod.ps1
```

## 📝 Notas

- El sistema requiere autenticación por API key
- Base de datos PostgreSQL configurada con Docker
- Frontend optimizado para standalone deployment
