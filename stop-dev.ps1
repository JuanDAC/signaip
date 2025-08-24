# Script para detener el entorno de desarrollo
Write-Host "🛑 Deteniendo entorno de desarrollo..." -ForegroundColor Yellow

# Detener y remover contenedores
docker-compose -f docker-compose.dev.yml down

Write-Host "✅ Entorno de desarrollo detenido!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Para limpiar completamente (imágenes y volúmenes):" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.dev.yml down -v --rmi all" -ForegroundColor Gray
