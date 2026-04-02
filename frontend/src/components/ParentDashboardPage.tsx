import { useState } from 'react'
import { AlertTriangle, BookOpen, CheckCircle, MessageCircle, Star, TrendingDown, TrendingUp } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { ParentShellLayout } from './ParentShellLayout'
import { useNavigate } from 'react-router-dom'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

const CHILDREN = [
    { id: 1, name: 'Анна Иванова', cls: '8А', avatar: 'Anna', avg: 4.6, events: 3 },
    { id: 2, name: 'Миша Иванов', cls: '5Б', avatar: 'Mike', avg: 3.8, events: 1 },
]

const FEED = [
    { type: 'grade', icon: '📝', text: 'Анна получила 5 по математике (Сейтказина А.)', time: '15 мин назад' },
    { type: 'hw', icon: '📚', text: 'По физике задано: задачи №5–8, срок — завтра', time: '1 ч назад' },
    { type: 'achieve', icon: '🏆', text: 'Анна получила ачивку «Отличник недели»', time: '3 ч назад' },
    { type: 'event', icon: '📅', text: 'Родительское собрание 8А — 15 апреля в 18:00', time: 'Вчера' },
    { type: 'msg', icon: '💬', text: 'Учитель математики: Анна молодец!', time: 'Вчера' },
    { type: 'warn', icon: '⚠️', text: 'Пропуск урока химии без причины', time: '2 дня назад' },
]

const SUBJECTS = [
    { subj: 'Математика', teacher: 'А. Сейтказина', last: 5, avg: 4.8, trend: 'up', hw: true },
    { subj: 'Физика', teacher: 'Р. Байтенов', last: 4, avg: 4.2, trend: 'down', hw: false },
    { subj: 'Химия', teacher: 'Г. Ким', last: 5, avg: 4.6, trend: 'up', hw: true },
    { subj: 'История', teacher: 'Д. Серик', last: 4, avg: 4.2, trend: 'flat', hw: false },
    { subj: 'Русский язык', teacher: 'З. Абуова', last: 3, avg: 3.9, trend: 'down', hw: true },
    { subj: 'Литература', teacher: 'З. Абуова', last: 5, avg: 4.5, trend: 'flat', hw: false },
]

