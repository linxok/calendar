# Quick Start Guide — Glow Studio

## 🚀 Перший запуск

### 1. Підготовка середовища

```bash
# Копіювати налаштування середовища
cp .env.example .env

# Перевірити змінні в .env (опціонально)
nano .env
```

### 2. Запуск контейнерів

```bash
# Запустити всі сервіси
make dev

# Або через Docker Compose
docker compose up -d
```

### 3. Ініціалізація backend (перший запуск)

```bash
# Встановити залежності Laravel
make shell-backend
# всередині контейнера:
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
exit
```

Готово! 🎉 Доступ до сервісів:

| Сервіс | URL |
|--------|-----|
| 🌐 **Frontend** | http://localhost:3000 |
| 🔧 **Backend API** | http://localhost:8000/api |
| ⚙️ **Filament Admin** | http://localhost:8000/admin |
| 📧 **Mailhog** | http://localhost:8025 |
| 🗄️ **Adminer** | http://localhost:8080 |

---

## 📋 Що запускається

- **PostgreSQL 15** — база даних
- **Redis 7** — кеш та черги
- **Laravel 11** — backend API (PHP 8.4)
- **Nginx** — reverse proxy
- **Next.js 16** — frontend (React 19 + TypeScript)
- **Queue Worker** — обробка завдань
- **Scheduler** — cron завдання
- **Mailhog** — тестування email
- **Adminer** — GUI для БД

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

## 🏗️ Структура проекту

```
calendar/
├── backend/              # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/   # API контролери
│   │   ├── Models/            # Eloquent моделі
│   │   └── Filament/          # Admin панель
│   ├── routes/api.php         # API роути
│   ├── database/
│   │   ├── migrations/        # Міграції
│   │   └── seeders/           # Seeders
│   └── bootstrap/
├── frontend/             # Next.js 16 + React 19
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   │   ├── page.tsx      # Головна сторінка
│   │   │   ├── booking/      # Онлайн-запис
│   │   │   ├── dashboard/    # Кабінет клієнта
│   │   │   ├── admin/        # Admin панель
│   │   │   ├── ai-assistant/ # AI чат
│   │   │   └── ...
│   │   ├── components/       # React компоненти
│   │   │   ├── ui/          # UI компоненти
│   │   │   ├── ai/          # AI компоненти
│   │   │   └── calendar/    # Календар
│   │   ├── lib/
│   │   │   └── api.ts       # API utility
│   │   └── app/globals.css   # Глобальні стилі
│   ├── public/
│   └── package.json
├── docker/               # Docker конфігурація
│   ├── backend/Dockerfile
│   ├── frontend/Dockerfile    # Використовує npm
│   ├── nginx/
│   └── php/
├── docker-compose.yml
├── docker-compose.prod.yml
├── Makefile
├── DESIGN_SYSTEM.md      # Дизайн-система
├── API.md              # Документація API
└── AI.md               # AI функціонал
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

### Frontend не запускається (проблеми з npm/pnpm)

Проект використовує **npm** (не pnpm) через сумісність з Node 20:

```bash
# Перебудувати frontend
make shell-frontend
rm -rf node_modules package-lock.json
npm install
exit
docker restart calendar_frontend_dev
```

### Проблеми з правами доступу (Linux)
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Контейнери не запускаються
```bash
# Очистити та перебудувати
make clean
docker system prune -f
docker compose build --no-cache
docker compose up -d
```

### База даних недоступна
```bash
# Перевірити статус
make ps

# Переглянути логи PostgreSQL
docker compose logs postgres

# Перезапустити БД
docker compose restart postgres
```

---

## ✅ Реалізований функціонал

### Backend (Laravel 11)
- ✅ API аутентифікація (Sanctum)
- ✅ CRUD для записів (Appointments)
- ✅ CRUD для майстрів (Masters)
- ✅ CRUD для послуг (Services)
- ✅ CRUD для розкладу (Schedules)
- ✅ AI-контролер (чат, рекомендації)
- ✅ Filament Admin панель

### Frontend (Next.js 16 + React 19)
- ✅ Сучасний дизайн з Tailwind CSS
- ✅ Головна сторінка з Hero-секцією
- ✅ Сторінка онлайн-запису (booking)
- ✅ Кабінет клієнта (dashboard)
- ✅ AI-асистент з чатом
- ✅ Admin панель (/admin/*)
- ✅ Календар перегляду
- ✅ Розклад майстра

### Дизайн-система
- ✅ Кольорова палітра (pink/rose/violet)
- ✅ Типографіка (Inter + Playfair Display)
- ✅ Анімації та glassmorphism
- ✅ Компоненти UI (Button, Card)

---

## 🎯 Наступні кроки

1. **AI інтеграція**
   - Підключити OpenAI/Anthropic API
   - Покращити рекомендації

2. **Повідомлення**
   - Telegram Bot інтеграція
   - Email/SMS сповіщення

3. **Календар**
   - Місячний вид (monthly view)
   - Експорт в Google Calendar

4. **Профіль**
   - Сторінка налаштувань (/profile)
   - Управління каналами зв'язку

Детальніше в `TASKS.md`
