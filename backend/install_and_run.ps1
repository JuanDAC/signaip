# Script de instalación y ejecución para el Backend de Registro de Marcas
# PowerShell Script

Write-Host "🚀 Instalando Backend de Registro de Marcas..." -ForegroundColor Green

# Verificar si Poetry está instalado
try {
    poetry --version | Out-Null
    Write-Host "✅ Poetry encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Poetry no está instalado. Instalando..." -ForegroundColor Red
    Write-Host "Ejecuta: curl -sSL https://install.python-poetry.org | python3 -" -ForegroundColor Yellow
    exit 1
}

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Blue
poetry install

# Crear archivo .env si no existe
if (-not (Test-Path ".env")) {
    Write-Host "🔧 Creando archivo .env..." -ForegroundColor Blue
    Copy-Item "env.example" ".env"
    Write-Host "⚠️  Por favor, edita el archivo .env con tus credenciales de base de datos" -ForegroundColor Yellow
}

Write-Host "✅ Instalación completada!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Para ejecutar el backend:" -ForegroundColor Cyan
Write-Host "   poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentación disponible en:" -ForegroundColor Cyan
Write-Host "   http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Recuerda configurar tu API_KEY en el archivo .env" -ForegroundColor Yellow
