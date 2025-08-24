# Script para ejecutar tests del Backend de Registro de Marcas
# PowerShell Script

Write-Host "🧪 Ejecutando Tests del Backend..." -ForegroundColor Green

# Verificar si Poetry está instalado
try {
    poetry --version | Out-Null
    Write-Host "✅ Poetry encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Poetry no está instalado. Instalando..." -ForegroundColor Red
    Write-Host "Ejecuta: curl -sSL https://install.python-poetry.org | python3 -" -ForegroundColor Yellow
    exit 1
}

# Verificar si las dependencias están instaladas
if (-not (Test-Path "poetry.lock")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Blue
    poetry install
}

Write-Host ""
Write-Host "🚀 Ejecutando Tests..." -ForegroundColor Cyan

# Ejecutar tests unitarios
Write-Host "🧠 Tests Unitarios (Domain):" -ForegroundColor Yellow
poetry run pytest tests/unit/domain/ -v

Write-Host ""
Write-Host "🔌 Tests Unitarios (Adapters):" -ForegroundColor Yellow
poetry run pytest tests/unit/adapters/ -v

Write-Host ""
Write-Host "🧩 Tests Unitarios (Container):" -ForegroundColor Yellow
poetry run pytest tests/unit/test_container.py -v

# Ejecutar tests de integración
Write-Host ""
Write-Host "🔗 Tests de Integración:" -ForegroundColor Yellow
poetry run pytest tests/integration/ -v

# Ejecutar tests de API
Write-Host ""
Write-Host "🌐 Tests de API:" -ForegroundColor Yellow
poetry run pytest tests/api/ -v

# Ejecutar todos los tests con coverage
Write-Host ""
Write-Host "📊 Ejecutando todos los tests con coverage..." -ForegroundColor Cyan
poetry run pytest --cov=app --cov-report=term-missing --cov-report=html

Write-Host ""
Write-Host "✅ Tests completados!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   poetry run pytest tests/unit/           # Solo tests unitarios" -ForegroundColor White
Write-Host "   poetry run pytest tests/integration/    # Solo tests de integración" -ForegroundColor White
Write-Host "   poetry run pytest tests/api/            # Solo tests de API" -ForegroundColor White
Write-Host "   poetry run pytest -k 'test_create'      # Tests que contengan 'test_create'" -ForegroundColor White
Write-Host "   poetry run pytest --cov=app             # Con coverage" -ForegroundColor White
Write-Host "   poetry run pytest -v                    # Verbose" -ForegroundColor White
Write-Host ""
Write-Host "📁 Reporte de coverage generado en: htmlcov/index.html" -ForegroundColor Yellow
