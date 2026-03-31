import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentApi, type StudentProfile, type AvailableCourse, type EnrolledCourse } from '../features/student/studentApi.ts'

function ProgressBar({ value }: { value: number }) {
    const clamped = Math.max(0, Math.min(100, value))
    return (
        <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${clamped}%` }} />
        </div>
    )
}

export function StudentDashboard() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const [available, setAvailable] = useState<AvailableCourse[]>([])
    const [enrolled, setEnrolled] = useState<EnrolledCourse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        try {
            setLoading(true)
            const [me, avail, mine] = await Promise.all([
                studentApi.me(),
                studentApi.availableCourses(),
                studentApi.enrolledCourses(),
            ])
            setProfile(me)
            setAvailable(avail)
            setEnrolled(mine)
        } catch {
            setError('Не удалось загрузить данные ученика')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { void load() }, [load])

    const handleEnroll = async (courseId: string) => {
        await studentApi.enroll(courseId)
        await load()
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div
                    className="h-12 w-12 rounded-full border-4 border-t-transparent animate-spin"
                    style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }}
                />
                <p style={{ color: 'var(--ink-300)' }}>Загрузка данных…</p>
            </div>
        )
    }

    return (
        <section className="space-y-8">
            {/* ── Header ────────────────────────────────────────────── */}
            <div
                className="reveal glass-bright rounded-3xl p-6 sm:p-8 relative overflow-hidden"
                style={{ boxShadow: '0 0 60px rgba(20,184,166,0.08)' }}
            >
                <div
                    className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 70%)',
                        transform: 'translate(20%, -20%)',
                    }}
                />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <span
                            className="badge"
                            style={{
                                background: 'rgba(20,184,166,0.12)',
                                color: 'var(--accent-teal)',
                                border: '1px solid rgba(20,184,166,0.3)',
                            }}
                        >
                            🎓 Кабинет ученика
                        </span>
                    </div>
                    <h1 className="heading-font text-3xl sm:text-4xl font-bold" style={{ color: 'var(--ink-100)' }}>
                        {profile
                            ? <>{profile.user.firstName}, <span className="gradient-text">продолжаем!</span></>
                            : 'Мой прогресс'
                        }
                    </h1>

                    {/* Stats */}
                    {profile && (
                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {[
                                {
                                    label: 'Уровень',
                                    value: profile.gamification.level,
                                    icon: '⚡',
                                    style: 'stat-card-indigo',
                                    color: 'var(--brand-light)',
                                },
                                {
                                    label: 'Опыт (XP)',
                                    value: profile.gamification.xp,
                                    icon: '🏅',
                                    style: 'stat-card-amber',
                                    color: 'var(--accent)',
                                },
                                {
                                    label: 'Ачивок',
                                    value: profile.achievements.length,
                                    icon: '🏆',
                                    style: 'stat-card-teal',
                                    color: 'var(--accent-teal)',
                                },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className={`rounded-2xl p-4 ${stat.style}`}
                                    style={{ border: undefined }}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span>{stat.icon}</span>
                                        <p className="text-xs font-medium" style={{ color: 'var(--ink-300)' }}>{stat.label}</p>
                                    </div>
                                    <p
                                        className="heading-font text-3xl font-bold"
                                        style={{ color: stat.color }}
                                    >
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div
                    className="flex items-center gap-3 rounded-2xl px-5 py-4 text-sm"
                    style={{
                        background: 'rgba(244,63,94,0.08)',
                        border: '1px solid rgba(244,63,94,0.25)',
                        color: '#fb7185',
                    }}
                >
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* ── Course Columns ─────────────────────────────────────── */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* My Courses */}
                <div className="reveal glass rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="text-xl">📚</span>
                        <h2 className="heading-font text-xl font-bold" style={{ color: 'var(--ink-100)' }}>
                            Мои курсы
                        </h2>
                        <span
                            className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                                background: 'rgba(99,102,241,0.12)',
                                color: 'var(--brand-light)',
                                border: '1px solid rgba(99,102,241,0.25)',
                            }}
                        >
                            {enrolled.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {enrolled.length === 0 && (
                            <p className="text-sm py-6 text-center" style={{ color: 'var(--ink-500)' }}>
                                Вы пока не записаны на курсы
                            </p>
                        )}
                        {enrolled.map((item) => {
                            const total = item.course.modules.flatMap((m) => m.lessons).length
                            const completed = item.progress.filter((p) => p.completed).length
                            const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
                            return (
                                <div
                                    key={item.id}
                                    className="rounded-xl p-4 transition-all card-interactive"
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--line)',
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <p className="font-semibold text-sm" style={{ color: 'var(--ink-100)' }}>
                                            {item.course.title}
                                        </p>
                                        <button
                                            onClick={() => navigate(`/learn/${item.course.id}`)}
                                            className="text-xs font-bold flex-shrink-0 transition-colors hover:underline"
                                            style={{ color: 'var(--brand-light)' }}
                                        >
                                            Открыть →
                                        </button>
                                    </div>
                                    <p className="text-xs mb-2" style={{ color: 'var(--ink-500)' }}>
                                        {completed}/{total} уроков · {pct}%
                                    </p>
                                    <ProgressBar value={pct} />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Available Courses */}
                <div className="reveal glass rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="text-xl">🌟</span>
                        <h2 className="heading-font text-xl font-bold" style={{ color: 'var(--ink-100)' }}>
                            Доступные курсы
                        </h2>
                        <span
                            className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                                background: 'rgba(20,184,166,0.12)',
                                color: 'var(--accent-teal)',
                                border: '1px solid rgba(20,184,166,0.25)',
                            }}
                        >
                            {available.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {available.length === 0 && (
                            <p className="text-sm py-6 text-center" style={{ color: 'var(--ink-500)' }}>
                                Новых курсов пока нет
                            </p>
                        )}
                        {available.map((course) => (
                            <div
                                key={course.id}
                                className="rounded-xl p-4 transition-all card-interactive"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--line)',
                                }}
                            >
                                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--ink-100)' }}>
                                    {course.title}
                                </p>
                                {course.description && (
                                    <p className="text-xs mb-1.5" style={{ color: 'var(--ink-300)' }}>
                                        {course.description}
                                    </p>
                                )}
                                <p className="text-xs mb-3" style={{ color: 'var(--ink-500)' }}>
                                    {course._count.modules} модулей · {course.author.firstName} {course.author.lastName}
                                </p>
                                <button
                                    onClick={() => { void handleEnroll(course.id) }}
                                    className="btn-primary text-xs py-2 px-4"
                                >
                                    Записаться →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
