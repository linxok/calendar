# Makefile for Beauty Salon Calendar Project

.PHONY: help dev prod build up down restart logs clean install migrate seed test

# Variables
DOCKER_COMPOSE_DEV = docker-compose
DOCKER_COMPOSE_PROD = docker-compose -f docker-compose.prod.yml
ENV_FILE = .env

# Default target
help:
	@echo "Beauty Salon Calendar - Available Commands:"
	@echo ""
	@echo "Initial Setup:"
	@echo "  make init         - Initialize Laravel and Next.js projects (FIRST TIME ONLY)"
	@echo ""
	@echo "Development:"
	@echo "  make dev-setup    - Initial development setup (runs init if needed)"
	@echo "  make dev          - Start development environment"
	@echo "  make dev-build    - Build development images"
	@echo "  make dev-stop     - Stop development environment"
	@echo "  make dev-restart  - Restart development services"
	@echo "  make dev-logs     - View development logs"
	@echo ""
	@echo "Production:"
	@echo "  make prod-setup   - Initial production setup"
	@echo "  make prod         - Start production environment"
	@echo "  make prod-build   - Build production images"
	@echo "  make prod-stop    - Stop production environment"
	@echo "  make prod-restart - Restart production services"
	@echo "  make prod-logs    - View production logs"
	@echo ""
	@echo "Backend:"
	@echo "  make install      - Install backend dependencies"
	@echo "  make migrate      - Run database migrations"
	@echo "  make migrate-fresh - Fresh migrations with seed"
	@echo "  make seed         - Seed database"
	@echo "  make cache-clear  - Clear Laravel cache"
	@echo "  make optimize     - Optimize Laravel for production"
	@echo ""
	@echo "Database:"
	@echo "  make db-shell     - Connect to PostgreSQL shell"
	@echo "  make db-backup    - Backup database"
	@echo "  make db-restore   - Restore database from backup"
	@echo ""
	@echo "Testing:"
	@echo "  make test         - Run tests"
	@echo "  make test-coverage - Run tests with coverage"
	@echo ""
	@echo "Utilities:"
	@echo "  make shell-backend  - Open backend shell"
	@echo "  make shell-frontend - Open frontend shell"
	@echo "  make clean          - Remove all containers and volumes"
	@echo "  make ps             - Show running containers"

# ==========================================
# Initialization Commands
# ==========================================

init:
	@echo "🚀 Initializing projects..."
	@chmod +x init-project.sh
	@./init-project.sh
	@echo "✅ Initialization complete!"

# ==========================================
# Development Commands
# ==========================================

dev-setup:
	@echo "🚀 Setting up development environment..."
	@if [ ! -f $(ENV_FILE) ]; then cp .env.example $(ENV_FILE); fi
	$(DOCKER_COMPOSE_DEV) up -d
	@echo "⏳ Waiting for services to start..."
	@sleep 10
	$(DOCKER_COMPOSE_DEV) exec backend composer install
	$(DOCKER_COMPOSE_DEV) exec backend php artisan key:generate
	$(DOCKER_COMPOSE_DEV) exec backend php artisan storage:link
	$(DOCKER_COMPOSE_DEV) exec backend php artisan migrate
	$(DOCKER_COMPOSE_DEV) exec backend php artisan db:seed
	@echo "✅ Development environment ready!"
	@echo "📱 Frontend: http://localhost:3000"
	@echo "🔧 Backend API: http://localhost:8000/api"
	@echo "⚙️  Filament Admin: http://localhost:8000/admin"
	@echo "📧 Mailhog: http://localhost:8025"
	@echo "🗄️  Adminer: http://localhost:8080"

dev:
	@echo "🚀 Starting development environment..."
	$(DOCKER_COMPOSE_DEV) up -d
	@echo "✅ Development environment started!"

dev-build:
	@echo "🔨 Building development images..."
	$(DOCKER_COMPOSE_DEV) build

dev-stop:
	@echo "🛑 Stopping development environment..."
	$(DOCKER_COMPOSE_DEV) stop

dev-down:
	@echo "🗑️  Removing development containers..."
	$(DOCKER_COMPOSE_DEV) down

dev-restart:
	@echo "🔄 Restarting development environment..."
	$(DOCKER_COMPOSE_DEV) restart

