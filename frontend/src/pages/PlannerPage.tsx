import { useEffect, useMemo, useState, useCallback } from 'react'
import { taskApi, type TaskItem, type TaskPriority, type TaskStatus } from '../features/task/taskApi.ts'

type Column = { status: TaskStatus; title: string }

const columns: Column[] = [
    { status: 'TODO', title: 'Запланировано' },
    { status: 'IN_PROGRESS', title: 'В работе' },
    { status: 'REVIEW', title: 'На проверке' },
    { status: 'DONE', title: 'Готово' },
]

const statusLabel: Record<TaskStatus, string> = {
    TODO: 'Запланировано',
    IN_PROGRESS: 'В работе',
    REVIEW: 'На проверке',
    DONE: 'Готово',
}

const priorityLabel: Record<TaskPriority, string> = {
    LOW: 'Низкий',
    MEDIUM: 'Средний',
    HIGH: 'Высокий',
    URGENT: 'Срочный',
}

const priorityColor: Record<TaskPriority, string> = {
    LOW: 'bg-gray-100 text-gray-700',
    MEDIUM: 'bg-sky-100 text-sky-700',
    HIGH: 'bg-amber-100 text-amber-800',
    URGENT: 'bg-rose-100 text-rose-700',
}

type TaskForm = {
    title: string
    description: string
    status: TaskStatus
    priority: TaskPriority
    dueDate: string
}

const emptyForm: TaskForm = {
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
}

