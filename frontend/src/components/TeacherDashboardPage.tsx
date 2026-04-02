import { useState } from 'react'
import {
    Award,
    BookOpen,
    Star,
    TrendingUp,
    Users,
} from 'lucide-react'
import type { Language } from '../i18n/translations'
import { TeacherShellLayout } from './TeacherShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

const STATS = [
    { icon: <Users size={20} />, value: '247', label: 'Студентов', change: '+12 за месяц', up: true, color: '#6366f1' },
    { icon: <BookOpen size={20} />, value: '4', label: 'Активных курса', change: '1 на проверке', up: null, color: '#43c38d' },
    { icon: <Star size={20} />, value: '4.8', label: 'Средний рейтинг', change: '+0.2 за месяц', up: true, color: '#f59e0b' },
    { icon: <TrendingUp size={20} />, value: '52 000 ₸', label: 'Доход', change: '+8 400 ₸', up: true, color: '#ec4899' },
]

const UPCOMING = [
    { time: '10:00', title: 'Класс 8A — UI Fundamentals', type: 'class', count: 22 },
    { time: '13:30', title: 'Класс 9B — Product Design', type: 'class', count: 18 },
    { time: '15:30', title: 'Индивидуально — А. Нурмагамбет', type: 'individual', count: 1 },
]

const ACTIVITY = [
    { avatar: 'АТ', name: 'Аиша Тулегенова', action: 'сдала задание', subject: 'Landing redesign', time: '5 мин назад' },
    { avatar: 'НА', name: 'Нурсултан Ахметов', action: 'записался на курс', subject: 'Figma Advanced', time: '23 мин назад' },
    { avatar: 'ДС', name: 'Диана Сейткали', action: 'прошла тест', subject: 'UI Basics Quiz', time: '1 ч назад' },
    { avatar: 'МБ', name: 'Марат Берденов', action: 'оставил вопрос', subject: 'Module 2', time: '2 ч назад' },
    { avatar: 'ЗК', name: 'Зарина Кенжебаева', action: 'завершила урок', subject: 'Color Theory', time: '3 ч назад' },
]

const COURSES = [
    { title: 'Figma Basic to Advance', students: 98, lessons: 24, rating: 4.9, completion: 72 },
    { title: 'Graphic Design Pro', students: 74, lessons: 18, rating: 4.7, completion: 58 },
    { title: 'UI/UX Masterclass', students: 56, lessons: 30, rating: 4.8, completion: 81 },
    { title: 'Illustration Camp', students: 19, lessons: 12, rating: 4.6, completion: 44 },
]

export function TeacherDashboardPage({ language, onLanguageChange }: Props) {
    const [tab, setTab] = useState<'today' | 'week'>('today')

    return (
        <TeacherShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Дашборд"
            activePage="t-dashboard"
        >
            <div className="td-root">

                {/* ── Greeting ──────────────────────────────────────────────────── */}
                <div className="td-greeting">
                    <div>
                        <h2 className="td-greeting-title">Добро пожаловать, Айгерим! 👋</h2>
                        <p className="td-greeting-sub">Сегодня 3 занятия и 7 новых активностей от учеников.</p>
                    </div>
                    <div className="td-greeting-date">
                        <span className="td-greeting-day">Среда</span>
                        <span className="td-greeting-full">1 апреля 2026</span>
                    </div>
                </div>

                {/* ── Stats row ─────────────────────────────────────────────────── */}
                <div className="td-stats-row">
                    {STATS.map((s) => (
                        <div key={s.label} className="td-stat-card">
                            <div className="td-stat-icon" style={{ background: `${s.color}18`, color: s.color }}>
                                {s.icon}
                            </div>
                            <div className="td-stat-body">
                                <span className="td-stat-value">{s.value}</span>
                                <span className="td-stat-label">{s.label}</span>
                                <span className={`td-stat-change ${s.up === true ? 'up' : s.up === false ? 'down' : ''}`}>
                                    {s.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Main grid ─────────────────────────────────────────────────── */}
                <div className="td-grid">

                    {/* Left col */}
                    <div className="td-col">

                        {/* Upcoming classes */}
                        <div className="td-section">
                            <div className="td-section-head">
                                <span className="td-section-title">Ближайшие занятия</span>
                                <div className="td-tab-pills">
                                    <button type="button" className={tab === 'today' ? 'active' : ''} onClick={() => setTab('today')}>Сегодня</button>
                                    <button type="button" className={tab === 'week' ? 'active' : ''} onClick={() => setTab('week')}>Неделя</button>
                                </div>
                            </div>
                            <div className="td-classes">
                                {UPCOMING.map((c) => (
                                    <div key={c.title} className="td-class-item">
                                        <div className="td-class-time">{c.time}</div>
                                        <div className="td-class-body">
                                            <span className="td-class-title">{c.title}</span>
                                            <span className={`td-class-badge ${c.type}`}>
                                                {c.type === 'class' ? 'Группа' : 'Индивидуально'}
                                            </span>
                                        </div>
                                        <div className="td-class-count">{c.count} уч.</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course performance */}
                        <div className="td-section">
                            <span className="td-section-title">Эффективность курсов</span>
                            <div className="td-perf-table">
                                <div className="td-perf-head">
                                    <span>Курс</span>
                                    <span>Студентов</span>
                                    <span>Завершили</span>
                                    <span>Рейтинг</span>
                                </div>
                                {COURSES.map((c) => (
                                    <div key={c.title} className="td-perf-row">
                                        <span className="td-perf-name">{c.title}</span>
                                        <span>{c.students}</span>
                                        <div className="td-perf-progress">
                                            <div className="td-perf-bar" style={{ width: `${c.completion}%` }} />
                                            <span>{c.completion}%</span>
                                        </div>
                                        <span className="td-perf-rating">
                                            <Award size={12} /> {c.rating}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right col */}
                    <div className="td-col">

                        {/* Recent activity */}
                        <div className="td-section">
                            <span className="td-section-title">Последняя активность</span>
                            <div className="td-activity">
                                {ACTIVITY.map((a) => (
                                    <div key={a.name + a.time} className="td-activity-item">
                                        <div className="td-avatar">{a.avatar}</div>
                                        <div className="td-activity-body">
                                            <span className="td-activity-name">{a.name}</span>
                                            <span className="td-activity-desc">
                                                {a.action} · <em>{a.subject}</em>
                                            </span>
                                        </div>
                                        <span className="td-activity-time">{a.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div className="td-section td-quick">
                            <span className="td-section-title">Быстрые действия</span>
                            <div className="td-quick-grid">
                                <button type="button" className="td-quick-btn" onClick={() => window.location.assign('/teacher/courses/new')}>
                                    <BookOpen size={18} />
                                    Новый курс
                                </button>
                                <button type="button" className="td-quick-btn" onClick={() => window.location.assign('/teacher/students')}>
                                    <Users size={18} />
                                    Ученики
                                </button>
                                <button type="button" className="td-quick-btn" onClick={() => window.location.assign('/teacher/analytics')}>
                                    <TrendingUp size={18} />
                                    Аналитика
                                </button>
                                <button type="button" className="td-quick-btn" onClick={() => window.location.assign('/teacher/chat')}>
                                    <Star size={18} />
                                    Отзывы
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </TeacherShellLayout>
    )
}
