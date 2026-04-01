import { useState } from 'react'
import { Clock, Flag, GripVertical, MoreHorizontal, Pencil, Plus, Trash2, X } from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import type { Language } from '../i18n/translations'

/* ── Types ───────────────────────────────────────────────────────────────── */
type Priority = 'high' | 'medium' | 'low'
type ColId = 'todo' | 'inprogress' | 'review' | 'done'

interface Task {
    id: string
    title: string
    description: string
    subject: string
    dueDate: string
    priority: Priority
    color: string
    colId: ColId
}

/* ── Static data ─────────────────────────────────────────────────────────── */
const COLUMNS: { id: ColId; label: string; dot: string; countBg: string; countColor: string }[] = [
    { id: 'todo', label: 'Новые', dot: '#94a3b8', countBg: '#f1f5f9', countColor: '#64748b' },
    { id: 'inprogress', label: 'В работе', dot: '#3b82f6', countBg: '#dbeafe', countColor: '#1d4ed8' },
    { id: 'review', label: 'На проверке', dot: '#f59e0b', countBg: '#fef3c7', countColor: '#d97706' },
    { id: 'done', label: 'Готово', dot: '#22c55e', countBg: '#dcfce7', countColor: '#16a34a' },
]

const PRIORITIES: { id: Priority; label: string; color: string; bg: string }[] = [
    { id: 'high', label: 'Высокий', color: '#dc2626', bg: '#fee2e2' },
    { id: 'medium', label: 'Средний', color: '#d97706', bg: '#fef3c7' },
    { id: 'low', label: 'Низкий', color: '#16a34a', bg: '#dcfce7' },
]

const CARD_COLORS = [
    '#fca5a5', '#fdba74', '#fcd34d', '#86efac',
    '#6ee7b7', '#93c5fd', '#c4b5fd', '#f9a8d4', '#f8fafc',
]

const SUBJECTS = [
    'Математика', 'Физика', 'Химия', 'История',
    'Литература', 'Биология', 'Английский', 'Информатика',
]

const INITIAL_TASKS: Task[] = [
    { id: '1', title: 'Решить задачи по интегралам', description: 'Стр. 45–48, задания 1–12', subject: 'Математика', dueDate: '2025-07-15', priority: 'high', color: '#fca5a5', colId: 'todo' },
    { id: '2', title: 'Прочитать «Война и мир»', description: 'Том 1, часть 2', subject: 'Литература', dueDate: '2025-07-20', priority: 'medium', color: '#c4b5fd', colId: 'todo' },
    { id: '3', title: 'Лабораторная работа', description: 'Реакции окисления-восстановления', subject: 'Химия', dueDate: '2025-07-12', priority: 'high', color: '#fdba74', colId: 'inprogress' },
    { id: '4', title: 'Доклад «Первая мировая война»', description: 'Причины и итоги конфликта', subject: 'История', dueDate: '2025-07-18', priority: 'medium', color: '#6ee7b7', colId: 'inprogress' },
    { id: '5', title: 'Эссе на английском языке', description: 'My future career, 250 words', subject: 'Английский', dueDate: '2025-07-14', priority: 'low', color: '#93c5fd', colId: 'review' },
    { id: '6', title: 'Тест по биологии', description: 'Клеточное строение организмов', subject: 'Биология', dueDate: '2025-07-10', priority: 'high', color: '#86efac', colId: 'done' },
]

const blankTask = (colId: ColId = 'todo'): Omit<Task, 'id'> => ({
    title: '', description: '', subject: '', dueDate: '',
    priority: 'medium', color: '#f8fafc', colId,
})

const genId = () => Math.random().toString(36).slice(2, 9)

const fmtDate = (d: string) => {
    if (!d) return ''
    try { return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) }
    catch { return d }
}

/* ── Component ───────────────────────────────────────────────────────────── */
type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function StudentTaskPage({ language, onLanguageChange }: Props) {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
    const [activeSubject, setActiveSubject] = useState<string | null>(null)
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const [modal, setModal] = useState<{
        open: boolean
        task: Omit<Task, 'id'>
        editId: string | null
    }>({ open: false, task: blankTask(), editId: null })

    /* helpers */
    const openAdd = (colId: ColId) => setModal({ open: true, task: blankTask(colId), editId: null })
    const openEdit = (t: Task) => { setModal({ open: true, task: { ...t }, editId: t.id }); setOpenMenu(null) }
    const closeModal = () => setModal({ open: false, task: blankTask(), editId: null })

    const setField = <K extends keyof Omit<Task, 'id'>>(key: K, val: Task[K]) =>
        setModal(m => ({ ...m, task: { ...m.task, [key]: val } }))

    const saveTask = () => {
        if (!modal.task.title.trim()) return
        if (modal.editId) {
            setTasks(prev => prev.map(t => t.id === modal.editId ? { ...modal.task, id: modal.editId } : t))
        } else {
            setTasks(prev => [...prev, { ...modal.task, id: genId() }])
        }
        closeModal()
    }

    const deleteTask = (id: string) => { setTasks(prev => prev.filter(t => t.id !== id)); setOpenMenu(null) }

    const colTasks = (colId: ColId) =>
        tasks.filter(t => t.colId === colId && (!activeSubject || t.subject === activeSubject))

    const allSubjects = [...new Set(tasks.map(t => t.subject).filter(Boolean))]

    const getPri = (p: Priority) => PRIORITIES.find(x => x.id === p)!

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
                                    <select
                                        className="inst-input"
                                        value={modal.task.subject}
                                        onChange={e => setField('subject', e.target.value)}
                                    >
                                        <option value="">— Выберите —</option>
                                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
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
                                        onChange={e => setField('priority', e.target.value as Priority)}
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
