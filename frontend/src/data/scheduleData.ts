// ─── Types ────────────────────────────────────────────────────────────────────

export type EventColor = 'green' | 'orange' | 'blue' | 'purple' | 'red' | 'pink'

/** Событие расписания, создаётся учреждением или учителем */
export type ScheduleEvent = {
    id: string
    title: string
    subtitle?: string
    startHour: number   // 0–23
    startMin: number
    endHour: number
    endMin: number
    color: EventColor
    /** Кто создал: institution | teacher */
    createdBy: 'institution' | 'teacher'
    teacherName?: string
    room?: string
    /** ISO date string YYYY-MM-DD */
    date: string
}

/** Статусы карточки в канбан-доске */
export type KanbanStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'

export type KanbanCard = {
    id: string
    title: string
    description?: string
    status: KanbanStatus
    priority: 'low' | 'medium' | 'high'
    dueDate?: string    // YYYY-MM-DD
    tags: string[]
    color: EventColor
}

export type Reminder = {
    id: string
    title: string
    time: string
    iconColor: string
    iconBg: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function todayStr(): string {
    return new Date().toISOString().slice(0, 10)
}

function dateStr(offsetDays: number): string {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    return d.toISOString().slice(0, 10)
}

// ─── Mock schedule events ──────────────────────────────────────────────────────

export const scheduleEvents: ScheduleEvent[] = [
    // Today
    {
        id: 'e1', title: 'UI/UX Design', subtitle: 'Figma Prototype', createdBy: 'institution',
        startHour: 9, startMin: 0, endHour: 10, endMin: 30, color: 'green',
        teacherName: 'Nathael Roy', room: '201', date: dateStr(0),
    },
    {
        id: 'e2', title: 'Web Design', subtitle: 'HTML & CSS практика', createdBy: 'institution',
        startHour: 11, startMin: 0, endHour: 12, endMin: 30, color: 'orange',
        teacherName: 'Paris Liana', room: '104', date: dateStr(0),
    },
    {
        id: 'e3', title: 'Sketch Learning', subtitle: 'Vector basics', createdBy: 'teacher',
        startHour: 14, startMin: 0, endHour: 15, endMin: 30, color: 'blue',
        teacherName: 'Ellise Remmi', date: dateStr(0),
    },
    {
        id: 'e4', title: 'TypeScript', subtitle: 'Generics & Types', createdBy: 'institution',
        startHour: 16, startMin: 0, endHour: 17, endMin: 30, color: 'purple',
        teacherName: 'Аликхан Д.', room: '305', date: dateStr(0),
    },
    // Tomorrow
    {
        id: 'e5', title: 'React Advanced', subtitle: 'Hooks & Context', createdBy: 'institution',
        startHour: 10, startMin: 0, endHour: 11, endMin: 30, color: 'blue',
        teacherName: 'Nathael Roy', room: '201', date: dateStr(1),
    },
    {
        id: 'e6', title: 'UX Research', subtitle: 'User interviews', createdBy: 'institution',
        startHour: 13, startMin: 0, endHour: 14, endMin: 30, color: 'pink',
        teacherName: 'Paris Liana', room: '104', date: dateStr(1),
    },
    // Day +2
    {
        id: 'e7', title: 'Педагогика', subtitle: 'Методология обучения', createdBy: 'institution',
        startHour: 9, startMin: 0, endHour: 10, endMin: 30, color: 'orange',
        teacherName: 'Ellise Remmi', room: '301', date: dateStr(2),
    },
    // Day -1
    {
        id: 'e8', title: 'Python Basics', subtitle: 'Функции и классы', createdBy: 'institution',
        startHour: 11, startMin: 0, endHour: 12, endMin: 30, color: 'green',
        teacherName: 'Аликхан Д.', room: '201', date: dateStr(-1),
    },
]

// ─── Mock kanban cards ────────────────────────────────────────────────────────

export const initialKanbanCards: KanbanCard[] = [
    {
        id: 'k1', title: 'Подготовить презентацию по Figma',
        description: 'Сделать 15 слайдов с примерами компонентов',
        status: 'done', priority: 'high', dueDate: dateStr(-2), tags: ['Дизайн', 'Figma'], color: 'green',
    },
    {
        id: 'k2', title: 'Написать отчёт по дисциплине',
        description: 'Краткий отчёт за месяц: успеваемость, посещаемость',
        status: 'in_progress', priority: 'high', dueDate: dateStr(2), tags: ['Документы'], color: 'orange',
    },
    {
        id: 'k3', title: 'Изучить React 19 новшества',
        description: 'Прочитать официальный changelog и протестировать Actions',
        status: 'in_progress', priority: 'medium', dueDate: dateStr(5), tags: ['React', 'Учёба'], color: 'blue',
    },
    {
        id: 'k4', title: 'Проверить домашние задания',
        description: 'Оценить работы 8А: задание по модулю 3',
        status: 'todo', priority: 'high', dueDate: dateStr(1), tags: ['8А', 'Проверка'], color: 'purple',
    },
    {
        id: 'k5', title: 'Запланировать родительское собрание',
        description: 'Согласовать дату с администрацией',
        status: 'todo', priority: 'medium', dueDate: dateStr(7), tags: ['Родители'], color: 'pink',
    },
    {
        id: 'k6', title: 'Обновить учебный план',
        status: 'backlog', priority: 'low', tags: ['Планирование'], color: 'green',
    },
    {
        id: 'k7', title: 'Подать заявку на конференцию',
        description: 'EdTech Summit 2026 — дедлайн 20 апреля',
        status: 'backlog', priority: 'medium', dueDate: dateStr(19), tags: ['Карьера'], color: 'blue',
    },
    {
        id: 'k8', title: 'Пройти курс TypeScript Мастер',
        description: 'Осталось 3 модуля',
        status: 'review', priority: 'medium', dueDate: dateStr(4), tags: ['TypeScript', 'Учёба'], color: 'purple',
    },
    {
        id: 'k9', title: 'Оформить кабинет к новому семестру',
        status: 'backlog', priority: 'low', tags: ['Кабинет'], color: 'orange',
    },
]

// ─── Mock reminders ───────────────────────────────────────────────────────────

export const reminders: Reminder[] = [
    { id: 'r1', title: 'Web design test notice', time: '08:00 AM', iconColor: '#fff', iconBg: '#f97316' },
    { id: 'r2', title: 'Subscription expires', time: '15:00 PM', iconColor: '#fff', iconBg: '#43c38d' },
    { id: 'r3', title: 'Родительское собрание', time: '18:00 PM', iconColor: '#fff', iconBg: '#6c8cf8' },
]

// ─── Kanban column definitions ────────────────────────────────────────────────

export type KanbanColumn = {
    id: KanbanStatus
    label: string
    color: string
    bg: string
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
    { id: 'backlog', label: 'Бэклог', color: '#9099a8', bg: '#f1f5f9' },
    { id: 'todo', label: 'К выполнению', color: '#6c8cf8', bg: '#eef1ff' },
    { id: 'in_progress', label: 'В процессе', color: '#f97316', bg: '#fff7ed' },
    { id: 'review', label: 'На проверке', color: '#a855f7', bg: '#faf5ff' },
    { id: 'done', label: 'Готово', color: '#43c38d', bg: '#f0faf6' },
]

export const EVENT_COLORS: Record<EventColor, { bg: string; border: string; text: string }> = {
    green: { bg: '#e8faf2', border: '#43c38d', text: '#1a6b4a' },
    orange: { bg: '#fff4e8', border: '#f97316', text: '#7c3c0a' },
    blue: { bg: '#eef4ff', border: '#6c8cf8', text: '#1e42a0' },
    purple: { bg: '#f3eeff', border: '#a855f7', text: '#5b21b6' },
    red: { bg: '#fff0f0', border: '#ef4444', text: '#991b1b' },
    pink: { bg: '#fdf0f7', border: '#ec4899', text: '#831843' },
}

export const PRIORITY_LABELS: Record<KanbanCard['priority'], { label: string; color: string }> = {
    low: { label: 'Низкий', color: '#43c38d' },
    medium: { label: 'Средний', color: '#f97316' },
    high: { label: 'Высокий', color: '#ef4444' },
}
