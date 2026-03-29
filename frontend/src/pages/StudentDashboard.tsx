import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentApi, type StudentProfile, type AvailableCourse, type EnrolledCourse } from '../features/student/studentApi.ts'

function ProgressBar({ value }: { value: number }) {
    return (
        <div className="h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-[color:var(--brand)] transition-all" style={{ width: `${value}%` }} />
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
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--brand)] border-t-transparent" />
            </div>
        )
    }

    return (
        <section className="space-y-6">
            <div className="reveal rounded-3xl border border-[color:var(--line)] bg-white/85 p-6 shadow-sm sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">Кабинет ученика</p>
                <h1 className="heading-font mt-1 text-3xl font-bold sm:text-4xl">
                    {profile ? `${profile.user.firstName}, продолжаем обучение` : 'Мой прогресс'}
                </h1>
                {profile && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-[color:var(--line)] bg-white p-4">
                            <p className="text-xs text-[color:var(--ink-700)]">Уровень</p>
                            <p className="heading-font text-2xl font-bold text-[color:var(--brand)]">{profile.gamification.level}</p>
                        </div>
                        <div className="rounded-xl border border-[color:var(--line)] bg-white p-4">
                            <p className="text-xs text-[color:var(--ink-700)]">XP</p>
                            <p className="heading-font text-2xl font-bold text-[color:var(--brand)]">{profile.gamification.xp}</p>
                        </div>
                        <div className="rounded-xl border border-[color:var(--line)] bg-white p-4">
                            <p className="text-xs text-[color:var(--ink-700)]">Ачивок</p>
                            <p className="heading-font text-2xl font-bold text-[color:var(--brand)]">{profile.achievements.length}</p>
                        </div>
                    </div>
                )}
            </div>

            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
                    <h2 className="heading-font text-lg font-bold">Мои курсы</h2>
                    <div className="mt-3 space-y-3">
                        {enrolled.length === 0 && <p className="text-sm text-[color:var(--ink-700)]">Вы пока не записаны на курсы</p>}
                        {enrolled.map((item) => {
                            const total = item.course.modules.flatMap((m) => m.lessons).length
                            const completed = item.progress.filter((p) => p.completed).length
                            const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
                            return (
                                <div key={item.id} className="rounded-xl border border-[color:var(--line)] p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-semibold">{item.course.title}</p>
                                        <button
                                            onClick={() => navigate(`/learn/${item.course.id}`)}
                                            className="text-xs font-semibold text-[color:var(--brand)] hover:underline"
                                        >
                                            Открыть
                                        </button>
                                    </div>
                                    <p className="mt-1 text-xs text-[color:var(--ink-700)]">{completed}/{total} уроков</p>
                                    <div className="mt-2"><ProgressBar value={pct} /></div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
                    <h2 className="heading-font text-lg font-bold">Доступные курсы</h2>
                    <div className="mt-3 space-y-3">
                        {available.length === 0 && <p className="text-sm text-[color:var(--ink-700)]">Новых курсов пока нет</p>}
                        {available.map((course) => (
                            <div key={course.id} className="rounded-xl border border-[color:var(--line)] p-4">
                                <p className="font-semibold">{course.title}</p>
                                {course.description && <p className="mt-1 text-sm text-[color:var(--ink-700)]">{course.description}</p>}
                                <p className="mt-1 text-xs text-[color:var(--ink-700)]">
                                    {course._count.modules} модулей · {course.author.firstName} {course.author.lastName}
                                </p>
                                <button
                                    onClick={() => { void handleEnroll(course.id) }}
                                    className="mt-3 rounded-lg bg-[color:var(--brand)] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                                >
                                    Записаться
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
