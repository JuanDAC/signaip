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

# Expandir variables anidadas de forma simple
$envVars['DATABASE_URL'] = $envVars['DATABASE_URL'] -replace '\$\{POSTGRES_USER\}', $envVars['POSTGRES_USER'] -replace '\$\{POSTGRES_PASSWORD\}', $envVars['POSTGRES_PASSWORD'] -replace '\$\{POSTGRES_HOST\}', $envVars['POSTGRES_HOST'] -replace '\$\{POSTGRES_PORT\}', $envVars['POSTGRES_PORT'] -replace '\$\{POSTGRES_DB\}', $envVars['POSTGRES_DB']
$envVars['BACKEND_URL'] = $envVars['BACKEND_URL'] -replace '\$\{BACKEND_HOST\}', $envVars['BACKEND_HOST'] -replace '\$\{BACKEND_PORT\}', $envVars['BACKEND_PORT']
$envVars['FRONTEND_URL'] = $envVars['FRONTEND_URL'] -replace '\$\{FRONTEND_HOST\}', $envVars['FRONTEND_HOST'] -replace '\$\{FRONTEND_PORT\}', $envVars['FRONTEND_PORT']
$envVars['BACKEND_EXTERNAL_URL'] = $envVars['BACKEND_EXTERNAL_URL'] -replace '\$\{BACKEND_EXTERNAL_PORT\}', $envVars['BACKEND_EXTERNAL_PORT']
$envVars['FRONTEND_EXTERNAL_URL'] = $envVars['FRONTEND_EXTERNAL_URL'] -replace '\$\{FRONTEND_EXTERNAL_PORT\}', $envVars['FRONTEND_EXTERNAL_PORT']
$envVars['DATABASE_EXTERNAL_URL'] = $envVars['DATABASE_EXTERNAL_URL'] -replace '\$\{POSTGRES_PORT\}', $envVars['POSTGRES_PORT']

# Exportar variables al entorno actual para docker-compose
foreach ($key in $envVars.Keys) {
    Set-Item -Path "env:$key" -Value $envVars[$key]
}

Write-Host "🔧 Variables de entorno cargadas:" -ForegroundColor Green
Write-Host "   Frontend: $($envVars['FRONTEND_EXTERNAL_URL'])" -ForegroundColor Cyan
Write-Host "   Backend: $($envVars['BACKEND_EXTERNAL_URL'])" -ForegroundColor Cyan
Write-Host "   Database: $($envVars['DATABASE_EXTERNAL_URL'])" -ForegroundColor Cyan

# Crear archivo docker-compose temporal con variables expandidas
Write-Host "📝 Generando docker-compose temporal..." -ForegroundColor Yellow
$composeContent = Get-Content "docker-compose.dev.yml" -Raw

# Reemplazar todas las variables con sus valores
foreach ($key in $envVars.Keys) {
    $composeContent = $composeContent -replace "\$\{$key\}", $envVars[$key]
}

# Escribir archivo temporal
$tempComposeFile = "docker-compose.dev.temp.yml"
$composeContent | Out-File -FilePath $tempComposeFile -Encoding UTF8

try {
    # Detener contenedores existentes si están corriendo
    Write-Host "🛑 Deteniendo contenedores existentes..." -ForegroundColor Yellow
    docker-compose -f $tempComposeFile down

    # Limpiar imágenes y volúmenes si es necesario (opcional)
    if ($args[0] -eq "--clean") {
        Write-Host "🧹 Limpiando imágenes y volúmenes..." -ForegroundColor Yellow
        docker-compose -f $tempComposeFile down -v --rmi all
    }

    # Construir e iniciar los servicios
    Write-Host "🔨 Construyendo e iniciando servicios..." -ForegroundColor Blue
    docker-compose -f $tempComposeFile up --build -d

    # Esperar a que los servicios estén listos
    Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10

    # Mostrar estado de los contenedores
    Write-Host "📊 Estado de los contenedores:" -ForegroundColor Cyan
    docker-compose -f $tempComposeFile ps

    Write-Host "✅ Entorno de desarrollo iniciado!" -ForegroundColor Green
    Write-Host "🌐 Frontend: $($envVars['FRONTEND_EXTERNAL_URL'])" -ForegroundColor Cyan
    Write-Host "🔧 Backend: $($envVars['BACKEND_EXTERNAL_URL'])" -ForegroundColor Cyan
    Write-Host "🗄️  Base de datos: $($envVars['DATABASE_EXTERNAL_URL'])" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Para ver logs en tiempo real:" -ForegroundColor Yellow
    Write-Host "   docker-compose -f $tempComposeFile logs -f [servicio]" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🛑 Para detener:" -ForegroundColor Yellow
    Write-Host "   docker-compose -f $tempComposeFile down" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔧 Variables de entorno cargadas desde: env.dev" -ForegroundColor Green
    Write-Host "📄 Docker-compose temporal: $tempComposeFile" -ForegroundColor Yellow
}
finally {
    # Limpiar archivo temporal
    if (Test-Path $tempComposeFile) {
        Remove-Item $tempComposeFile -Force
        Write-Host "🧹 Archivo temporal limpiado" -ForegroundColor Green
    }
}
