# PowerShell script to test the complete Docker setup

Write-Host "=== Testing Docker Setup for Trademark Registration System ===" -ForegroundColor Cyan

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow
try {
    $null = docker ps 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
        Write-Host "You can run: .\start-docker.ps1" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

Write-Host "Docker is running!" -ForegroundColor Green

# Clean up any existing containers
Write-Host "Cleaning up existing containers..." -ForegroundColor Yellow
docker-compose down -v 2>$null

# Build and start PostgreSQL first
Write-Host "Building and starting PostgreSQL..." -ForegroundColor Yellow
docker-compose up postgres -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start PostgreSQL!" -ForegroundColor Red
    exit 1
}

# Wait for PostgreSQL to be ready
Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check PostgreSQL health
Write-Host "Checking PostgreSQL health..." -ForegroundColor Yellow
$maxAttempts = 10
$attempt = 0

do {
    Start-Sleep -Seconds 3
    $attempt++
    
    try {
        $health = docker-compose exec -T postgres pg_isready -U brands_user -d brands_db 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "PostgreSQL is ready!" -ForegroundColor Green
            break
        }
    } catch {
        # Continue waiting
    }
    
    Write-Host "Attempt $attempt/$maxAttempts - PostgreSQL not ready yet..." -ForegroundColor Yellow
    
} while ($attempt -lt $maxAttempts)

if ($attempt -ge $maxAttempts) {
    Write-Host "PostgreSQL did not become ready in time!" -ForegroundColor Red
    docker-compose logs postgres
    exit 1
}

# Build and start Backend
Write-Host "Building and starting Backend..." -ForegroundColor Yellow
docker-compose up backend -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start Backend!" -ForegroundColor Red
    docker-compose logs backend
    exit 1
}

# Wait for Backend to be ready
Write-Host "Waiting for Backend to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check Backend health
Write-Host "Checking Backend health..." -ForegroundColor Yellow
$maxAttempts = 10
$attempt = 0

do {
    Start-Sleep -Seconds 3
    $attempt++
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5 2>$null
        if ($response.StatusCode -eq 200) {
            Write-Host "Backend is ready!" -ForegroundColor Green
            break
        }
    } catch {
        # Continue waiting
    }
    
    Write-Host "Attempt $attempt/$maxAttempts - Backend not ready yet..." -ForegroundColor Yellow
    
} while ($attempt -lt $maxAttempts)

if ($attempt -ge $maxAttempts) {
    Write-Host "Backend did not become ready in time!" -ForegroundColor Red
    docker-compose logs backend
    exit 1
}

# Build and start Frontend
Write-Host "Building and starting Frontend..." -ForegroundColor Yellow
docker-compose up frontend -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start Frontend!" -ForegroundColor Red
    docker-compose logs frontend
    exit 1
}

# Wait for Frontend to be ready
Write-Host "Waiting for Frontend to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Check Frontend health
Write-Host "Checking Frontend health..." -ForegroundColor Yellow
$maxAttempts = 10
$attempt = 0

do {
    Start-Sleep -Seconds 3
    $attempt++
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing -TimeoutSec 5 2>$null
        if ($response.StatusCode -eq 200) {
            Write-Host "Frontend is ready!" -ForegroundColor Green
            break
        }
    } catch {
        # Continue waiting
    }
    
    Write-Host "Attempt $attempt/$maxAttempts - Frontend not ready yet..." -ForegroundColor Yellow
    
} while ($attempt -lt $maxAttempts)

if ($attempt -ge $maxAttempts) {
    Write-Host "Frontend did not become ready in time!" -ForegroundColor Red
    docker-compose logs frontend
    exit 1
}

# Start Nginx
Write-Host "Starting Nginx..." -ForegroundColor Yellow
docker-compose up nginx -d

# Final health check
Write-Host "Performing final health checks..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "`n=== Service Status ===" -ForegroundColor Cyan
docker-compose ps

Write-Host "`n=== Health Check Results ===" -ForegroundColor Cyan

# Test PostgreSQL
try {
    $dbTest = docker-compose exec -T postgres psql -U brands_user -d brands_db -c "SELECT COUNT(*) FROM brands;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ PostgreSQL: Healthy" -ForegroundColor Green
    } else {
        Write-Host "✗ PostgreSQL: Unhealthy" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ PostgreSQL: Error checking health" -ForegroundColor Red
}

# Test Backend
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5
    if ($backendResponse.StatusCode -eq 200) {
        Write-Host "✓ Backend: Healthy" -ForegroundColor Green
        Write-Host "  Response: $($backendResponse.Content)" -ForegroundColor Gray
    } else {
        Write-Host "✗ Backend: Unhealthy (Status: $($backendResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Backend: Error checking health" -ForegroundColor Red
}

# Test Frontend
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing -TimeoutSec 5
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✓ Frontend: Healthy" -ForegroundColor Green
    } else {
        Write-Host "✗ Frontend: Unhealthy (Status: $($frontendResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Frontend: Error checking health" -ForegroundColor Red
}

# Test Nginx
try {
    $nginxResponse = Invoke-WebRequest -Uri "http://localhost:80/" -UseBasicParsing -TimeoutSec 5
    if ($nginxResponse.StatusCode -eq 200) {
        Write-Host "✓ Nginx: Healthy" -ForegroundColor Green
    } else {
        Write-Host "✗ Nginx: Unhealthy (Status: $($nginxResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Nginx: Error checking health" -ForegroundColor Red
}

Write-Host "`n=== Connection Test ===" -ForegroundColor Cyan

# Test database connection from backend
try {
    $dbConnectionTest = docker-compose exec -T backend python -c "
import psycopg2
try:
    conn = psycopg2.connect('postgresql://brands_user:brands_password@postgres:5432/brands_db')
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM brands')
    result = cursor.fetchone()
    print(f'Database connection successful. Brands count: {result[0]}')
    cursor.close()
    conn.close()
except Exception as e:
    print(f'Database connection failed: {e}')
    exit(1)
"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Backend-Database Connection: Successful" -ForegroundColor Green
        Write-Host "  $dbConnectionTest" -ForegroundColor Gray
    } else {
        Write-Host "✗ Backend-Database Connection: Failed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Backend-Database Connection: Error testing" -ForegroundColor Red
}

Write-Host "`n=== Access URLs ===" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Green
Write-Host "Nginx Proxy: http://localhost:80" -ForegroundColor Green
Write-Host "Database: localhost:5432" -ForegroundColor Green

Write-Host "`n=== Docker Setup Test Complete! ===" -ForegroundColor Cyan
Write-Host "All services are running and connected." -ForegroundColor Green
Write-Host "Use 'docker-compose logs -f' to monitor logs" -ForegroundColor Yellow
Write-Host "Use 'docker-compose down' to stop all services" -ForegroundColor Yellow
