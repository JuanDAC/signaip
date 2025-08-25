# =============================================================================
# GENERADOR AUTOMÁTICO DE ARCHIVOS DE ENTORNO
# =============================================================================

param(
    [string]$Environment = "dev",
    [switch]$Force
)

Write-Host "🔧 Generando archivo de entorno para: $Environment" -ForegroundColor Cyan

# Función para generar archivo de entorno
function Generate-EnvFile {
    param(
        [string]$EnvType,
        [hashtable]$Overrides = @{}
    )
    
    $fileName = if ($EnvType -eq "dev") { "env.dev" } else { "env.prod" }
    $content = @"
# =============================================================================
# CONFIGURACIÓN CENTRALIZADA DEL ENTORNO DE $($EnvType.ToUpper())
# =============================================================================

# Configuración de la base de datos PostgreSQL
POSTGRES_DB=brands_db
POSTGRES_USER=brands_user
POSTGRES_PASSWORD=brands_password
POSTGRES_PORT=5432
POSTGRES_HOST=postgres

# Configuración del Backend FastAPI
BACKEND_PORT=8000
BACKEND_HOST=backend
BACKEND_EXTERNAL_PORT=8001
BACKEND_API_KEY=super-secret-key-123
BACKEND_ENVIRONMENT=$EnvType

# Configuración del Frontend Next.js
FRONTEND_PORT=3000
FRONTEND_HOST=frontend
FRONTEND_EXTERNAL_PORT=3001
FRONTEND_API_KEY=super-secret-key-123

# Configuración de la red Docker
DOCKER_NETWORK_NAME=brands_network_$EnvType
DOCKER_SUBNET=172.21.0.0/16

# URLs de conexión entre servicios
DATABASE_URL=postgresql://`${POSTGRES_USER}:`${POSTGRES_PASSWORD}@`${POSTGRES_HOST}:`${POSTGRES_PORT}/`${POSTGRES_DB}
BACKEND_URL=http://`${BACKEND_HOST}:`${BACKEND_PORT}
FRONTEND_URL=http://`${FRONTEND_HOST}:`${FRONTEND_PORT}

# URLs públicas para acceso externo
BACKEND_EXTERNAL_URL=http://localhost:`${BACKEND_EXTERNAL_PORT}
FRONTEND_EXTERNAL_URL=http://localhost:`${FRONTEND_EXTERNAL_PORT}
DATABASE_EXTERNAL_URL=localhost:`${POSTGRES_PORT}

# Configuración de desarrollo
WATCHPACK_POLLING=true
CHOKIDAR_USEPOLLING=true
NODE_ENV=$EnvType
"@

    # Aplicar overrides si existen
    foreach ($key in $Overrides.Keys) {
        $content = $content -replace "$key=.*", "$key=$($Overrides[$key])"
    }

    if ($Force -or -not (Test-Path $fileName)) {
        $content | Out-File -FilePath $fileName -Encoding UTF8
        Write-Host "✅ Archivo $fileName generado/actualizado" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Archivo $fileName ya existe. Usa -Force para sobrescribir" -ForegroundColor Yellow
    }
}

# Generar archivo de entorno de desarrollo
Generate-EnvFile -EnvType "dev"

# Generar archivo de entorno de producción
$prodOverrides = @{
    "BACKEND_EXTERNAL_PORT" = "8000"
    "FRONTEND_EXTERNAL_PORT" = "3000"
    "WATCHPACK_POLLING" = "false"
    "CHOKIDAR_USEPOLLING" = "false"
    "NODE_ENV" = "production"
}
Generate-EnvFile -EnvType "prod" -Overrides $prodOverrides

Write-Host "🎉 Archivos de entorno generados exitosamente!" -ForegroundColor Green
Write-Host "📁 Archivos creados:" -ForegroundColor Cyan
Write-Host "   - env.dev (desarrollo)" -ForegroundColor White
Write-Host "   - env.prod (producción)" -ForegroundColor White
Write-Host ""
Write-Host "💡 Para usar en docker-compose:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.dev.yml up -d" -ForegroundColor White
Write-Host "   docker-compose -f docker-compose.yml up -d" -ForegroundColor White
