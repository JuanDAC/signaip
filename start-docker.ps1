# PowerShell script to start Docker Desktop and wait for it to be ready

Write-Host "Starting Docker Desktop..." -ForegroundColor Yellow

# Try to start Docker Desktop
try {
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe" -WindowStyle Minimized
} catch {
    Write-Host "Could not start Docker Desktop. Please start it manually." -ForegroundColor Red
    exit 1
}

Write-Host "Waiting for Docker to be ready..." -ForegroundColor Yellow

# Wait for Docker to be ready
$maxAttempts = 30
$attempt = 0

do {
    Start-Sleep -Seconds 2
    $attempt++
    
    try {
        $null = docker ps 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Docker is ready!" -ForegroundColor Green
            break
        }
    } catch {
        # Continue waiting
    }
    
    Write-Host "Attempt $attempt/$maxAttempts - Docker not ready yet..." -ForegroundColor Yellow
    
} while ($attempt -lt $maxAttempts)

if ($attempt -ge $maxAttempts) {
    Write-Host "Docker did not become ready in time. Please check Docker Desktop manually." -ForegroundColor Red
    exit 1
}

Write-Host "Testing Docker connection..." -ForegroundColor Yellow
docker --version
docker-compose --version

Write-Host "Docker is ready to use!" -ForegroundColor Green
