import { useEffect, useState } from 'react'
import { Clock, Flag, GripVertical, MoreHorizontal, Pencil, Plus, Trash2, X } from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import type { Language } from '../i18n/translations'
import { tasks as taskApi, type Task as ApiTask, type TodoStatus, type TodoPriority } from '../lib/api'

/* ── Types ───────────────────────────────────────────────────────────────── */
type ColId = 'todo' | 'inprogress' | 'review' | 'done'
type LocalPriority = 'high' | 'medium' | 'low' | 'urgent'

/* ── Conversion helpers ──────────────────────────────────────────────────── */
const statusToCol: Record<TodoStatus, ColId> = { TODO: 'todo', IN_PROGRESS: 'inprogress', REVIEW: 'review', DONE: 'done' }
const colToStatus: Record<ColId, TodoStatus> = { todo: 'TODO', inprogress: 'IN_PROGRESS', review: 'REVIEW', done: 'DONE' }
const prioToLocal: Record<TodoPriority, LocalPriority> = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high', URGENT: 'urgent' }
const localToPrio: Record<LocalPriority, TodoPriority> = { low: 'LOW', medium: 'MEDIUM', high: 'HIGH', urgent: 'URGENT' }
const isoToDate = (d: string | null) => d ? d.slice(0, 10) : ''

/* ── Static data ─────────────────────────────────────────────────────────── */
const COLUMNS: { id: ColId; label: string; dot: string; countBg: string; countColor: string }[] = [
    { id: 'todo', label: 'Новые', dot: '#94a3b8', countBg: '#f1f5f9', countColor: '#64748b' },
    { id: 'inprogress', label: 'В работе', dot: '#3b82f6', countBg: '#dbeafe', countColor: '#1d4ed8' },
    { id: 'review', label: 'На проверке', dot: '#f59e0b', countBg: '#fef3c7', countColor: '#d97706' },
    { id: 'done', label: 'Готово', dot: '#22c55e', countBg: '#dcfce7', countColor: '#16a34a' },
]

const PRIORITIES: { id: LocalPriority; label: string; color: string; bg: string }[] = [
    { id: 'urgent', label: 'Срочный', color: '#7c3aed', bg: '#ede9fe' },
    { id: 'high', label: 'Высокий', color: '#dc2626', bg: '#fee2e2' },
    { id: 'medium', label: 'Средний', color: '#d97706', bg: '#fef3c7' },
    { id: 'low', label: 'Низкий', color: '#16a34a', bg: '#dcfce7' },
]

const CARD_COLORS = [
    '#fca5a5', '#fdba74', '#fcd34d', '#86efac',
    '#6ee7b7', '#93c5fd', '#c4b5fd', '#f9a8d4', '#f8fafc',
]

interface LocalTask {
    id: string
    title: string
    description: string
    subject: string
    dueDate: string
    priority: LocalPriority
    color: string
    colId: ColId
}

function apiToLocal(t: ApiTask): LocalTask {
    return {
        id: t.id,
        title: t.title,
        description: t.description ?? '',
        subject: t.course?.title ?? '',
        dueDate: isoToDate(t.dueDate),
        priority: prioToLocal[t.priority] ?? 'medium',
        color: '#f8fafc',
        colId: statusToCol[t.status] ?? 'todo',
    }
}

const blankTask = (colId: ColId = 'todo'): Omit<LocalTask, 'id'> => ({
    title: '', description: '', subject: '', dueDate: '',
    priority: 'medium', color: '#f8fafc', colId,
})

const fmtDate = (d: string) => {
    if (!d) return ''
    try { return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) }
    catch { return d }
}

