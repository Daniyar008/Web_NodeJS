import { useEffect, useState } from 'react'
import {
    AlertTriangle, Bell, BookOpen, Brain, CalendarCheck, CheckCircle2,
    GraduationCap, MessageSquare, TrendingUp, Users, Zap,
} from 'lucide-react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'
import { useNavigate } from 'react-router-dom'
import { institution as instApi, type Institution } from '../lib/api'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

const KPIS = [
    { icon: Users, label: 'Учеников', value: '1 284', delta: '+82 за квартал', trend: 'up', color: 'blue' },
    { icon: GraduationCap, label: 'Учителей', value: '86', delta: '+4 новых в марте', trend: 'up', color: 'purple' },
    { icon: TrendingUp, label: 'Успеваемость', value: '4.32', delta: '+0.18 за 2 мес.', trend: 'up', color: 'green' },
    { icon: CalendarCheck, label: 'Посещаемость', value: '93%', delta: '+2.4% за месяц', trend: 'up', color: 'teal' },
    { icon: BookOpen, label: 'Активных курсов', value: '47', delta: '8 ожидают модерацию', trend: 'warn', color: 'orange' },
    { icon: AlertTriangle, label: 'Группа риска', value: '18', delta: '14 сняты с марта', trend: 'down', color: 'red' },
]

const WEEKLY = [
    { day: 'Пн', attend: 94, score: 4.4 },
    { day: 'Вт', attend: 91, score: 4.3 },
    { day: 'Ср', attend: 96, score: 4.5 },
    { day: 'Чт', attend: 89, score: 4.2 },
    { day: 'Пт', attend: 92, score: 4.3 },
]

const RISK_STUDENTS = [
    { name: 'Арман Беков', cls: '9А', reason: 'Падение GPA на 0.8', risk: 87, avatar: 'arman' },
    { name: 'Мадина Жаксы', cls: '8Б', reason: 'Пропуски 33% за месяц', risk: 82, avatar: 'madina' },
    { name: 'Тимур Назаров', cls: '9Б', reason: 'Низкая платформ. активность', risk: 74, avatar: 'timur' },
    { name: 'Адель Каупов', cls: '10А', reason: '3 двоечных оценки подряд', risk: 69, avatar: 'adel' },
]

const PRIORITIES = [
    { done: false, text: 'Закрыть вакансию учителя математики', tag: 'HR', color: 'red' },
    { done: true, text: 'Согласовать расписание 9–11 классов', tag: 'Учебная часть', color: 'green' },
    { done: false, text: 'Проверить 8 курсов, ожидающих модерации', tag: 'Курсы', color: 'orange' },
    { done: false, text: 'Отчёт нагрузки учителей для аттестации', tag: 'Отчёт', color: 'blue' },
    { done: true, text: 'Обновить правила чатов в системе', tag: 'Настройки', color: 'green' },
]

const FEED = [
    { icon: '📝', text: 'А. Сейтказина добавила новый модуль «ЕНТ 2026»', time: '12 мин назад', color: '#7c3aed' },
    { icon: '⚠️', text: 'AI выявил 3 новых ученика в группе риска', time: '1 ч назад', color: '#ef4444' },
    { icon: '✅', text: 'Расписание для 10А–11А утверждено', time: '3 ч назад', color: '#22c55e' },
    { icon: '💬', text: 'Получено уведомление от МО математики', time: '5 ч назад', color: '#0ea5e9' },
    { icon: '🎓', text: 'Новый учитель Н. Куаныш прошёл онбординг', time: 'Вчера', color: '#f59e0b' },
    { icon: '📊', text: 'Ежемесячный отчёт готов к экспорту', time: 'Вчера', color: '#8b5cf6' },
]

const EVENTS = [
    { date: '14 апр', title: 'Родительское собрание — 8-е классы', type: 'meeting', time: '18:00' },
    { date: '20 апр', title: 'Педсовет: итоги III четверти', type: 'council', time: '15:00' },
    { date: '25 апр', title: 'ЕНТ — пробное тестирование', type: 'exam', time: '09:00' },
    { date: '30 апр', title: 'Последний день III четверти', type: 'holiday', time: '' },
]

const EVENT_COLOR: Record<string, string> = {
    meeting: '#7c3aed', council: '#0ea5e9', exam: '#ef4444', holiday: '#22c55e',
}

