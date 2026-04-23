#!/bin/bash

# Initialization script for Calendar Booking System
# This script creates Laravel and Next.js projects

set -e

echo "🚀 Initializing Calendar Booking System..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create backend directory if it doesn't exist
if [ ! -d "backend" ]; then
    echo -e "${BLUE}Creating backend directory...${NC}"
    mkdir -p backend
fi

# Initialize Laravel project if composer.json doesn't exist
if [ ! -f "backend/composer.json" ]; then
    echo -e "${BLUE}Initializing Laravel 11 project...${NC}"
    
    # Create Laravel project directly in backend directory
    docker run --rm -v $(pwd):/app -w /app composer:latest \
        composer create-project --prefer-dist laravel/laravel:^11.0 backend-temp
    
    # Move files from temp to backend using Docker to avoid permission issues
    docker run --rm -v $(pwd):/app -w /app alpine:latest sh -c "
        mv /app/backend-temp/* /app/backend/ 2>/dev/null || true
        mv /app/backend-temp/.* /app/backend/ 2>/dev/null || true
        rm -rf /app/backend-temp
    "
    
    # Regenerate composer.lock with PHP 8.4 compatible versions
    echo -e "${BLUE}Regenerating composer.lock for PHP 8.4...${NC}"
    docker run --rm -v $(pwd)/backend:/app -w /app composer:latest \
        composer update --with-all-dependencies --no-scripts --no-interaction --prefer-dist
    
    echo -e "${GREEN}✅ Laravel project created${NC}"
else
    echo -e "${YELLOW}⚠️  Laravel project already exists, skipping...${NC}"
fi

# Create frontend directory if it doesn't exist
if [ ! -d "frontend" ]; then
    echo -e "${BLUE}Creating frontend directory...${NC}"
    mkdir -p frontend
fi

# Initialize Next.js project if package.json doesn't exist
if [ ! -f "frontend/package.json" ]; then
    echo -e "${BLUE}Initializing Next.js 14 project...${NC}"
    
    # Create Next.js project using Node image
    docker run --rm -v $(pwd):/app -w /app node:20-alpine sh -c "
        corepack enable pnpm && \
        cd /app && \
        pnpm create next-app@latest frontend-temp \
            --typescript \
            --tailwind \
            --app \
            --src-dir \
            --import-alias '@/*' \
            --no-git
    "
    
    # Move files from temp to frontend using Docker to avoid permission issues
    docker run --rm -v $(pwd):/app -w /app alpine:latest sh -c "
        mv /app/frontend-temp/* /app/frontend/ 2>/dev/null || true
        mv /app/frontend-temp/.* /app/frontend/ 2>/dev/null || true
        rm -rf /app/frontend-temp
    "
    
    echo -e "${GREEN}✅ Next.js project created${NC}"
else
    echo -e "${YELLOW}⚠️  Next.js project already exists, skipping...${NC}"
fi

# Copy Dockerfile to backend if not exists
if [ -f "backend/Dockerfile" ] && [ ! -f "backend/Dockerfile.bak" ]; then
    echo -e "${BLUE}Dockerfile already in backend directory${NC}"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
fi

echo ""
echo -e "${GREEN}✅ Project initialization complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Review and update .env file with your settings"
echo "2. Run: ${BLUE}make dev-setup${NC} to start development environment"
echo ""
