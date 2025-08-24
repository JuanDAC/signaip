# PowerShell script to test the complete Docker integration

Write-Host "=== Testing Docker Integration for Trademark Registration System ===" -ForegroundColor Cyan

# Check if all services are running
Write-Host "`n1. Checking service status..." -ForegroundColor Yellow
docker-compose ps

# Test database connection
Write-Host "`n2. Testing database connection..." -ForegroundColor Yellow
try {
    $dbTest = docker exec -it brands_postgres psql -U brands_user -d brands_db -c "SELECT COUNT(*) as total_brands FROM brands;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database connection successful" -ForegroundColor Green
        Write-Host "  $dbTest" -ForegroundColor Gray
    } else {
        Write-Host "✗ Database connection failed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Database connection failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test backend health
Write-Host "`n3. Testing backend health..." -ForegroundColor Yellow
try {
    $backendHealth = Invoke-RestMethod -Uri "http://localhost:8001/health" -Method GET
    Write-Host "✓ Backend health check successful" -ForegroundColor Green
    Write-Host "  Status: $($backendHealth.status)" -ForegroundColor Gray
    Write-Host "  Message: $($backendHealth.message)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test backend API with authentication
Write-Host "`n4. Testing backend API..." -ForegroundColor Yellow
try {
    $headers = @{ 'x-api-key' = 'super-secret-key-123' }
    $apiTest = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/brands" -Method GET -Headers $headers
    Write-Host "✓ Backend API test successful" -ForegroundColor Green
    Write-Host "  Retrieved $($apiTest.Count) brands" -ForegroundColor Gray
} catch {
    Write-Host "✗ Backend API test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend connection
Write-Host "`n5. Testing frontend connection..." -ForegroundColor Yellow
try {
    $frontendTest = Invoke-RestMethod -Uri "http://localhost:3001" -Method GET
    Write-Host "✓ Frontend connection successful" -ForegroundColor Green
    Write-Host "  Response received successfully" -ForegroundColor Gray
} catch {
    Write-Host "✗ Frontend connection failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test network connectivity between containers
Write-Host "`n6. Testing inter-container communication..." -ForegroundColor Yellow
try {
    $networkTest = docker exec -it brands_backend ping -c 1 postgres 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Backend can reach PostgreSQL" -ForegroundColor Green
    } else {
        Write-Host "✗ Backend cannot reach PostgreSQL" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Network test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Summary
Write-Host "`n=== Integration Test Summary ===" -ForegroundColor Cyan
Write-Host "Services are running on:" -ForegroundColor Yellow
Write-Host "  • Frontend: http://localhost:3001" -ForegroundColor Green
Write-Host "  • Backend:  http://localhost:8001" -ForegroundColor Green
Write-Host "  • Database: localhost:5432" -ForegroundColor Green

Write-Host "`nTo access the application:" -ForegroundColor Yellow
Write-Host "  • Open http://localhost:3001 in your browser" -ForegroundColor Green
Write-Host "  • API documentation: http://localhost:8001/docs" -ForegroundColor Green

Write-Host "`nTo stop all services:" -ForegroundColor Yellow
Write-Host "  docker-compose down" -ForegroundColor Gray

Write-Host "`nTo view logs:" -ForegroundColor Yellow
Write-Host "  docker-compose logs -f" -ForegroundColor Gray
