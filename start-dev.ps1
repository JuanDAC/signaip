# Script para iniciar el entorno de desarrollo
Write-Host "🚀 Iniciando entorno de desarrollo..." -ForegroundColor Green

# Verificar si existe el archivo de entorno, si no, generarlo
if (-not (Test-Path "env.dev")) {
    Write-Host "📝 Archivo de entorno no encontrado, generando automáticamente..." -ForegroundColor Yellow
    & "$PSScriptRoot\generate-env.ps1" -Environment "dev"
}

# Cargar variables de entorno del archivo env.dev
$envContent = Get-Content "env.dev" | Where-Object { $_ -match "^[^#].*=" }
$envVars = @{}

# Primera pasada: cargar variables básicas
foreach ($line in $envContent) {
    if ($line -match "^([^=]+)=(.*)$") {
        $key = $matches[1]
        $value = $matches[2]
        $envVars[$key] = $value
    }
}

# Segunda pasada: expandir variables anidadas
$maxIterations = 10
$iteration = 0
do {
    $changed = $false
    foreach ($key in $envVars.Keys) {
        $oldValue = $envVars[$key]
        $newValue = $oldValue -replace '\$\{([^}]+)\}', { 
            if ($envVars.ContainsKey($matches[1])) {
                $envVars[$matches[1]]
            } else {
                "`${$($matches[1])}"
            }
        }
        if ($newValue -ne $oldValue) {
            $envVars[$key] = $newValue
            $changed = $true
        }
    }
    $iteration++
} while ($changed -and $iteration -lt $maxIterations)

# Exportar variables al entorno actual para docker-compose
foreach ($key in $envVars.Keys) {
    Set-Item -Path "env:$key" -Value $envVars[$key]
}

Write-Host "🔧 Variables de entorno cargadas:" -ForegroundColor Green
Write-Host "   Frontend: $($envVars['FRONTEND_EXTERNAL_URL'])" -ForegroundColor Cyan
Write-Host "   Backend: $($envVars['BACKEND_EXTERNAL_URL'])" -ForegroundColor Cyan
Write-Host "   Database: $($envVars['DATABASE_EXTERNAL_URL'])" -ForegroundColor Cyan

# Detener contenedores existentes si están corriendo
Write-Host "🛑 Deteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml down

# Limpiar imágenes y volúmenes si es necesario (opcional)
if ($args[0] -eq "--clean") {
    Write-Host "🧹 Limpiando imágenes y volúmenes..." -ForegroundColor Yellow
    docker-compose -f docker-compose.dev.yml down -v --rmi all
}

# Construir e iniciar los servicios
Write-Host "🔨 Construyendo e iniciando servicios..." -ForegroundColor Blue
docker-compose -f docker-compose.dev.yml up --build -d

# Esperar a que los servicios estén listos
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Mostrar estado de los contenedores
Write-Host "📊 Estado de los contenedores:" -ForegroundColor Cyan
docker-compose -f docker-compose.dev.yml ps

Write-Host "✅ Entorno de desarrollo iniciado!" -ForegroundColor Green
Write-Host "🌐 Frontend: $($envVars['FRONTEND_EXTERNAL_URL'])" -ForegroundColor Cyan
Write-Host "🔧 Backend: $($envVars['BACKEND_EXTERNAL_URL'])" -ForegroundColor Cyan
Write-Host "🗄️  Base de datos: $($envVars['DATABASE_EXTERNAL_URL'])" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Para ver logs en tiempo real:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.dev.yml logs -f [servicio]" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 Para detener:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.dev.yml down" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 Variables de entorno cargadas desde: env.dev" -ForegroundColor Green
