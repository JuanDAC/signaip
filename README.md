# Sistema de Registro de Marcas

Sistema completo para el registro y gestión de marcas comerciales con arquitectura hexagonal.

## 🚀 Acceso Público

- **Frontend**: https://signaip-liart.vercel.app/es/registro-de-marca
- **Frontend Local**: http://localhost:3001

## 📚 Librerías Utilizadas

### Frontend (Next.js)
- **Next.js 15.5.0** - Framework React
- **React 19.1.0** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Framework CSS
- **next-intl** - Internacionalización

### Backend (FastAPI)
- **FastAPI 0.110.0** - Framework web
- **Uvicorn 0.29.0** - Servidor ASGI
- **Pydantic 2.6.0** - Validación de datos
- **SQLAlchemy 2.0.0** - ORM
- **psycopg2-binary 2.9.0** - Driver PostgreSQL
- **python-dotenv 1.0.1** - Variables de entorno
- **injector 0.22.0** - Inyección de dependencias
- **Poetry** - Gestión de dependencias

### Librerías de Desarrollo
- **black 24.4.0** - Formateador de código
- **ruff 0.4.0** - Linter y formateador
- **pytest 8.2.0** - Framework de testing
- **pytest-cov 5.0.0** - Cobertura de código
- **httpx 0.27.0** - Cliente HTTP para testing
- **ipython 8.24.0** - Shell interactivo

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
# Variables de entorno
./generate-env.ps1

# Desarrollo
./start-dev.ps1

# Producción
./start-prod.ps1
```

## 📝 Notas

- El sistema requiere autenticación por API key los template de env los subi para mejorar la experiencia, pero para producion se recomienda usar otros a los propuestos.

- Base de datos PostgreSQL configurada con Docker junto con los demas servicios.
- Frontend optimizado para standalone deployment