export function PlannerPage() {
    const [tasks, setTasks] = useState<TaskItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [dragTaskId, setDragTaskId] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<TaskItem | null>(null)
    const [form, setForm] = useState<TaskForm>(emptyForm)
    const [saving, setSaving] = useState(false)

    const load = useCallback(async () => {
        try {
            setLoading(true)
            const data = await taskApi.list()
            setTasks(data)
        } catch {
            setError('Не удалось загрузить задачи')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { void load() }, [load])

    const grouped = useMemo(() => {
        const byStatus: Record<TaskStatus, TaskItem[]> = {
            TODO: [],
            IN_PROGRESS: [],
            REVIEW: [],
            DONE: [],
        }
        tasks.forEach((t) => byStatus[t.status].push(t))
            ; (Object.keys(byStatus) as TaskStatus[]).forEach((status) => {
                byStatus[status] = byStatus[status].sort((a, b) => a.position - b.position)
            })
        return byStatus
    }, [tasks])

    const openCreate = (status: TaskStatus = 'TODO') => {
        setEditing(null)
        setForm({ ...emptyForm, status })
        setModalOpen(true)
    }

    const openEdit = (task: TaskItem) => {
        setEditing(task)
        setForm({
            title: task.title,
            description: task.description ?? '',
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        })
        setModalOpen(true)
    }

    const saveTask = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (editing) {
                const updated = await taskApi.update(editing.id, {
                    title: form.title,
                    description: form.description || undefined,
                    status: form.status,
                    priority: form.priority,
                    dueDate: form.dueDate ? new Date(`${form.dueDate}T12:00:00.000Z`).toISOString() : null,
                })
                setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
            } else {
                const created = await taskApi.create({
                    title: form.title,
                    description: form.description || undefined,
                    status: form.status,
                    priority: form.priority,
                    dueDate: form.dueDate ? new Date(`${form.dueDate}T12:00:00.000Z`).toISOString() : undefined,
                })
                setTasks((prev) => [...prev, created])
            }
            setModalOpen(false)
        } catch {
            setError('Не удалось сохранить задачу')
        } finally {
            setSaving(false)
        }
    }

    const deleteTask = async (id: string) => {
        if (!confirm('Удалить задачу?')) return
        await taskApi.remove(id)
        setTasks((prev) => prev.filter((t) => t.id !== id))
    }

    const syncReorder = async (next: TaskItem[]) => {
        setTasks(next)
        const payload = (Object.keys({ TODO: 1, IN_PROGRESS: 1, REVIEW: 1, DONE: 1 }) as TaskStatus[])
            .flatMap((status) =>
                next
                    .filter((t) => t.status === status)
                    .sort((a, b) => a.position - b.position)
                    .map((t, idx) => ({ id: t.id, status, position: idx }))
            )

        try {
            const server = await taskApi.reorder(payload)
            setTasks(server)
        } catch {
            setError('Не удалось сохранить порядок задач')
            await load()
        }
    }

    const onDropToColumn = async (status: TaskStatus) => {
        if (!dragTaskId) return
        const task = tasks.find((t) => t.id === dragTaskId)
        if (!task) return

        const statusTasks = tasks.filter((t) => t.status === status && t.id !== task.id)
        const moved: TaskItem = { ...task, status, position: statusTasks.length }
        const next = tasks
            .filter((t) => t.id !== task.id)
            .map((t) => {
                if (t.status !== task.status) return t
                const sameOld = tasks.filter((x) => x.status === task.status && x.id !== task.id).sort((a, b) => a.position - b.position)
                const idx = sameOld.findIndex((x) => x.id === t.id)
                return { ...t, position: idx }
            })
            .concat(moved)

        setDragTaskId(null)
        await syncReorder(next)
    }

    const upcoming = useMemo(
        () => tasks.filter((t) => !!t.dueDate).sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate))).slice(0, 8),
        [tasks]
    )

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
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">Планировщик задач</p>
                        <h1 className="heading-font mt-1 text-3xl font-bold sm:text-4xl">Kanban + дедлайны</h1>
                    </div>
                    <button
                        onClick={() => openCreate('TODO')}
                        className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                    >
                        + Новая задача
                    </button>
                </div>
            </div>

            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="grid gap-4 lg:grid-cols-4">
                {columns.map((col) => (
                    <div
                        key={col.status}
                        className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-4 shadow-sm"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => { void onDropToColumn(col.status) }}
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="heading-font text-sm font-bold">{col.title}</h2>
                            <button
                                onClick={() => openCreate(col.status)}
                                className="rounded-md border border-[color:var(--line)] px-2 py-0.5 text-xs hover:bg-gray-50"
                            >
                                +
                            </button>
                        </div>
                        <div className="space-y-2">
                            {grouped[col.status].map((task) => (
                                <article
                                    key={task.id}
                                    draggable
                                    onDragStart={() => setDragTaskId(task.id)}
                                    className="cursor-grab rounded-xl border border-[color:var(--line)] bg-white p-3 active:cursor-grabbing"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-semibold leading-snug">{task.title}</p>
                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityColor[task.priority]}`}>
                                            {priorityLabel[task.priority]}
                                        </span>
                                    </div>
                                    {task.description && <p className="mt-1 text-xs text-[color:var(--ink-700)] line-clamp-3">{task.description}</p>}
                                    {task.dueDate && (
                                        <p className="mt-2 text-[11px] text-[color:var(--ink-700)]">
                                            дедлайн: {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                                        </p>
                                    )}
                                    <div className="mt-2 flex justify-end gap-2">
                                        <button onClick={() => openEdit(task)} className="text-xs text-[color:var(--brand)] hover:underline">Изменить</button>
                                        <button onClick={() => { void deleteTask(task.id) }} className="text-xs text-red-600 hover:underline">Удалить</button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
                <h2 className="heading-font text-lg font-bold">Календарь дедлайнов (ближайшие)</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    {upcoming.length === 0 && <p className="text-sm text-[color:var(--ink-700)]">Нет задач с дедлайном</p>}
                    {upcoming.map((task) => (
                        <div key={task.id} className="rounded-xl border border-[color:var(--line)] p-3">
                            <p className="text-sm font-semibold">{task.title}</p>
                            <p className="mt-1 text-xs text-[color:var(--ink-700)]">{new Date(String(task.dueDate)).toLocaleDateString('ru-RU')}</p>
                            <p className="mt-1 text-[11px] text-[color:var(--ink-700)]">{statusLabel[task.status]}</p>
                        </div>
                    ))}
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setModalOpen(false)}>
                    <form
                        onSubmit={(e) => { void saveTask(e) }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-xl rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-xl"
                    >
                        <h3 className="heading-font text-xl font-bold">{editing ? 'Редактировать задачу' : 'Новая задача'}</h3>
                        <div className="mt-4 grid gap-3">
                            <input
                                required
                                value={form.title}
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                placeholder="Название"
                                className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                            />
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                rows={4}
                                placeholder="Описание"
                                className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                            />
                            <div className="grid gap-3 sm:grid-cols-3">
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))}
                                    aria-label="Статус задачи"
                                    className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm"
                                >
                                    {columns.map((c) => <option key={c.status} value={c.status}>{c.title}</option>)}
                                </select>
                                <select
                                    value={form.priority}
                                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
                                    aria-label="Приоритет задачи"
                                    className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm"
                                >
                                    {(Object.keys(priorityLabel) as TaskPriority[]).map((p) => (
                                        <option key={p} value={p}>{priorityLabel[p]}</option>
                                    ))}
                                </select>
                                <input
                                    type="date"
                                    value={form.dueDate}
                                    onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                                    aria-label="Дата дедлайна"
                                    className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                        <div className="mt-5 flex justify-end gap-2">
                            <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-[color:var(--line)] px-4 py-2 text-sm">Отмена</button>
                            <button type="submit" disabled={saving} className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                                {saving ? 'Сохраняю...' : 'Сохранить'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    )
}
