# Script para iniciar el entorno de producción
Write-Host "🚀 Iniciando entorno de producción..." -ForegroundColor Green

# Verificar si existe el archivo de entorno, si no, generarlo
if (-not (Test-Path "env.prod")) {
    Write-Host "📝 Archivo de entorno no encontrado, generando automáticamente..." -ForegroundColor Yellow
    & "$PSScriptRoot\generate-env.ps1" -Environment "prod"
}

# Cargar variables de entorno del archivo env.prod
$envContent = Get-Content "env.prod" | Where-Object { $_ -match "^[^#].*=" }
$envVars = @{}
foreach ($line in $envContent) {
    if ($line -match "^([^=]+)=(.*)$") {
        $key = $matches[1]
        $value = $matches[2]
        $envVars[$key] = $value
    }
}

# Detener contenedores existentes si están corriendo
Write-Host "🛑 Deteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose -f docker-compose.yml down

# Limpiar imágenes y volúmenes si es necesario (opcional)
if ($args[0] -eq "--clean") {
    Write-Host "🧹 Limpiando imágenes y volúmenes..." -ForegroundColor Yellow
    docker-compose -f docker-compose.yml down -v --rmi all
}

# Construir e iniciar los servicios
Write-Host "🔨 Construyendo e iniciando servicios..." -ForegroundColor Blue
docker-compose -f docker-compose.yml up --build -d

# Esperar a que los servicios estén listos
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Mostrar estado de los contenedores
Write-Host "📊 Estado de los contenedores:" -ForegroundColor Cyan
docker-compose -f docker-compose.yml ps

Write-Host "✅ Entorno de producción iniciado!" -ForegroundColor Green
Write-Host "🌐 Frontend: $($envVars['FRONTEND_EXTERNAL_URL'])" -ForegroundColor Cyan
Write-Host "🔧 Backend: $($envVars['BACKEND_EXTERNAL_URL'])" -ForegroundColor Cyan
Write-Host "🗄️  Base de datos: $($envVars['DATABASE_EXTERNAL_URL'])" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Para ver logs en tiempo real:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.yml logs -f [servicio]" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 Para detener:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.yml down" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 Variables de entorno cargadas desde: env.prod" -ForegroundColor Green
Write-Host "⚠️  Entorno de PRODUCCIÓN - No usar para desarrollo" -ForegroundColor Red
