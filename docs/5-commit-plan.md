# ПЛАН КОММИТОВ

## Соглашение о коммитах
Мы используем Conventional Commits:
- `feat:` - новая функциональность
- `fix:` - исправление ошибок
- `docs:` - документация
- `style:` - форматирование, стили
- `refactor:` - рефакторинг
- `perf:` - оптимизация
- `test:` - тесты
- `chore:` - обслуживание
- `ci:` - CI/CD

## Структура коммитов по этапам

### Этап 1: Инициализация
```
git commit -m "init: initialize project with README"
git commit -m "docs: add technical requirements document"
git commit -m "docs: add user stories and use cases"
git commit -m "docs: create project roadmap"
```

### Этап 2: Дизайн
```
git commit -m "design: create Figma mockups for landing page"
git commit -m "design: add student dashboard design"
git commit -m "design: add teacher dashboard design"
git commit -m "design: add parent dashboard design"
git commit -m "design: add institution dashboard design"
git commit -m "design: create design system (colors, typography)"
git commit -m "design: add kanban board design"
git commit -m "design: create tournament page design"
git commit -m "docs: add design specifications"
```

### Этап 3: Backend Foundation
```
git commit -m "feat: setup Node.js + Express with TypeScript"
git commit -m "feat: configure Prisma with PostgreSQL"
git commit -m "feat: add Redis configuration"
git commit -m "feat: implement user models with Prisma"
git commit -m "feat: add JWT authentication middleware"
git commit -m "feat: create registration and login endpoints"
git commit -m "feat: add refresh token mechanism"
git commit -m "feat: implement role-based access control"
git commit -m "test: add auth unit tests"
```

### Этап 4: Frontend Foundation
```
git commit -m "feat: initialize React + Vite + TypeScript"
git commit -m "style: configure Tailwind CSS"
git commit -m "feat: add React Router with routes"
git commit -m "feat: setup Redux Toolkit with user slice"
git commit -m "feat: create axios instance with interceptors"
git commit -m "feat: add auth pages (login, register)"
git commit -m "feat: implement protected routes by role"
git commit -m "style: add global styles and theme"
```

### Этап 5: Institution Module
```
git commit -m "feat: create institution models (institution, department)"
git commit -m "feat: add institution CRUD API"
git commit -m "feat: implement user management for institutions"
git commit -m "feat: add Excel import functionality"
git commit -m "feat: create institution dashboard UI"
git commit -m "feat: add hierarchical structure viewer"
git commit -m "feat: implement teacher and student lists"
git commit -m "feat: add class management"
git commit -m "test: add institution API tests"
```

### Этап 6: Teacher Module
```
git commit -m "feat: add course models (course, module, lesson)"
git commit -m "feat: implement course CRUD API"
git commit -m "feat: add file upload functionality"
git commit -m "feat: create course builder UI with drag-and-drop"
git commit -m "feat: add lesson editor with rich text"
git commit -m "feat: implement video upload and embedding"
git commit -m "feat: add test and question models"
git commit -m "feat: create test constructor UI"
git commit -m "feat: implement grading system"
git commit -m "feat: create teacher dashboard"
git commit -m "feat: add class roster view"
git commit -m "feat: implement grading interface"
```

### Этап 7: Student Module
```
git commit -m "feat: add enrollment models and API"
git commit -m "feat: implement progress tracking"
git commit -m "feat: create student dashboard"
git commit -m "feat: add course player UI"
git commit -m "feat: implement test taking interface"
git commit -m "feat: add gamification models (xp, level)"
git commit -m "feat: implement XP calculation logic"
git commit -m "feat: create achievement system"
git commit -m "feat: add achievements display"
git commit -m "feat: implement level progression UI"
git commit -m "style: add animations for achievements"
```

### Этап 8: Task Planner (Trello-like)
```
git commit -m "feat: add todo models and API"
git commit -m "feat: create kanban board component"
git commit -m "feat: implement drag-and-drop functionality"
git commit -m "feat: add task creation modal"
git commit -m "feat: implement priority system"
git commit -m "feat: add due dates and reminders"
git commit -m "feat: create task filters and search"
git commit -m "feat: integrate tasks with courses"
git commit -m "feat: add calendar view"
```

### Этап 9: Tournaments
```
git commit -m "feat: add tournament models"
git commit -m "feat: implement tournament CRUD API"
git commit -m "feat: add Redis for real-time leaderboards"
git commit -m "feat: create tournament UI"
git commit -m "feat: implement live leaderboard updates"
git commit -m "feat: add tournament registration"
git commit -m "feat: implement scoring system"
git commit -m "feat: create tournament results page"
git commit -m "feat: add global tournaments"
git commit -m "perf: optimize Redis queries"
```

### Этап 10: Parent Module
```
git commit -m "feat: add parent-child relationship models"
git commit -m "feat: implement parent API endpoints"
git commit -m "feat: create parent dashboard"
git commit -m "feat: add child progress view"
git commit -m "feat: implement grade notifications"
git commit -m "feat: add attendance tracking for parents"
git commit -m "feat: create motivation and rewards system"
git commit -m "feat: add parent-teacher chat"
```

### Этап 11: Communication
```
git commit -m "feat: setup Socket.io server"
git commit -m "feat: add chat models and API"
git commit -m "feat: create real-time chat UI"
git commit -m "feat: implement message notifications"
git commit -m "feat: add file sharing in chats"
git commit -m "feat: create notification models"
git commit -m "feat: implement notification queue"
git commit -m "feat: add email notifications"
git commit -m "feat: create notification center UI"
git commit -m "feat: add notification preferences"
```

### Этап 12: AI Assistant
```
git commit -m "feat: integrate OpenAI API"
git commit -m "feat: create AI service for recommendations"
git commit -m "feat: implement test generation AI"
git commit -m "feat: add university recommendation system"
git commit -m "feat: create AI chat interface"
git commit -m "feat: add homework help feature"
git commit -m "feat: implement course recommendations"
git commit -m "feat: add study tips generation"
```

### Этап 13: Payments
```
git commit -m "feat: integrate Stripe API"
git commit -m "feat: add subscription models"
git commit -m "feat: implement payment webhooks"
git commit -m "feat: create pricing page"
git commit -m "feat: add payment processing for courses"
git commit -m "feat: implement commission system"
git commit -m "feat: add transaction history"
git commit -m "feat: create teacher payout system"
```

### Этап 14: Testing & Optimization
```
git commit -m "test: add unit tests for auth module"
git commit -m "test: add integration tests for API"
git commit -m "test: add E2E tests with Cypress"
git commit -m "perf: optimize database queries"
git commit -m "perf: implement Redis caching"
git commit -m "perf: add lazy loading for components"
git commit -m "perf: optimize bundle size"
git commit -m "style: add micro-interactions and animations"
```

### Этап 15: Documentation & Deployment
```
git commit -m "docs: add API documentation with Swagger"
git commit -m "docs: create user manual"
git commit -m "docs: add admin guide"
git commit -m "chore: add seed data for demo"
git commit -m "ci: configure GitHub Actions"
git commit -m "ci: setup Docker deployment"
git commit -m "deploy: configure production server"
git commit -m "deploy: setup SSL certificate"
git commit -m "docs: update README with demo link"
git commit -m "chore: add presentation video"
```

## СТАТИСТИКА КОММИТОВ
- Всего коммитов: ~150-200
- Частота: 2-3 коммита в день
- Демонстрация активной разработки
