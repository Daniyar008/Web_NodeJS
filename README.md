# EduFuture — Образовательная платформа с геймификацией

> **MVP Этап 1** — Инфраструктура / Спринт 1: Настройка монорепо, Backend API (Express + Prisma + PostgreSQL), Frontend (React + Vite + Tailwind + Redux).

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

## Roadmap по спринтам

| Спринт | Состояние | Описание |
|--------|-----------|---------|
| 1 | ✅ Готово | Инфраструктура, Prisma, монорепо, Tailwind |
| 2 | 🔜 Следующий | JWT авторизация, ролевая модель |
| 3 | 📋 Планируется | Учреждение: структура, классы, импорт |
| 4 | 📋 Планируется | Учитель: курсы, уроки, тесты |
| 5 | 📋 Планируется | Ученик: запись, прогресс, геймификация |
| 6 | 📋 Планируется | Kanban-планировщик задач |
| 7 | 📋 Планируется | Турниры + Redis real-time |
| 8+ | 📋 Планируется | Родитель, AI, чаты, платежи |

## Безопасность

- Пароли хранятся только в виде bcrypt-хеша
- JWT access token (короткоживущий) + refresh token
- Helmet.js для HTTP security headers
- CORS настроен явно
- Все приватные ключи и пароли только через `.env` (не в VCS)
