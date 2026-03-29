# EduFuture — образовательная платформа с геймификацией

> Текущее состояние: реализованы спринты 1-11 (auth, роли, курсы, ученик/родитель, planner, турниры, AI, чат/уведомления, платежи), плюс инфраструктурные задачи Sprint 12 (тесты, OpenAPI docs, seed, Docker, CI).

## Структура проекта

```
/
├── backend/               # Node.js + Express + TypeScript + Prisma
│   ├── src/
│   │   ├── app.ts         # Express app (middleware, routes)
│   │   ├── server.ts      # HTTP server entry
│   │   ├── config/env.ts  # Zod-validated env
│   │   ├── lib/prisma.ts  # Prisma client singleton
│   │   └── routes/        # Route handlers
│   ├── prisma/
│   │   ├── schema.prisma  # User, Role models
│   │   └── seed.ts        # Наполнение ролями
│   └── tsconfig.json
├── frontend/              # React + Vite + TypeScript + Tailwind
│   └── src/
│       ├── app/           # router.tsx, store.ts
│       ├── features/auth/ # Redux slice авторизации
│       ├── layouts/       # MainLayout
│       └── pages/         # Landing, Login, Dashboard, 404
├── docs/                  # Документация
└── package.json           # npm workspaces root
```

## Требования

- **Node.js** >= 20
- **PostgreSQL** >= 15 (локальная база или Neon / Supabase)
- **npm** >= 10

## Быстрый старт

### 1. Склонируй репозиторий
```bash
git clone <URL>
cd edufuture-platform
npm install
```

### 2. Настрой базу данных

Создай базу данных PostgreSQL:
```sql
CREATE DATABASE edufuture;
```

Скопируй файл переменных окружения backend и заполни данные:
```bash
cp backend/.env.example backend/.env
```

Отредактируй `backend/.env`:
```ini
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/edufuture?schema=public"
JWT_ACCESS_SECRET="very-long-random-secret-at-least-32-chars"
JWT_REFRESH_SECRET="another-very-long-random-secret-here"
```

### 3. Выполни миграцию и seed
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
```

Это создаст таблицы и добавит 4 роли: `INSTITUTION_ADMIN`, `TEACHER`, `STUDENT`, `PARENT`.

### 4. Запусти Backend
```bash
# В корне проекта
npm run dev:backend

# API доступно на http://localhost:4000
# Health check: GET http://localhost:4000/api/health
```

### 5. Запусти Frontend
```bash
npm run dev:frontend

# Открой браузер: http://localhost:5173
```

## npm Scripts (root)

| Команда | Описание |
|---------|----------|
| `npm run dev:backend` | Backend в dev-режиме с hot-reload |
| `npm run build:backend` | Сборка TS → JS в `backend/dist/` |
| `npm run dev:frontend` | Frontend dev-сервер Vite |
| `npm run build:frontend` | Production build frontend |
| `npm run build` | Сборка backend + frontend |
| `npm run test` | Backend тесты (Jest + Supertest) |
| `npm run seed` | Заполнение БД демо-данными |

### Backend scripts

| Команда | Описание |
|---------|----------|
| `npm run test --workspace backend` | Интеграционные тесты API |
| `npm run docs:openapi --workspace backend` | Вывод OpenAPI JSON |
| `npm run prisma:seed --workspace backend` | Демо-данные (пользователи, курс, тариф) |

## API документация

- Swagger UI: `GET /api/docs`
- Health check: `GET /api/health`

## Docker запуск

```bash
docker compose up --build
```

Сервисы после запуска:
- frontend: `http://localhost:5173`
- backend: `http://localhost:4000`
- swagger: `http://localhost:4000/api/docs`
- postgres: `localhost:5432`
- redis: `localhost:6379`

## Стек технологий

### Backend
| Пакет | Версия | Назначение |
|-------|--------|-----------|
| Express | 5.x | HTTP-сервер |
| Prisma | 6.x | ORM + миграции |
| TypeScript | 6.x | Типизация |
| Zod | 4.x | Валидация env |
| bcrypt | 6.x | Хеширование паролей |
| jsonwebtoken | 9.x | JWT токены |

### Frontend
| Пакет | Версия | Назначение |
|-------|--------|-----------|
| React | 19.x | UI |
| Vite | 8.x | Bundler |
| Tailwind CSS | 3.x | Стили |
| React Router | 6.x | Routing |
| Redux Toolkit | 2.x | State management |
| Axios | 1.x | HTTP client |

## API эндпоинты (текущие)

| Метод | URL | Описание |
|-------|-----|---------|
| `GET` | `/api/health` | Проверка работоспособности |

> Следующий спринт: добавим `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`.

## Прогресс по спринтам

| Спринт | Состояние | Описание |
|--------|-----------|---------|
| 1 | ✅ | Инфраструктура, Prisma, монорепо, Tailwind |
| 2 | ✅ | JWT авторизация, ролевая модель |
| 3 | ✅ | Учреждение: структура и управление |
| 4 | ✅ | Учитель: курсы, уроки, тесты, задания |
| 5 | ✅ | Ученик: запись, прогресс, геймификация |
| 6 | ✅ | Planner / Kanban задачи |
| 7 | ✅ | Турниры + real-time leaderboard |
| 8 | ✅ | Родительский модуль + мотивация + сообщения |
| 9 | ✅ | AI ассистент |
| 10 | ✅ | Чат и уведомления |
| 11 | ✅ | Платежи, подписки, комиссия |
| 12 | 🔄 | Тестирование, оптимизация, документация, seed, deploy |

## Безопасность

- Пароли хранятся только в виде bcrypt-хеша
- JWT access token (короткоживущий) + refresh token
- Helmet.js для HTTP security headers
- CORS настроен явно
- Все приватные ключи и пароли только через `.env` (не в VCS)
