import { useState } from 'react'
import {
    Award,
    BarChart3,
    BookOpen,
    Brain,
    Flame,
    TrendingUp,
} from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import type { Language } from '../i18n/translations'

/* ── Static data ─────────────────────────────────────────────────── */
const MONTHS = ['Сен', 'Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Мар']

const GRADES = [
    { month: 'Сен', avg: 4.1, color: '#3b82f6' },
    { month: 'Окт', avg: 4.3, color: '#3b82f6' },
    { month: 'Ноя', avg: 3.9, color: '#f59e0b' },
    { month: 'Дек', avg: 4.0, color: '#3b82f6' },
    { month: 'Янв', avg: 4.5, color: '#22c55e' },
    { month: 'Фев', avg: 4.6, color: '#22c55e' },
    { month: 'Мар', avg: 4.7, color: '#22c55e' },
]

interface Subject {
    name: string
    grade: number
    color: string
    trend: string
    trendUp: boolean
    lessons: number
    total: number
}

const SUBJECTS: Subject[] = [
    { name: 'Математика', grade: 5, color: '#f59e0b', trend: '+0.4', trendUp: true, lessons: 18, total: 20 },
    { name: 'Физика', grade: 4, color: '#3b82f6', trend: '+0.2', trendUp: true, lessons: 14, total: 18 },
    { name: 'Информатика', grade: 5, color: '#7c3aed', trend: '+0.6', trendUp: true, lessons: 22, total: 24 },
    { name: 'Химия', grade: 3, color: '#ef4444', trend: '-0.3', trendUp: false, lessons: 10, total: 16 },
    { name: 'Английский', grade: 4, color: '#10b981', trend: '+0.1', trendUp: true, lessons: 16, total: 20 },
    { name: 'История', grade: 4, color: '#ec4899', trend: '0.0', trendUp: true, lessons: 12, total: 14 },
]

interface KMapTopic {
    icon: string
    name: string
    status: 'mastered' | 'learning' | 'pending'
}

const KMAP: KMapTopic[] = [
    { icon: '∫', name: 'Интегралы', status: 'mastered' },
    { icon: "f'", name: 'Производные', status: 'mastered' },
    { icon: '∑', name: 'Суммы рядов', status: 'learning' },
    { icon: '≡', name: 'Равенства', status: 'mastered' },
    { icon: '⊕', name: 'Логика', status: 'learning' },
    { icon: 'λ', name: 'Функции', status: 'mastered' },
    { icon: '△', name: 'Геометрия', status: 'pending' },
    { icon: '⟂', name: 'Векторы', status: 'learning' },
    { icon: 'π', name: 'Тригонометрия', status: 'pending' },
    { icon: 'σ', name: 'Статистика', status: 'pending' },
    { icon: '∞', name: 'Пределы', status: 'learning' },
    { icon: '⊇', name: 'Множества', status: 'mastered' },
]

const STATUS_LABEL: Record<string, string> = {
    mastered: 'Освоено',
    learning: 'В процессе',
    pending: 'Не начато',
}