export function InstitutionDashboardPage({ language, onLanguageChange }: Props) {
    const [priorities, setPriorities] = useState(PRIORITIES)
    const navigate = useNavigate()
    const [instName, setInstName] = useState('СОШ №14')
    const [memberCount, setMemberCount] = useState<number | null>(null)

    // Load institution info from API
    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    const list = await instApi.list()
                    if (cancelled || list.length === 0) return
                    const inst = list[0]
                    setInstName(inst.name)
                    if (inst._count) setMemberCount(inst._count.members)
                } catch { /* keep defaults */ }
            })()
        return () => { cancelled = true }
    }, [])

    const togglePriority = (i: number) =>
        setPriorities((prev) => prev.map((p, idx) => idx === i ? { ...p, done: !p.done } : p))

    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Дашборд учреждения"
            subtitle="Ключевые метрики, риски и задачи на неделю — апрель 2026"
            activePage="i-dashboard"
        >
            {/* ── Hero banner ─────────────────────────────────────── */}
            <div className="idb-hero">
                <div className="idb-hero-text">
                    <h2>Добро пожаловать, <span>{instName}</span></h2>
                    <p>Апрель 2026 · III четверть · неделя 6 из 8</p>
                </div>
                <div className="idb-hero-actions">
                    <button className="idb-hero-btn" onClick={() => navigate('/institution/analytics')}>
                        <Brain size={15} /> Полная аналитика
                    </button>
                    <button className="idb-hero-btn outline" onClick={() => navigate('/institution/communications')}>
                        <Bell size={15} /> Рассылка
                    </button>
                </div>
            </div>

            {/* ── KPI grid ────────────────────────────────────────── */}
            <div className="idb-kpi-grid">
                {KPIS.map((k) => (
                    <div className={`idb-kpi-card idb-kpi-${k.color}`} key={k.label}>
                        <div className="idb-kpi-icon"><k.icon size={20} /></div>
                        <div className="idb-kpi-body">
                            <span className="idb-kpi-val">{k.value}</span>
                            <span className="idb-kpi-label">{k.label}</span>
                            <span className={`idb-kpi-delta ${k.trend}`}>{k.delta}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Middle row: chart + priorities + events ─────────── */}
            <div className="idb-mid-row">

                {/* Weekly attendance chart */}
                <div className="idb-chart-card">
                    <div className="idb-card-head">
                        <h3>Посещаемость за неделю</h3>
                        <span className="idb-card-sub">Текущая учебная неделя</span>
                    </div>
                    <div className="idb-bar-chart">
                        {WEEKLY.map((w) => (
                            <div key={w.day} className="idb-bar-col">
                                <span className="idb-bar-val">{w.attend}%</span>
                                <div className="idb-bar-wrap">
                                    <div className="idb-bar" style={{ height: `${w.attend}%` }} />
                                </div>
                                <span className="idb-bar-lbl">{w.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Priorities */}
                <div className="idb-priority-card">
                    <div className="idb-card-head">
                        <h3>Задачи на неделю</h3>
                        <span className="idb-done-count">
                            {priorities.filter((p) => p.done).length}/{priorities.length} выполнено
                        </span>
                    </div>
                    <ul className="idb-task-list">
                        {priorities.map((p, i) => (
                            <li
                                key={i}
                                className={`idb-task-item ${p.done ? 'done' : ''}`}
                                onClick={() => togglePriority(i)}
                            >
                                <div className="idb-task-check">
                                    {p.done && <CheckCircle2 size={14} />}
                                </div>
                                <span className="idb-task-text">{p.text}</span>
                                <span className={`idb-task-tag idb-tag-${p.color}`}>{p.tag}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ── Bottom row: risk students + feed + events ─────────── */}
            <div className="idb-bottom-row">

                {/* Risk students */}
                <div className="idb-risk-card">
                    <div className="idb-card-head">
                        <h3><AlertTriangle size={14} className="idb-warn-icon" /> AI — Группа риска</h3>
                        <button className="idb-link-btn" onClick={() => navigate('/institution/analytics')}>
                            Все ({18})
                        </button>
                    </div>
                    <div className="idb-risk-list">
                        {RISK_STUDENTS.map((s) => (
                            <div key={s.name} className="idb-risk-row">
                                <img
                                    className="idb-risk-av"
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.avatar}`}
                                    alt={s.name}
                                />
                                <div className="idb-risk-info">
                                    <span className="idb-risk-name">{s.name}</span>
                                    <span className="idb-risk-reason">{s.reason}</span>
                                </div>
                                <div className="idb-risk-bar-wrap">
                                    <div className="idb-risk-bar" style={{ width: `${s.risk}%` }} />
                                    <span className="idb-risk-pct">{s.risk}%</span>
                                </div>
                                <span className={`idb-risk-cls ${s.risk >= 80 ? 'high' : 'mid'}`}>{s.cls}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity feed */}
                <div className="idb-feed-card">
                    <div className="idb-card-head">
                        <h3>Лента активности</h3>
                    </div>
                    <div className="idb-feed">
                        {FEED.map((f, i) => (
                            <div key={i} className="idb-feed-item">
                                <span className="idb-feed-icon">{f.icon}</span>
                                <div className="idb-feed-body">
                                    <p className="idb-feed-text">{f.text}</p>
                                    <p className="idb-feed-time">{f.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming events */}
                <div className="idb-events-card">
                    <div className="idb-card-head">
                        <h3>Ближайшие события</h3>
                    </div>
                    <div className="idb-event-list">
                        {EVENTS.map((e) => (
                            <div key={e.title} className="idb-event-row">
                                <div
                                    className="idb-event-dot"
                                    style={{ background: EVENT_COLOR[e.type] }}
                                />
                                <div className="idb-event-info">
                                    <span className="idb-event-title">{e.title}</span>
                                    <span className="idb-event-meta">{e.date}{e.time ? ` · ${e.time}` : ''}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="idb-quick-actions">
                        <button className="idb-qa-btn" onClick={() => navigate('/institution/users')}>
                            <Users size={13} /> Пользователи
                        </button>
                        <button className="idb-qa-btn" onClick={() => navigate('/institution/courses')}>
                            <BookOpen size={13} /> Курсы
                        </button>
                        <button className="idb-qa-btn" onClick={() => navigate('/institution/finance')}>
                            <Zap size={13} /> Финансы
                        </button>
                        <button className="idb-qa-btn" onClick={() => navigate('/institution/communications')}>
                            <MessageSquare size={13} /> Рассылка
                        </button>
                    </div>
                </div>
            </div>
        </InstitutionShellLayout>
    )
}
