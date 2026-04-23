# Docker Setup Guide

## Overview

Проект використовує Docker для розгортання в двох режимах:
- **Development** - з локальною PostgreSQL в Docker
- **Production** - з підключенням до зовнішньої PostgreSQL

---

## Вимоги

- Docker Engine 20.10+
- `docker-compose` binary available in PATH
- 4GB RAM (мінімум)
- 10GB вільного місця на диску

> Примітка: якщо `docker compose` у твоїй системі працює некоректно, використовуй
> саме `docker-compose` — саме його команди наведені нижче.

---

## Ініціалізація проєкту (ПЕРШИЙ РАЗ)

**ВАЖЛИВО:** Перед першим запуском Docker потрібно ініціалізувати Laravel та Next.js проєкти.

### Автоматична ініціалізація

```bash
make init
```

Ця команда:
- Створить Laravel 11 проєкт в `backend/`
- Створить Next.js 14 проєкт в `frontend/`
- Скопіює `.env.example` в `.env`

### Альтернатива: Ручна ініціалізація

Якщо скрипт не працює, можна створити проєкти вручну:

**Laravel:**
```bash
docker run --rm -v $(pwd):/app -w /app composer:latest \
    composer create-project --prefer-dist laravel/laravel:^11.0 backend
```

**Next.js:**
```bash
docker run --rm -v $(pwd):/app -w /app node:20-alpine sh -c "
    corepack enable pnpm && \
    pnpm create next-app@latest frontend \
        --typescript --tailwind --app --src-dir \
        --import-alias '@/*' --no-git
"
```

---

## Development Mode

### Перший запуск

1. **Клонувати репозиторій**
```bash
git clone <repository-url>
cd calendar
```

2. **Ініціалізувати проєкти** (якщо ще не зроблено)
```bash
make init
```

3. **Створити .env файл** (якщо не створено автоматично)
```bash
cp .env.example .env
```

4. **Налаштувати змінні в .env** (опціонально)
```env
APP_MODE=development
BACKEND_PORT=8000
FRONTEND_PORT=3000
DB_DATABASE=calendar_dev
DB_USERNAME=calendar_user
DB_PASSWORD=secret
REDIS_PASSWORD=redis_secret
```

4. **Запустити контейнери**
```bash
docker-compose up -d
```

5. **Встановити залежності backend**
```bash
docker-compose exec backend composer install
```

6. **Згенерувати ключ додатка**
```bash
docker-compose exec backend php artisan key:generate
```

7. **Запустити міграції**
```bash
docker-compose exec backend php artisan migrate
```

8. **Заповнити БД тестовими даними** (опціонально)
```bash
docker-compose exec backend php artisan db:seed
```

### Доступ до сервісів

| Сервіс | URL | Опис |
|--------|-----|------|
| Frontend | http://localhost:3000 | Next.js додаток |
| Backend API | http://localhost:8000/api | Laravel API |
| Filament Admin | http://localhost:8000/admin | Адмін панель |
| Mailhog | http://localhost:8025 | Email тестування |
| Adminer | http://localhost:8080 | PostgreSQL GUI |

### Корисні команди

**Переглянути логи:**
```bash
# Всі сервіси
docker-compose logs -f

# Конкретний сервіс
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f queue
```

**Зупинити контейнери:**
```bash
docker-compose stop
```

**Перезапустити сервіс:**
```bash
docker-compose restart backend
docker-compose restart frontend
```

**Виконати Laravel команду:**
```bash
docker-compose exec backend php artisan <command>

# Приклади:
docker-compose exec backend php artisan migrate:fresh --seed
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan queue:work
docker-compose exec backend php artisan tinker
```

**Виконати Composer команду:**
```bash
docker-compose exec backend composer <command>

# Приклади:
docker-compose exec backend composer install
docker-compose exec backend composer update
docker-compose exec backend composer require package/name
```

**Підключитися до PostgreSQL:**
```bash
docker-compose exec postgres psql -U calendar_user -d calendar_dev
```

**Підключитися до Redis CLI:**
```bash
docker-compose exec redis redis-cli -a redis_secret
```

**Відкрити shell в контейнері:**
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

**Очистити volumes (видалити всі дані):**
```bash
docker-compose down -v
```

### Налагодження

**Xdebug в PhpStorm/VSCode:**

Xdebug вже встановлено в dev образі. Налаштування:
- Host: `host.docker.internal`
- Port: `9003`
- IDE key: `PHPSTORM`

**Hot reload не працює:**
```bash
# Перевірте volumes в docker-compose.yml
# Перезапустіть frontend
docker-compose restart frontend
```

**Проблеми з правами доступу:**
```bash
# Виправити права на Laravel
docker-compose exec backend chown -R www-data:www-data /var/www/html/storage
docker-compose exec backend chown -R www-data:www-data /var/www/html/bootstrap/cache
```

---

## Production Mode

### Підготовка

1. **Створити .env для production**
```bash
cp .env.example .env.production
```

2. **Налаштувати змінні середовища**
```env
# Application
APP_MODE=production
APP_KEY=base64:YOUR_GENERATED_KEY
APP_DEBUG=false

# External Database
DB_HOST=your-db-host.com
DB_PORT=5432
DB_DATABASE=calendar_production
DB_USERNAME=prod_user
DB_PASSWORD=secure_password_here

# Redis (якщо external)
REDIS_HOST=your-redis-host.com
REDIS_PASSWORD=redis_secure_password

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# Ports
BACKEND_PORT=80
BACKEND_SSL_PORT=443
FRONTEND_PORT=3000
```

