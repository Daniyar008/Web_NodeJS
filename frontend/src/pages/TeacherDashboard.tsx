import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { courseApi, type Course, type TeacherStats } from '../features/course/courseApi.ts'

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
    return (
        <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">{label}</p>
            <p className={`heading-font mt-1 text-3xl font-bold ${accent ? 'text-amber-500' : 'text-[color:var(--brand)]'}`}>
                {value}
            </p>
        </div>
    )
}

const statusBadge: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    PUBLISHED: 'bg-emerald-100 text-emerald-800',
    ARCHIVED: 'bg-rose-100 text-rose-700',
}
const statusLabel: Record<string, string> = {
    DRAFT: 'Черновик',
    PUBLISHED: 'Опубликован',
    ARCHIVED: 'Архив',
}

export function TeacherDashboard() {
    const navigate = useNavigate()
    const [stats, setStats] = useState<TeacherStats | null>(null)
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [form, setForm] = useState({ title: '', description: '' })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        try {
            setLoading(true)
            const [s, c] = await Promise.all([courseApi.stats(), courseApi.list(true)])
            setStats(s)
            setCourses(c)
        } catch {
            setError('Не удалось загрузить данные')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { void load() }, [load])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const course = await courseApi.create(form)
            setForm({ title: '', description: '' })
            setShowCreate(false)
            navigate(`/courses/${course.id}/edit`)
        } catch {
            setError('Ошибка при создании курса')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Удалить курс?')) return
        await courseApi.delete(id)
        setCourses((prev) => prev.filter((c) => c.id !== id))
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
            {/* Header */}
            <div className="reveal rounded-3xl border border-[color:var(--line)] bg-white/85 p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">
                            Кабинет учителя
                        </p>
                        <h1 className="heading-font mt-1 text-3xl font-bold sm:text-4xl">Мои курсы</h1>
                    </div>
                    <button
                        onClick={() => setShowCreate((v) => !v)}
                        className="rounded-xl bg-[color:var(--brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                    >
                        {showCreate ? 'Отмена' : '+ Новый курс'}
                    </button>
                </div>

                {showCreate && (
                    <form onSubmit={(e) => { void handleCreate(e) }} className="mt-6 grid gap-3 sm:grid-cols-3">
                        <input
                            required
                            placeholder="Название курса"
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            className="sm:col-span-2 rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                        />
                        <input
                            placeholder="Краткое описание"
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                        />
                        <button
                            type="submit"
                            disabled={saving}
                            className="col-span-full rounded-xl bg-[color:var(--brand)] py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 sm:col-span-1"
                        >
                            {saving ? 'Создание…' : 'Создать и открыть редактор'}
                        </button>
                    </form>
                )}
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            {/* Stats */}
            {stats && (
                <div className="card-grid">
                    <StatCard label="Курсов создано" value={stats.totalCourses} />
                    <StatCard label="Студентов записано" value={stats.totalStudents} />
                    <StatCard label="Работ на проверке" value={stats.pendingSubmissions} accent />
                </div>
            )}

            {/* Courses list */}
            {courses.length === 0 ? (
                <div className="reveal rounded-2xl border border-dashed border-[color:var(--line)] bg-white/60 p-10 text-center">
                    <p className="text-[color:var(--ink-700)]">Нет курсов. Создайте первый!</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {courses.map((course, idx) => (
                        <article
                            key={course.id}
                            className="reveal flex flex-col rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm"
                            style={{ animationDelay: `${idx * 80}ms` }}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <h2 className="heading-font flex-1 text-base font-bold leading-snug">{course.title}</h2>
                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadge[course.status]}`}>
                                    {statusLabel[course.status]}
                                </span>
                            </div>
                            {course.description && (
                                <p className="mt-1.5 text-sm text-[color:var(--ink-700)] line-clamp-2">{course.description}</p>
                            )}
                            <div className="mt-3 flex gap-3 text-xs text-[color:var(--ink-700)]">
                                <span>{course._count.modules} модулей</span>
                                <span>·</span>
                                <span>{course._count.enrollments} студентов</span>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => navigate(`/courses/${course.id}/edit`)}
                                    className="flex-1 rounded-xl border border-[color:var(--brand)] py-1.5 text-sm font-semibold text-[color:var(--brand)] transition hover:bg-[color:var(--brand)] hover:text-white"
                                >
                                    Редактировать
                                </button>
                                <button
                                    onClick={() => { void handleDelete(course.id) }}
                                    className="rounded-xl border border-[color:var(--line)] px-3 py-1.5 text-sm text-red-600 transition hover:border-red-200 hover:bg-red-50"
                                >
                                    ✕
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}