/* ── Component ─────────────────────────────────────────────────── */
type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function StudentProgressPage({ language, onLanguageChange }: Props) {
    const [activeSubject, setActiveSubject] = useState<string | null>(null)

    const maxGrade = 5
    const chartMax = 5

    return (
        <CourseShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Мой прогресс"
            activePage="progress"
        >
            <div className="prog-page">

                {/* Stats row */}
                <div className="prog-stats-row">
                    <div className="prog-stat-card">
                        <div className="prog-stat-icon">📊</div>
                        <div className="prog-stat-val">4.5</div>
                        <div className="prog-stat-label">Средний балл</div>
                        <div className="prog-stat-trend up"><TrendingUp size={11} /> +0.3 за месяц</div>
                    </div>
                    <div className="prog-stat-card">
                        <div className="prog-stat-icon">📚</div>
                        <div className="prog-stat-val">92</div>
                        <div className="prog-stat-label">Уроков пройдено</div>
                        <div className="prog-stat-trend up">из 112 всего</div>
                    </div>
                    <div className="prog-stat-card">
                        <div className="prog-stat-icon">🔥</div>
                        <div className="prog-stat-val">22</div>
                        <div className="prog-stat-label">Дней подряд</div>
                        <div className="prog-stat-trend up"><Flame size={11} /> рекорд: 28</div>
                    </div>
                    <div className="prog-stat-card">
                        <div className="prog-stat-icon">🏆</div>
                        <div className="prog-stat-val">12</div>
                        <div className="prog-stat-label">Ачивок получено</div>
                        <div className="prog-stat-trend up">из 20 всего</div>
                    </div>
                </div>

                {/* Body: 2 cols */}
                <div className="prog-body">
                    {/* Left */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Grade trend chart */}
                        <div className="prog-card">
                            <div className="prog-card-title">
                                <BarChart3 size={16} color="#3b82f6" />
                                Динамика оценок (средний балл по месяцам)
                            </div>
                            <div className="prog-chart">
                                {GRADES.map(g => (
                                    <div key={g.month} className="prog-bar-col">
                                        <span className="prog-bar-val">{g.avg}</span>
                                        <div
                                            className="prog-bar-body"
                                            style={{
                                                height: `${(g.avg / chartMax) * 120}px`,
                                                background: g.color,
                                                opacity: 0.85,
                                            }}
                                        />
                                        <span className="prog-bar-label">{g.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subject grades */}
                        <div className="prog-card">
                            <div className="prog-card-title">
                                <BookOpen size={16} color="#7c3aed" />
                                Оценки по предметам
                            </div>
                            {SUBJECTS.map(s => (
                                <div
                                    key={s.name}
                                    className="prog-subject-row"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setActiveSubject(s.name === activeSubject ? null : s.name)}
                                >
                                    <span className="prog-subject-dot" style={{ background: s.color }} />
                                    <span className="prog-subject-name">{s.name}</span>
                                    <div className="prog-subject-bar-wrap">
                                        <div className="prog-subject-bar">
                                            <div
                                                className="prog-subject-fill"
                                                style={{
                                                    width: `${(s.lessons / s.total) * 100}%`,
                                                    background: s.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <span
                                        className="prog-subject-grade"
                                        style={{ color: s.grade >= 4 ? '#22c55e' : s.grade === 3 ? '#f59e0b' : '#ef4444' }}
                                    >
                                        {s.grade}
                                    </span>
                                    <span
                                        className={`prog-subject-trend${s.trendUp ? ' up' : ' down'}`}
                                        style={{ fontSize: 12, fontWeight: 700, color: s.trendUp ? '#22c55e' : '#ef4444' }}
                                    >
                                        {s.trend}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Knowledge Map */}
                        <div className="prog-card">
                            <div className="prog-card-title">
                                <Brain size={16} color="#f59e0b" />
                                Карта знаний — Математика
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                                    <span key={k} style={{ fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <span style={{
                                            width: 10, height: 10, borderRadius: 3, display: 'inline-block',
                                            background: k === 'mastered' ? '#6ee7b7' : k === 'learning' ? '#fcd34d' : '#e2e8f0',
                                        }} />
                                        {v}
                                    </span>
                                ))}
                            </div>
                            <div className="prog-kmap-grid">
                                {KMAP.map(t => (
                                    <div key={t.name} className={`prog-kmap-cell ${t.status}`}>
                                        <span className="prog-kmap-icon">{t.icon}</span>
                                        <span className="prog-kmap-label">{t.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                        {/* Class comparison */}
                        <div className="prog-card">
                            <div className="prog-card-title">
                                <Award size={15} color="#f59e0b" />
                                Vs. класс (анонимно)
                            </div>
                            {SUBJECTS.slice(0, 4).map(s => (
                                <div key={s.name} style={{ marginBottom: 10 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>
                                        <span>{s.name}</span>
                                        <span style={{ color: s.grade >= 4 ? '#22c55e' : '#f59e0b' }}>
                                            Ты: {s.grade} | Класс: {(s.grade - 0.3).toFixed(1)}
                                        </span>
                                    </div>
                                    <div style={{ position: 'relative', height: 10, background: '#f1f5f9', borderRadius: 20, overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((s.grade - 0.3) / maxGrade) * 100}%`, background: '#e2e8f0', borderRadius: 20 }} />
                                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(s.grade / maxGrade) * 100}%`, background: s.color, borderRadius: 20, opacity: 0.85 }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Completed lessons by subject */}
                        <div className="prog-card">
                            <div className="prog-card-title" style={{ fontSize: 13 }}>
                                <BookOpen size={14} color="#10b981" />
                                Прохождение курсов
                            </div>
                            {SUBJECTS.map(s => (
                                <div key={s.name} style={{ marginBottom: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 3 }}>
                                        <span>{s.name}</span>
                                        <span style={{ color: s.color }}>{s.lessons}/{s.total}</span>
                                    </div>
                                    <div style={{ height: 5, background: '#f1f5f9', borderRadius: 20, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${(s.lessons / s.total) * 100}%`, background: s.color, borderRadius: 20 }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* AI Prediction hint */}
                        <div
                            className="prog-card"
                            style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', border: 'none' }}
                        >
                            <div className="prog-card-title" style={{ color: '#fff' }}>
                                🤖 AI-прогноз оценок
                            </div>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', margin: '0 0 12px', lineHeight: 1.5 }}>
                                При текущей динамике по итогам четверти ожидается:
                            </p>
                            {SUBJECTS.slice(0, 3).map(s => (
                                <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,.85)', fontWeight: 700, marginBottom: 5 }}>
                                    <span>{s.name}</span>
                                    <span style={{ color: '#6ee7b7' }}>→ {Math.min(5, s.grade + (s.trendUp ? 0.2 : -0.1)).toFixed(1)}</span>
                                </div>
                            ))}
                        </div>

                        {MONTHS && (
                            <div className="prog-card" style={{ background: '#f9fafb' }}>
                                <div className="prog-card-title" style={{ fontSize: 13 }}>
                                    📅 Активность (март)
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
                                    {Array.from({ length: 31 }, (_, i) => {
                                        const active = [1, 2, 3, 5, 6, 7, 8, 10, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 24, 25, 26, 28, 29, 30].includes(i + 1)
                                        return (
                                            <div
                                                key={i}
                                                title={`${i + 1} марта`}
                                                style={{
                                                    width: '100%', aspectRatio: '1',
                                                    borderRadius: 4,
                                                    background: active ? '#43c38d' : '#e5e7eb',
                                                    opacity: i >= 30 ? .3 : 1,
                                                }}
                                            />
                                        )
                                    })}
                                </div>
                                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>22 активных дня из 30</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CourseShellLayout>
    )
}
