# Script para iniciar el entorno de desarrollo
Write-Host "🚀 Iniciando entorno de desarrollo..." -ForegroundColor Green

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
Write-Host "🌐 Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:8001" -ForegroundColor Cyan
Write-Host "🗄️  Base de datos: localhost:5432" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Para ver logs en tiempo real:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.dev.yml logs -f [servicio]" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 Para detener:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.dev.yml down" -ForegroundColor Gray