dev-logs:
	$(DOCKER_COMPOSE_DEV) logs -f

dev-logs-backend:
	$(DOCKER_COMPOSE_DEV) logs -f backend nginx

dev-logs-frontend:
	$(DOCKER_COMPOSE_DEV) logs -f frontend

dev-logs-queue:
	$(DOCKER_COMPOSE_DEV) logs -f queue

# ==========================================
# Production Commands
# ==========================================

prod-setup:
	@echo "🚀 Setting up production environment..."
	@if [ ! -f .env.production ]; then \
		echo "❌ Error: .env.production not found!"; \
		echo "Create .env.production with production settings"; \
		exit 1; \
	fi
	$(DOCKER_COMPOSE_PROD) --env-file .env.production build
	$(DOCKER_COMPOSE_PROD) --env-file .env.production up -d
	@echo "⏳ Waiting for services to start..."
	@sleep 10
	$(DOCKER_COMPOSE_PROD) exec backend php artisan migrate --force
	$(DOCKER_COMPOSE_PROD) exec backend php artisan config:cache
	$(DOCKER_COMPOSE_PROD) exec backend php artisan route:cache
	$(DOCKER_COMPOSE_PROD) exec backend php artisan view:cache
	$(DOCKER_COMPOSE_PROD) exec backend php artisan optimize
	@echo "✅ Production environment ready!"

prod:
	@echo "🚀 Starting production environment..."
	$(DOCKER_COMPOSE_PROD) --env-file .env.production up -d
	@echo "✅ Production environment started!"

prod-build:
	@echo "🔨 Building production images..."
	$(DOCKER_COMPOSE_PROD) --env-file .env.production build --no-cache

prod-stop:
	@echo "🛑 Stopping production environment..."
	$(DOCKER_COMPOSE_PROD) stop

prod-down:
	@echo "🗑️  Removing production containers..."
	$(DOCKER_COMPOSE_PROD) down

prod-restart:
	@echo "🔄 Restarting production environment..."
	$(DOCKER_COMPOSE_PROD) restart

prod-logs:
	$(DOCKER_COMPOSE_PROD) logs -f --tail=100

prod-deploy:
	@echo "🚀 Deploying production updates..."
	$(DOCKER_COMPOSE_PROD) --env-file .env.production pull
	$(DOCKER_COMPOSE_PROD) --env-file .env.production up -d --build
	$(DOCKER_COMPOSE_PROD) exec backend php artisan migrate --force
	$(DOCKER_COMPOSE_PROD) exec backend php artisan optimize
	$(DOCKER_COMPOSE_PROD) restart queue
	@echo "✅ Production deployed!"

# ==========================================
# Backend Commands
# ==========================================

install:
	@echo "📦 Installing backend dependencies..."
	$(DOCKER_COMPOSE_DEV) exec backend composer install

migrate:
	@echo "🗄️  Running migrations..."
	$(DOCKER_COMPOSE_DEV) exec backend php artisan migrate

migrate-fresh:
	@echo "🗄️  Fresh migrations with seed..."
	$(DOCKER_COMPOSE_DEV) exec backend php artisan migrate:fresh --seed

seed:
	@echo "🌱 Seeding database..."
	$(DOCKER_COMPOSE_DEV) exec backend php artisan db:seed

cache-clear:
	@echo "🧹 Clearing cache..."
	$(DOCKER_COMPOSE_DEV) exec backend php artisan cache:clear
	$(DOCKER_COMPOSE_DEV) exec backend php artisan config:clear
	$(DOCKER_COMPOSE_DEV) exec backend php artisan route:clear
	$(DOCKER_COMPOSE_DEV) exec backend php artisan view:clear

optimize:
	@echo "⚡ Optimizing Laravel..."
	$(DOCKER_COMPOSE_DEV) exec backend php artisan config:cache
	$(DOCKER_COMPOSE_DEV) exec backend php artisan route:cache
	$(DOCKER_COMPOSE_DEV) exec backend php artisan view:cache
	$(DOCKER_COMPOSE_DEV) exec backend php artisan optimize

tinker:
	$(DOCKER_COMPOSE_DEV) exec backend php artisan tinker

queue-work:
	$(DOCKER_COMPOSE_DEV) exec backend php artisan queue:work

