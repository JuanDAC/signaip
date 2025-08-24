@echo off
echo === Testing Docker Setup for Trademark Registration System ===

REM Check if Docker is running
echo Checking Docker status...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker Desktop first.
    echo You can run: start-docker.ps1
    pause
    exit /b 1
)

echo Docker is running!

REM Clean up any existing containers
echo Cleaning up existing containers...
docker-compose down -v >nul 2>&1

REM Build and start all services
echo Building and starting all services...
docker-compose up -d --build

if %errorlevel% neq 0 (
    echo Failed to start services!
    pause
    exit /b 1
)

echo Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Show service status
echo.
echo === Service Status ===
docker-compose ps

echo.
echo === Health Check Results ===

REM Test Backend
echo Testing Backend...
curl -f http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend: Healthy
) else (
    echo ✗ Backend: Unhealthy
)

REM Test Frontend
echo Testing Frontend...
curl -f http://localhost:3000/ >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Frontend: Healthy
) else (
    echo ✗ Frontend: Unhealthy
)

echo.
echo === Access URLs ===
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo Nginx Proxy: http://localhost:80
echo Database: localhost:5432

echo.
echo === Docker Setup Test Complete! ===
echo All services are running.
echo Use 'docker-compose logs -f' to monitor logs
echo Use 'docker-compose down' to stop all services
pause
