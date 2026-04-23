# Quick Start Guide

## Перший запуск (одна команда)

```bash
# 1. Ініціалізувати проєкти Laravel та Next.js
make init

# 2. Запустити development середовище
make dev-setup
```

Готово! Доступ до сервісів:
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8000/api
- ⚙️ **Filament Admin**: http://localhost:8000/admin
- 📧 **Mailhog**: http://localhost:8025
- 🗄️ **Adminer**: http://localhost:8080

---

## Що відбувається при `make init`?

1. Створюється Laravel 11 проєкт в `backend/`
2. Створюється Next.js 14 проєкт з TypeScript в `frontend/`
3. Копіюється `.env.example` → `.env`

## Що відбувається при `make dev-setup`?

1. Запускаються Docker контейнери:
   - PostgreSQL 15 (база даних)
   - Redis 7 (кеш та черги)
   - Laravel Backend + Nginx
   - Next.js Frontend
   - Queue Worker
   - Scheduler
   - Mailhog (тестування email)
   - Adminer (GUI для БД)

2. Встановлюються залежності:
   - `composer install` для Laravel
   - Генерується `APP_KEY`
   - Створюється symlink для storage

3. Налаштовується база даних:
   - Запускаються міграції
   - Заповнюється тестовими даними (seeding)

4. Встановлюється Filament Admin Panel

---

## Корисні команди

### Щоденна робота
```bash
make dev           # Запустити
make dev-stop      # Зупинити
make dev-restart   # Перезапустити
make dev-logs      # Переглянути логи
```

### Laravel команди
```bash
make migrate       # Запустити міграції
make seed          # Заповнити БД даними
make tinker        # Laravel Tinker
make cache-clear   # Очистити кеш
```

### База даних
```bash
make db-shell      # PostgreSQL CLI
make db-backup     # Створити backup
```

### Shell доступ
```bash
make shell-backend   # Backend контейнер
make shell-frontend  # Frontend контейнер
```

### Тестування
```bash
make test          # Запустити тести
```

### Очищення
```bash
make clean         # Видалити контейнери та volumes
```

---

## Структура проєкту

```
calendar/
├── backend/              # Laravel 11 API
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── (Laravel код без Dockerfile)
├── frontend/             # Next.js 14 Frontend
│   ├── src/
│   │   ├── app/
│   │   └── components/
│   └── (Next.js код без Dockerfile)
├── docker/               # Docker конфігурація
│   ├── backend/
│   │   └── Dockerfile    # Backend Dockerfile
│   ├── frontend/
│   │   └── Dockerfile    # Frontend Dockerfile
│   ├── nginx/
│   │   ├── dev.conf
│   │   └── prod.conf
│   ├── php/
│   │   ├── php.ini
│   │   └── opcache.ini
│   └── supervisor/
│       └── supervisord.conf
├── docker-compose.yml    # Development
├── docker-compose.prod.yml # Production
├── Makefile              # Команди
├── init-project.sh       # Скрипт ініціалізації
├── .env                  # Змінні середовища
└── DOCKER.md            # Детальна документація
```

---

## Troubleshooting

### Помилка: "composer.json not found"
```bash
# Запустіть ініціалізацію
make init
```

### Порти зайняті
```bash
# Змініть порти в .env
BACKEND_PORT=8001
FRONTEND_PORT=3001
DB_PORT=5433
```

### Проблеми з правами доступу
```bash
# Linux: додайте свого користувача до групи docker
sudo usermod -aG docker $USER
newgrp docker
```

### Контейнери не запускаються
```bash
# Перебудувати з нуля
make clean
make dev-build
make dev-setup
```

### База даних недоступна
```bash
# Перевірити статус
make ps

# Переглянути логи PostgreSQL
docker-compose logs postgres
```

---

## Наступні кроки

1. **Налаштувати аутентифікацію**
   - Створити моделі та міграції для користувачів
   - Налаштувати Laravel Sanctum

2. **Створити API endpoints**
   - Контролери для запису
   - Контролери для майстрів
   - Контролери для послуг

3. **Налаштувати Filament Admin**
   - Resources для управління
   - Dashboard widgets

4. **Розробити Frontend**
   - Сторінка бронювання
   - Календар
   - Профіль користувача

5. **Інтегрувати комунікації**
   - Telegram Bot
   - Email notifications
   - SMS

Детальніше в `TASKS.md` та `DOCKER.md`