queue-restart:
	$(DOCKER_COMPOSE_DEV) restart queue

# ==========================================
# Database Commands
# ==========================================

db-shell:
	@echo "🗄️  Connecting to PostgreSQL..."
	$(DOCKER_COMPOSE_DEV) exec postgres psql -U calendar_user -d calendar_dev

db-backup:
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	$(DOCKER_COMPOSE_DEV) exec -T postgres pg_dump -U calendar_user calendar_dev > backups/backup-$(shell date +%Y%m%d-%H%M%S).sql
	@echo "✅ Backup created in backups/ directory"

db-restore:
	@echo "📥 Restoring database..."
	@read -p "Enter backup file path: " backup; \
	$(DOCKER_COMPOSE_DEV) exec -T postgres psql -U calendar_user calendar_dev < $$backup
	@echo "✅ Database restored"

# ==========================================
# Testing Commands
# ==========================================

test:
	@echo "🧪 Running tests..."
	$(DOCKER_COMPOSE_DEV) exec backend php artisan test

test-coverage:
	@echo "🧪 Running tests with coverage..."
	$(DOCKER_COMPOSE_DEV) exec backend php artisan test --coverage

test-parallel:
	@echo "🧪 Running tests in parallel..."
	$(DOCKER_COMPOSE_DEV) exec backend php artisan test --parallel

lint-backend:
	@echo "🔍 Linting backend code..."
	$(DOCKER_COMPOSE_DEV) exec backend ./vendor/bin/pint

lint-frontend:
	@echo "🔍 Linting frontend code..."
	$(DOCKER_COMPOSE_DEV) exec frontend pnpm lint

# ==========================================
# Utility Commands
# ==========================================

shell-backend:
	$(DOCKER_COMPOSE_DEV) exec backend sh

shell-frontend:
	$(DOCKER_COMPOSE_DEV) exec frontend sh

shell-postgres:
	$(DOCKER_COMPOSE_DEV) exec postgres sh

shell-redis:
	$(DOCKER_COMPOSE_DEV) exec redis sh

redis-cli:
	$(DOCKER_COMPOSE_DEV) exec redis redis-cli -a redis_secret

ps:
	$(DOCKER_COMPOSE_DEV) ps

stats:
	docker stats

clean:
	@echo "🧹 Cleaning up..."
	$(DOCKER_COMPOSE_DEV) down -v --remove-orphans
	@echo "✅ Cleanup complete!"

clean-all:
	@echo "⚠️  WARNING: This will remove all containers, volumes, and images!"
	@read -p "Are you sure? (y/N): " confirm; \
	if [ "$$confirm" = "y" ]; then \
		$(DOCKER_COMPOSE_DEV) down -v --rmi all --remove-orphans; \
		echo "✅ Everything cleaned!"; \
	fi

# ==========================================
# Frontend Commands
# ==========================================

frontend-install:
	@echo "📦 Installing frontend dependencies..."
	$(DOCKER_COMPOSE_DEV) exec frontend pnpm install

frontend-build:
	@echo "🔨 Building frontend..."
	$(DOCKER_COMPOSE_DEV) exec frontend pnpm build

frontend-dev:
	@echo "🚀 Starting frontend dev server..."
	$(DOCKER_COMPOSE_DEV) exec frontend pnpm dev

# ==========================================
# Monitoring
# ==========================================

logs-all:
	$(DOCKER_COMPOSE_DEV) logs -f

logs-errors:
	$(DOCKER_COMPOSE_DEV) logs -f | grep -i error

health:
	@echo "🏥 Health Check:"
	@echo ""
	@echo "Backend:"
	@curl -s http://localhost:8000/api/health || echo "❌ Backend not responding"
	@echo ""
	@echo "Frontend:"
	@curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend OK" || echo "❌ Frontend not responding"
	@echo ""
	@echo "Database:"
	@$(DOCKER_COMPOSE_DEV) exec postgres pg_isready -U calendar_user && echo "✅ Database OK" || echo "❌ Database not ready"
	@echo ""
	@echo "Redis:"
	@$(DOCKER_COMPOSE_DEV) exec redis redis-cli -a redis_secret ping && echo "✅ Redis OK" || echo "❌ Redis not responding"