/* ── Component ───────────────────────────────────────────────────────────── */
type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function StudentTaskPage({ language, onLanguageChange }: Props) {
    const [localTasks, setLocalTasks] = useState<LocalTask[]>([])
    const [activeSubject, setActiveSubject] = useState<string | null>(null)
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const [modal, setModal] = useState<{
        open: boolean
        task: Omit<LocalTask, 'id'>
        editId: string | null
    }>({ open: false, task: blankTask(), editId: null })

    /* Load tasks from API */
    useEffect(() => {
        taskApi.list().then(list => setLocalTasks(list.map(apiToLocal)))
            .catch(() => { /* offline — show empty */ })
    }, [])

    /* helpers */
    const openAdd = (colId: ColId) => setModal({ open: true, task: blankTask(colId), editId: null })
    const openEdit = (t: LocalTask) => { setModal({ open: true, task: { ...t }, editId: t.id }); setOpenMenu(null) }
    const closeModal = () => setModal({ open: false, task: blankTask(), editId: null })

    const setField = <K extends keyof Omit<LocalTask, 'id'>>(key: K, val: LocalTask[K]) =>
        setModal(m => ({ ...m, task: { ...m.task, [key]: val } }))

    const saveTask = async () => {
        if (!modal.task.title.trim()) return
        const body = {
            title: modal.task.title,
            description: modal.task.description || undefined,
            status: colToStatus[modal.task.colId],
            priority: localToPrio[modal.task.priority],
            dueDate: modal.task.dueDate || undefined,
        }
        try {
            if (modal.editId) {
                const updated = await taskApi.update(modal.editId, body)
                setLocalTasks(prev => prev.map(t => t.id === modal.editId ? { ...apiToLocal(updated), color: modal.task.color } : t))
            } else {
                const created = await taskApi.create(body)
                setLocalTasks(prev => [...prev, { ...apiToLocal(created), color: modal.task.color }])
            }
        } catch { /* API error — ignore for now */ }
        closeModal()
    }

    const deleteTask = async (id: string) => {
        setOpenMenu(null)
        try { await taskApi.delete(id) } catch { /* ignore */ }
        setLocalTasks(prev => prev.filter(t => t.id !== id))
    }

    const colTasks = (colId: ColId) =>
        localTasks.filter(t => t.colId === colId && (!activeSubject || t.subject === activeSubject))

    const allSubjects = [...new Set(localTasks.map(t => t.subject).filter(Boolean))]

    const getPri = (p: LocalPriority) => PRIORITIES.find(x => x.id === p) ?? PRIORITIES[2]

    return (
        <CourseShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Планировщик задач"
            activePage="tasks"
        >
            {/* ── Subject filter chips ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
                <button
                    type="button"
                    className={`chat-chip${activeSubject === null ? ' active' : ''}`}
                    onClick={() => setActiveSubject(null)}
                >
                    Все предметы
                </button>
                {allSubjects.map(s => (
                    <button
                        key={s}
                        type="button"
                        className={`chat-chip${activeSubject === s ? ' active' : ''}`}
                        onClick={() => setActiveSubject(prev => prev === s ? null : s)}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* ── Kanban board ── */}
            <div className="kanban-board-wrap">
                <div className="kanban-board">
                    {COLUMNS.map(col => {
                        const cards = colTasks(col.id)
                        return (
                            <div key={col.id} className="kanban-col">
                                {/* Column header */}
                                <div className="kanban-col-header">
                                    <div className="kanban-col-title">
                                        <span className="kanban-col-dot" style={{ background: col.dot }} />
                                        <strong style={{ fontWeight: 700 }}>{col.label}</strong>
                                        <span
                                            className="kanban-col-count"
                                            style={{ background: col.countBg, color: col.countColor }}
                                        >
                                            {cards.length}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="kanban-add-card-btn"
                                        style={{ color: col.dot }}
                                        onClick={() => openAdd(col.id)}
                                        aria-label={`Добавить задачу в "${col.label}"`}
                                    >
                                        <Plus size={13} />
                                    </button>
                                </div>

                                {/* Cards */}
                                <div className="kanban-col-cards">
                                    {cards.map(task => {
                                        const pri = getPri(task.priority)
                                        const hasAccent = task.color && task.color !== '#f8fafc'
                                        return (
                                            <div
                                                key={task.id}
                                                className="kbcard"
                                                style={hasAccent ? { borderTop: `3px solid ${task.color}` } : undefined}
                                                onClick={() => {
                                                    if (openMenu === task.id) { setOpenMenu(null); return }
                                                    openEdit(task)
                                                }}
                                            >
                                                {/* Card top row */}
                                                <div className="kbcard-top" style={{ position: 'relative' }}>
                                                    <span className="kbcard-grip">
                                                        <GripVertical size={14} />
                                                    </span>
                                                    <div className="kbcard-tags">
                                                        {task.subject && (
                                                            <span
                                                                className="kbcard-tag"
                                                                style={{ background: col.countBg, color: col.countColor }}
                                                            >
                                                                {task.subject}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="kbcard-menu-btn"
                                                        onClick={e => { e.stopPropagation(); setOpenMenu(prev => prev === task.id ? null : task.id) }}
                                                        aria-label="Меню карточки"
                                                    >
                                                        <MoreHorizontal size={14} />
                                                    </button>

                                                    {/* Dropdown menu */}
                                                    {openMenu === task.id && (
                                                        <div className="kbcard-menu-popup">
                                                            <button
                                                                type="button"
                                                                onClick={e => { e.stopPropagation(); openEdit(task) }}
                                                            >
                                                                <Pencil size={13} /> Редактировать
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="danger"
                                                                onClick={e => { e.stopPropagation(); deleteTask(task.id) }}
                                                            >
                                                                <Trash2 size={13} /> Удалить
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Title & description */}
                                                <p className="kbcard-title">{task.title}</p>
                                                {task.description && (
                                                    <p className="kbcard-desc">{task.description}</p>
                                                )}

                                                {/* Footer: priority + due date */}
                                                <div className="kbcard-footer">
                                                    <span
                                                        className="kbcard-priority"
                                                        style={{ color: pri.color, background: pri.bg, padding: '2px 8px', borderRadius: 20 }}
                                                    >
                                                        <Flag size={10} /> {pri.label}
                                                    </span>
                                                    {task.dueDate && (
                                                        <span className="kbcard-due">
                                                            <Clock size={10} /> {fmtDate(task.dueDate)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {cards.length === 0 && (
                                        <p style={{ fontSize: 12, color: '#b0bac8', textAlign: 'center', padding: '16px 0', margin: 0 }}>
                                            Нет задач
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Task modal ── */}
            {modal.open && (
                <div className="inst-modal-backdrop" onClick={closeModal}>
                    <div
                        className="inst-modal task-modal"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="inst-modal-head">
                            <h3>{modal.editId ? 'Редактировать задачу' : 'Новая задача'}</h3>
                            <button
                                type="button"
                                style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#6b7280' }}
                                onClick={closeModal}
                                aria-label="Закрыть"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {/* Title */}
                            <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 600, color: '#718198' }}>
                                Название *
                                <input
                                    className="inst-input"
                                    placeholder="Название задачи"
                                    value={modal.task.title}
                                    onChange={e => setField('title', e.target.value)}
                                    autoFocus
                                />
                            </label>

                            {/* Description */}
                            <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 600, color: '#718198' }}>
                                Описание
                                <textarea
                                    className="inst-input"
                                    placeholder="Краткое описание (необязательно)"
                                    value={modal.task.description}
                                    onChange={e => setField('description', e.target.value)}
                                    rows={2}
                                    style={{ resize: 'vertical' }}
                                />
                            </label>

                            {/* Subject + Due date */}
                            <div className="task-modal-row">
                                <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 600, color: '#718198' }}>
                                    Предмет
                                    <input
                                        className="inst-input"
                                        placeholder="Предмет (необязательно)"
                                        value={modal.task.subject}
                                        onChange={e => setField('subject', e.target.value)}
                                    />
                                </label>
                                <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 600, color: '#718198' }}>
                                    Срок сдачи
                                    <input
                                        type="date"
                                        className="inst-input"
                                        value={modal.task.dueDate}
                                        onChange={e => setField('dueDate', e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* Priority + Column */}
                            <div className="task-modal-row">
                                <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 600, color: '#718198' }}>
                                    Приоритет
                                    <select
                                        className="inst-input"
                                        value={modal.task.priority}
                                        onChange={e => setField('priority', e.target.value as LocalPriority)}
                                    >
                                        {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                                    </select>
                                </label>
                                <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 600, color: '#718198' }}>
                                    Колонка
                                    <select
                                        className="inst-input"
                                        value={modal.task.colId}
                                        onChange={e => setField('colId', e.target.value as ColId)}
                                    >
                                        {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </select>
                                </label>
                            </div>

                            {/* Color picker */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#718198' }}>Цвет карточки</span>
                                <div className="task-color-row">
                                    {CARD_COLORS.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            className={`task-color-dot${modal.task.color === c ? ' selected' : ''}`}
                                            style={{ background: c }}
                                            onClick={() => setField('color', c)}
                                            aria-label={`Выбрать цвет ${c}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid var(--line)', paddingTop: 14, marginTop: 2 }}>
                                <button type="button" className="inst-btn ghost" onClick={closeModal}>
                                    Отмена
                                </button>
                                <button
                                    type="button"
                                    className="inst-btn"
                                    onClick={saveTask}
                                    disabled={!modal.task.title.trim()}
                                >
                                    {modal.editId ? 'Сохранить' : 'Добавить'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </CourseShellLayout>
    )
}