3. **Додати SSL сертифікати**
```bash
mkdir -p docker/nginx/ssl
# Помістити cert.pem та key.pem в docker/nginx/ssl/
```

### Запуск production

1. **Build образів**
```bash
docker-compose -f docker-compose.prod.yml build
```

2. **Запустити контейнери**
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

3. **Запустити міграції** (один раз)
```bash
docker-compose -f docker-compose.prod.yml exec backend php artisan migrate --force
```

4. **Очистити кеш та оптимізувати**
```bash
docker-compose -f docker-compose.prod.yml exec backend php artisan config:cache
docker-compose -f docker-compose.prod.yml exec backend php artisan route:cache
docker-compose -f docker-compose.prod.yml exec backend php artisan view:cache
docker-compose -f docker-compose.prod.yml exec backend php artisan optimize
```

### Моніторинг production

**Переглянути логи:**
```bash
docker-compose -f docker-compose.prod.yml logs -f --tail=100
```

**Перевірити статус:**
```bash
docker-compose -f docker-compose.prod.yml ps
```

**Перезапустити queue workers:**
```bash
docker-compose -f docker-compose.prod.yml restart queue
```

**Backup database** (якщо використовується зовнішня БД):
```bash
# З'єднання до зовнішньої БД
pg_dump -h your-db-host.com -U prod_user -d calendar_production > backup.sql
```

---

## Масштабування

### Збільшити кількість queue workers

**Development:**
```yaml
# В docker-compose.yml
queue:
  deploy:
    replicas: 3  # Додати це
```

**Production:**
```bash
docker-compose -f docker-compose.prod.yml up -d --scale queue=4
```

### Горизонтальне масштабування backend

**З Nginx load balancer:**
```bash
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

Оновити nginx конфіг для load balancing:
```nginx
upstream backend_upstream {
    server backend_1:9000;
    server backend_2:9000;
    server backend_3:9000;
}
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Copy files to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          source: "."
          target: "/var/www/calendar"
      
      - name: Deploy with Docker
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/calendar
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d --build
            docker-compose -f docker-compose.prod.yml exec -T backend php artisan migrate --force
            docker-compose -f docker-compose.prod.yml exec -T backend php artisan optimize
```

---

## Troubleshooting

### Контейнер не запускається

```bash
# Переглянути логи
docker-compose logs backend

# Перевірити статус
docker ps -a

# Перебудувати без кешу
docker-compose build --no-cache backend
```

### База даних недоступна

```bash
# Перевірити healthcheck
docker-compose ps

# Перевірити logs PostgreSQL
docker-compose logs postgres

# Перевірити з'єднання
docker-compose exec backend php artisan db:show
```

### Out of memory

```bash
# Збільшити memory limit в docker-compose
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
```

### Frontend не може підключитися до API

```bash
# Перевірити NEXT_PUBLIC_API_URL
docker-compose exec frontend env | grep API

# Перевірити network
docker network inspect calendar_network
```

### Queue jobs не виконуються

```bash
# Перевірити Redis з'єднання
docker-compose exec backend php artisan queue:monitor

# Restart queue workers
docker-compose restart queue

# Переглянути failed jobs
docker-compose exec backend php artisan queue:failed
```

---

## Безпека

### Production checklist

- [ ] Встановлено APP_DEBUG=false
- [ ] Згенеровано унікальний APP_KEY
- [ ] Використовуються сильні паролі для БД та Redis
- [ ] SSL сертифікати налаштовані
- [ ] Firewall налаштовано (тільки 80, 443 відкриті)
- [ ] Регулярні backups БД
- [ ] Логи ротуються
- [ ] Secrets не в git репозиторії
- [ ] Docker images з trusted sources
- [ ] Security updates застосовані

### Secrets Management

Використовуйте Docker secrets або HashiCorp Vault для production:

```yaml
secrets:
  db_password:
    external: true
  redis_password:
    external: true

services:
  backend:
    secrets:
      - db_password
      - redis_password
```

---

## Оновлення

### Оновити Laravel dependencies

```bash
docker-compose exec backend composer update
docker-compose restart backend
```

### Оновити Next.js dependencies

```bash
docker-compose exec frontend pnpm update
docker-compose restart frontend
```

### Оновити Docker images

```bash
docker-compose pull
docker-compose up -d
```

---

## Backup & Restore

### Backup PostgreSQL (dev)

```bash
docker-compose exec -T postgres pg_dump -U calendar_user calendar_dev > backup-$(date +%Y%m%d).sql
```

### Restore PostgreSQL (dev)

```bash
docker-compose exec -T postgres psql -U calendar_user calendar_dev < backup-20260407.sql
```

### Backup volumes

```bash
docker run --rm \
  -v calendar_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres-data-$(date +%Y%m%d).tar.gz /data
```

---

## Видалення

### Зупинити та видалити контейнери

```bash
docker-compose down
```

### Видалити контейнери та volumes

```bash
docker-compose down -v
```

### Видалити все (включно з образами)

```bash
docker-compose down -v --rmi all
```

---

## Додаткові ресурси

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Laravel Docker Best Practices](https://laravel.com/docs/deployment)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
