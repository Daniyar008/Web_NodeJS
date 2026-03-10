# EduFuture - Образовательная платформа с геймификацией

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen)

## 📚 О проекте

**EduFuture** - это современная образовательная платформа, объединяющая учреждения образования, учителей, учеников и родителей. Главная особенность - геймификация учебного процесса и персонализированный подход к обучению.

### 🎯 Ключевые возможности

| Для учреждений | Для учителей | Для учеников | Для родителей |
|----------------|--------------|--------------|---------------|
| Управление структурой | Создание курсов | Геймифицированное обучение | Мониторинг успеваемости |
| Импорт пользователей | Система тестов | Планировщик задач (Trello-like) | Мотивационная система |
| Статистика и аналитика | Персонализация обучения | Турниры и достижения | Чат с учителями |
| Учебные планы | Публичный профиль | Рекомендации курсов | Уведомления об оценках |

### 🏆 Геймификация
- Система уровней и опыта
- Достижения и награды
- Турниры между классами и учреждениями
- Рейтинги и таблицы лидеров

### 🤖 AI-ассистент
- Помощь с домашними заданиями
- Генерация тестов для учителей
- Рекомендации университетов
- Персональные советы

## 🛠 Технологический стек

### Frontend
- **React 18** + TypeScript
- **Vite** - быстрая сборка
- **Tailwind CSS** - стилизация
- **Redux Toolkit** - управление состоянием
- **React Router v6** - навигация
- **React Beautiful DnD** - drag-and-drop
- **Recharts** - графики и аналитика
- **Socket.io-client** - real-time

### Backend
- **Node.js** + Express
- **PostgreSQL** + Supabase
- **Prisma ORM** - работа с БД
- **Redis** - кэширование, real-time
- **Socket.io** - вебсокеты
- **BullMQ** - очередь задач
- **JWT** - аутентификация

### DevOps
- **Docker** - контейнеризация
- **GitHub Actions** - CI/CD
- **Supabase Storage** - файлы
- **Stripe** - платежи

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- npm или yarn

### Установка

1. Клонировать репозиторий
```bash
git clone https://github.com/yourusername/edufuture.git
cd edufuture
```

2. Установить зависимости
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. Настройка окружения
```bash
# Backend (.env)
cp server/.env.example server/.env
# Заполните своими данными

# Frontend (.env)
cp client/.env.example client/.env
```

4. Запуск с Docker
```bash
docker-compose up -d
```

5. Заполнение тестовыми данными
```bash
cd server
npm run seed
```

6. Запуск в режиме разработки
```bash
# Backend
npm run dev

# Frontend
cd client
npm run dev
```

## 📁 Структура проекта

```
edufuture/
├── client/                 # React frontend
│   ├── public/            # Статические файлы
│   ├── src/
│   │   ├── components/    # UI компоненты
│   │   ├── pages/         # Страницы
│   │   ├── hooks/         # Кастомные хуки
│   │   ├── store/         # Redux store
│   │   ├── services/      # API сервисы
│   │   ├── utils/         # Утилиты
│   │   └── types/         # TypeScript типы
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Контроллеры
│   │   ├── models/        # Prisma модели
│   │   ├── routes/        # Маршруты
│   │   ├── middleware/    # Middleware
│   │   ├── services/      # Бизнес-логика
│   │   ├── utils/         # Вспомогательные функции
│   │   └── types/         # TypeScript типы
│   ├── prisma/            # Prisma schema
│   └── package.json
│
├── docs/                   # Документация
│   ├── 1-technical-requirements.md
│   ├── 2-figma-design-spec.md
│   ├── 3-database-schema.md
│   ├── 4-development-plan.md
│   └── 5-commit-plan.md
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 📊 База данных

Основные модели:
- **User** - пользователи всех ролей
- **Institution** - учреждения образования
- **Course** - курсы и материалы
- **Tournament** - турниры и соревнования
- **Todo** - задачи (Trello-like)
- **Achievement** - достижения
- **Message** - сообщения чата

[Полная схема базы данных](docs/3-database-schema.md)

## 🎨 Дизайн в Figma

[Ссылка на макеты в Figma](https://figma.com/your-project)

Дизайн включает:
- Дизайн-систему (цвета, типографика)
- Все ключевые страницы для каждой роли
- Адаптивные макеты
- Анимации и микро-взаимодействия

## 📝 План разработки

Проект разделен на 12 спринтов (90 дней):

1. **Спринт 1-2**: Настройка инфраструктуры, аутентификация
2. **Спринт 3-4**: Модули учреждения и учителя
3. **Спринт 5-6**: Модуль ученика и планировщик задач
4. **Спринт 7-8**: Турниры и родительский модуль
5. **Спринт 9-10**: AI-ассистент и коммуникации
6. **Спринт 11-12**: Платежи и финальная полировка

[Детальный план по спринтам](docs/4-development-plan.md)

## 🔐 Безопасность

- JWT аутентификация с refresh токенами
- Шифрование паролей (bcrypt)
- Role-based access control
- Защита от XSS и CSRF
- Rate limiting
- Валидация данных

## 📈 Мониторинг

- Логирование ошибок (Sentry)
- Метрики производительности
- Мониторинг API (Grafana)
- Алерты о сбоях

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте ветку (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'feat: add amazing feature'`)
4. Push в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License - используйте для любых целей

## 📞 Контакты

- Автор: [Ваше имя]
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)
- Демо: [https://edufuture-demo.com](https://edufuture-demo.com)

## 🙏 Благодарности

- Всем учителям и ученикам, вдохновившим на создание
- Open-source сообществу за инструменты
- Проверяющим за обратную связь
