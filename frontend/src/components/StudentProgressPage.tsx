import { useEffect, useState } from 'react'
import {
    BarChart3,
    BookOpen,
    Brain,
    Flame,
    TrendingUp,
} from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import { student } from '../lib/api'
import type { EnrolledCourse } from '../lib/api'
import type { Language } from '../i18n/translations'

/* ── Types ─────────────────────────────────────────────────────── */
interface CourseProgress {
    name: string
    color: string
    lessons: number
    total: number
}

const COLORS = ['#f59e0b', '#3b82f6', '#7c3aed', '#ef4444', '#10b981', '#ec4899', '#6366f1', '#14b8a6']

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

function enrolledToProgress(e: EnrolledCourse, idx: number): CourseProgress {
    const completed = e.progress?.filter(p => p.completed).length ?? 0
    const total = e.progress?.length ?? 0
    return {
        name: e.course.title,
        color: COLORS[idx % COLORS.length],
        lessons: completed,
        total: Math.max(total, 1),
    }
}

/* ── Component ─────────────────────────────────────────────────── */
type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function StudentProgressPage({ language, onLanguageChange }: Props) {
    const [courses, setCourses] = useState<CourseProgress[]>([])
    const [streak, setStreak] = useState(0)
    const [achUnlocked, setAchUnlocked] = useState(0)
    const [achTotal, setAchTotal] = useState(0)

    useEffect(() => {
        student.coursesEnrolled().then(enrolled => {
            setCourses(enrolled.map((e, i) => enrolledToProgress(e, i)))
        }).catch(() => { })
        student.me().then(p => {
            setStreak(p.gamification.streak)
        }).catch(() => { })
        student.achievements().then(data => {
            setAchTotal(data.all.length)
            setAchUnlocked(data.unlockedIds.length)
        }).catch(() => { })
    }, [])

    const totalLessons = courses.reduce((s, c) => s + c.lessons, 0)
    const totalAll = courses.reduce((s, c) => s + c.total, 0)
    const avgPercent = totalAll > 0 ? Math.round((totalLessons / totalAll) * 100) : 0

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
                        <div className="prog-stat-val">{avgPercent}%</div>
                        <div className="prog-stat-label">Средний прогресс</div>
                        <div className="prog-stat-trend up"><TrendingUp size={11} /> по всем курсам</div>
                    </div>
                    <div className="prog-stat-card">
                        <div className="prog-stat-icon">📚</div>
                        <div className="prog-stat-val">{totalLessons}</div>
                        <div className="prog-stat-label">Уроков пройдено</div>
                        <div className="prog-stat-trend up">из {totalAll} всего</div>
                    </div>
                    <div className="prog-stat-card">
                        <div className="prog-stat-icon">🔥</div>
                        <div className="prog-stat-val">{streak}</div>
                        <div className="prog-stat-label">Дней подряд</div>
                        <div className="prog-stat-trend up"><Flame size={11} /> серия</div>
                    </div>
                    <div className="prog-stat-card">
                        <div className="prog-stat-icon">🏆</div>
                        <div className="prog-stat-val">{achUnlocked}</div>
                        <div className="prog-stat-label">Ачивок получено</div>
                        <div className="prog-stat-trend up">из {achTotal} всего</div>
                    </div>
                </div>

                {/* Body: 2 cols */}
                <div className="prog-body">
                    {/* Left */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Course completion chart */}
                        <div className="prog-card">
                            <div className="prog-card-title">
                                <BarChart3 size={16} color="#3b82f6" />
                                Прогресс по курсам
                            </div>
                            <div className="prog-chart">
                                {courses.map(c => {
                                    const pct = c.total > 0 ? Math.round((c.lessons / c.total) * 100) : 0
                                    return (
                                        <div key={c.name} className="prog-bar-col">
                                            <span className="prog-bar-val">{pct}%</span>
                                            <div
                                                className="prog-bar-body"
                                                style={{
                                                    height: `${(pct / 100) * 120}px`,
                                                    background: c.color,
                                                    opacity: 0.85,
                                                }}
                                            />
                                            <span className="prog-bar-label" style={{ fontSize: 9 }}>{c.name.slice(0, 8)}</span>
                                        </div>
                                    )
                                })}
                                {courses.length === 0 && (
                                    <div style={{ color: '#9ca3af', fontSize: 13, padding: 20, textAlign: 'center', width: '100%' }}>
                                        Запишитесь на курсы, чтобы видеть прогресс
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Course details */}
                        <div className="prog-card">
                            <div className="prog-card-title">
                                <BookOpen size={16} color="#7c3aed" />
                                Детали по курсам
                            </div>
                            {courses.map(c => (
                                <div
                                    key={c.name}
                                    className="prog-subject-row"
                                >
                                    <span className="prog-subject-dot" style={{ background: c.color }} />
                                    <span className="prog-subject-name">{c.name}</span>
                                    <div className="prog-subject-bar-wrap">
                                        <div className="prog-subject-bar">
                                            <div
                                                className="prog-subject-fill"
                                                style={{
                                                    width: `${(c.lessons / c.total) * 100}%`,
                                                    background: c.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <span className="prog-subject-grade" style={{ color: '#6b7280', fontSize: 11 }}>
                                        {c.lessons}/{c.total}
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

                        {/* Course progress bars */}
                        <div className="prog-card">
                            <div className="prog-card-title" style={{ fontSize: 13 }}>
                                <BookOpen size={14} color="#10b981" />
                                Прохождение курсов
                            </div>
                            {courses.map(c => (
                                <div key={c.name} style={{ marginBottom: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 3 }}>
                                        <span>{c.name}</span>
                                        <span style={{ color: c.color }}>{c.lessons}/{c.total}</span>
                                    </div>
                                    <div style={{ height: 5, background: '#f1f5f9', borderRadius: 20, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${(c.lessons / c.total) * 100}%`, background: c.color, borderRadius: 20 }} />
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
                                🤖 AI-прогноз
                            </div>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', margin: '0 0 12px', lineHeight: 1.5 }}>
                                При текущей динамике по итогам четверти ожидается:
                            </p>
                            {courses.slice(0, 3).map(c => {
                                const pct = c.total > 0 ? Math.round((c.lessons / c.total) * 100) : 0
                                return (
                                    <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,.85)', fontWeight: 700, marginBottom: 5 }}>
                                        <span>{c.name}</span>
                                        <span style={{ color: '#6ee7b7' }}>→ {pct}%</span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Activity calendar */}
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
                    </div>
                </div>
            </div>
        </CourseShellLayout>
    )
}