export function ParentDashboardPage({ language, onLanguageChange }: Props) {
    const [activeChild, setActiveChild] = useState(1)
    const navigate = useNavigate()
    const child = CHILDREN.find((c) => c.id === activeChild)!

    return (
        <ParentShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Обзор"
            subtitle={`Актуальная сводка по ${child.name}`}
            activePage="p-dashboard"
        >
            {/* ── Hero banner ─────────────────────────────────── */}
            <div className="pd-hero">
                <img
                    className="pd-hero-avatar"
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${child.avatar}`}
                    alt={child.name}
                />
                <div className="pd-hero-info">
                    <h2 className="pd-hero-name">{child.name}</h2>
                    <p className="pd-hero-class">{child.cls} класс · Апрель 2026 · III четверть</p>
                    <div className="pd-hero-tags">
                        <span className="pd-hero-tag green">Средний балл: {child.avg}</span>
                        <span className="pd-hero-tag blue">93% посещаемость</span>
                        <span className="pd-hero-tag purple">6 достижений</span>
                    </div>
                </div>
                {CHILDREN.length > 1 && (
                    <div className="pd-hero-switcher">
                        {CHILDREN.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                className={`pd-child-btn ${activeChild === c.id ? 'active' : ''}`}
                                onClick={() => setActiveChild(c.id)}
                            >
                                <img
                                    className="pd-child-av"
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.avatar}`}
                                    alt={c.name}
                                />
                                <span>{c.name}</span>
                                <span className="pd-child-cls">{c.cls}</span>
                                {c.events > 0 && <span className="pd-child-dot">{c.events}</span>}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* KPI widgets */}
            <div className="pd-kpi-row">
                <div className="pd-kpi green">
                    <TrendingUp size={18} />
                    <span className="pd-kpi-val">4.6</span>
                    <span className="pd-kpi-label">Средний балл</span>
                    <span className="pd-kpi-sub">Выше среднего по классу</span>
                </div>
                <div className="pd-kpi green">
                    <CheckCircle size={18} />
                    <span className="pd-kpi-val">93%</span>
                    <span className="pd-kpi-label">Посещаемость</span>
                    <span className="pd-kpi-sub">За текущий месяц</span>
                </div>
                <div className="pd-kpi yellow">
                    <BookOpen size={18} />
                    <span className="pd-kpi-val">78%</span>
                    <span className="pd-kpi-label">Выполнены ДЗ</span>
                    <span className="pd-kpi-sub">7 из 9 за неделю</span>
                </div>
                <div className="pd-kpi purple">
                    <Star size={18} />
                    <span className="pd-kpi-val">6</span>
                    <span className="pd-kpi-label">Достижений</span>
                    <span className="pd-kpi-sub">В этом месяце</span>
                </div>
            </div>

            <div className="pd-two-col">
                {/* Activity feed */}
                <div className="pd-card">
                    <div className="pd-card-head">
                        <h3>Лента событий</h3>
                        <select className="pd-filter-sel">
                            <option>Все</option>
                            <option>Оценки</option>
                            <option>ДЗ</option>
                            <option>Сообщения</option>
                        </select>
                    </div>
                    <div className="pd-feed">
                        {FEED.map((f, i) => (
                            <div key={i} className="pd-feed-item">
                                <span className="pd-feed-icon">{f.icon}</span>
                                <div className="pd-feed-body">
                                    <p className="pd-feed-text">{f.text}</p>
                                    <p className="pd-feed-time">{f.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Urgent actions */}
                <div className="pd-side-col">
                    <div className="pd-card">
                        <h3 className="pd-card-title">Требуют внимания</h3>
                        <div className="pd-alert-list">
                            <div className="pd-alert red">
                                <AlertTriangle size={14} />
                                <span>Пропуск химии без уважительной причины</span>
                            </div>
                            <div className="pd-alert yellow">
                                <BookOpen size={14} />
                                <span>ДЗ по математике не сдано (просрочено на 1 д.)</span>
                            </div>
                            <div className="pd-alert yellow">
                                <AlertTriangle size={14} />
                                <span>Средний балл по русскому снизился до 3.9</span>
                            </div>
                        </div>
                    </div>

                    <div className="pd-card">
                        <h3 className="pd-card-title">Быстрые действия</h3>
                        <div className="pd-quick-actions">
                            <button className="pd-qa-btn" onClick={() => navigate('/parent/chat')}>
                                <MessageCircle size={14} /> Написать учителю
                            </button>
                            <button className="pd-qa-btn" onClick={() => navigate('/parent/motivation')}>
                                <Star size={14} /> Поставить цель
                            </button>
                            <button className="pd-qa-btn" onClick={() => navigate('/parent/grades')}>
                                <TrendingUp size={14} /> Посмотреть оценки
                            </button>
                            <button className="pd-qa-btn" onClick={() => navigate('/parent/homework')}>
                                <BookOpen size={14} /> Домашние задания
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects table */}
            <div className="pd-card">
                <h3 className="pd-card-title">Текущая успеваемость</h3>
                <div className="pd-table-wrap">
                    <table className="pd-table">
                        <thead>
                            <tr>
                                <th>Предмет</th>
                                <th>Учитель</th>
                                <th>Посл. оценка</th>
                                <th>Средний балл</th>
                                <th>Тенденция</th>
                                <th>ДЗ сегодня</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SUBJECTS.map((s) => (
                                <tr key={s.subj}>
                                    <td className="pd-subj-name">{s.subj}</td>
                                    <td className="pd-muted">{s.teacher}</td>
                                    <td>
                                        <span className={`pd-grade ${s.last >= 5 ? 'hi' : s.last >= 4 ? 'mid' : 'lo'}`}>
                                            {s.last}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`pd-avg ${s.avg >= 4.5 ? 'hi' : s.avg >= 4.0 ? 'mid' : 'lo'}`}>
                                            {s.avg}
                                        </span>
                                    </td>
                                    <td>
                                        {s.trend === 'up'
                                            ? <TrendingUp size={14} style={{ color: '#22c55e' }} />
                                            : s.trend === 'down'
                                                ? <TrendingDown size={14} style={{ color: '#ef4444' }} />
                                                : <span className="pd-muted">—</span>}
                                    </td>
                                    <td>
                                        {s.hw
                                            ? <span className="pd-hw-yes">Есть</span>
                                            : <span className="pd-muted">Нет</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ParentShellLayout>
    )
}
