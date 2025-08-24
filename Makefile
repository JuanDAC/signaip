.PHONY: help build up down logs clean test health

# Default target
help:
	@echo "Available commands:"
	@echo "  build    - Build all Docker images"
	@echo "  up       - Start all services"
	@echo "  down     - Stop all services"
	@echo "  logs     - Show logs for all services"
	@echo "  clean    - Remove all containers, images, and volumes"
	@echo "  test     - Run the complete Docker test suite"
	@echo "  health   - Check health of all services"
	@echo "  db       - Access PostgreSQL database"
	@echo "  backend  - Access backend container"
	@echo "  frontend - Access frontend container"

# Build all images
build:
	docker-compose build --no-cache

# Start all services
up:
	docker-compose up -d

# Start with logs
up-logs:
	docker-compose up

# Stop all services
down:
	docker-compose down

# Stop and remove volumes
down-v:
	docker-compose down -v

# Show logs
logs:
	docker-compose logs -f

# Show logs for specific service
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-postgres:
	docker-compose logs -f postgres

# Clean everything
clean:
	docker-compose down -v --rmi all
	docker system prune -a -f

# Run test suite
test:
	@echo "Running Docker test suite..."
	@if [ -f "test-docker.ps1" ]; then \
		powershell -ExecutionPolicy Bypass -File test-docker.ps1; \
	elif [ -f "test-docker.bat" ]; then \
		./test-docker.bat; \
	else \
		echo "Test script not found. Running basic test..."; \
		docker-compose up -d --build; \
		sleep 30; \
		docker-compose ps; \
	fi

# Check health
health:
	@echo "Checking service health..."
	@docker-compose ps
	@echo ""
	@echo "Testing endpoints..."
	@curl -f http://localhost:8000/health >/dev/null 2>&1 && echo "✓ Backend: Healthy" || echo "✗ Backend: Unhealthy"
	@curl -f http://localhost:3000/ >/dev/null 2>&1 && echo "✓ Frontend: Healthy" || echo "✗ Frontend: Unhealthy"
	@curl -f http://localhost:80/ >/dev/null 2>&1 && echo "✓ Nginx: Healthy" || echo "✗ Nginx: Unhealthy"

# Access containers
db:
	docker-compose exec postgres psql -U brands_user -d brands_db

backend:
	docker-compose exec backend bash

frontend:
	docker-compose exec frontend sh

# Development commands
dev-backend:
	docker-compose up backend -d --build

dev-frontend:
	docker-compose up frontend -d --build

# Restart specific service
restart-backend:
	docker-compose restart backend

restart-frontend:
	docker-compose restart frontend

restart-postgres:
	docker-compose restart postgres

# Show resource usage
stats:
	docker stats

# Show network info
network:
	docker network ls
	docker network inspect trademark_registration_brands_network
