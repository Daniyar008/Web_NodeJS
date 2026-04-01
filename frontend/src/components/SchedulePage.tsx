import { useRef, useState } from 'react'
import {
    AlignLeft, Bell, Calendar, ChevronLeft, ChevronRight,
    Clock, Edit2, Flag, GripVertical, KanbanSquare, LayoutGrid,
    MoreHorizontal, Plus, Tag, Trash2, X,
} from 'lucide-react'
import type { Language } from '../i18n/translations'
import {
    EVENT_COLORS, KANBAN_COLUMNS, PRIORITY_LABELS,
    initialKanbanCards, reminders, scheduleEvents, todayStr,
} from '../data/scheduleData'
import type {
    EventColor, KanbanCard, KanbanStatus, ScheduleEvent,
} from '../data/scheduleData'
import { CourseShellLayout } from './CourseShellLayout'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS_RU = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]
const MONTHS_SHORT = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
const DAYS_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const DAYS_FULL = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

function fmt2(n: number) { return String(n).padStart(2, '0') }
function fmtTime(h: number, m: number) { return `${fmt2(h)}:${fmt2(m)}` }

function isoToDate(iso: string) {
    const [y, mo, d] = iso.split('-').map(Number)
    return new Date(y, mo - 1, d)
}
function dateToIso(d: Date) {
    return `${d.getFullYear()}-${fmt2(d.getMonth() + 1)}-${fmt2(d.getDate())}`
}

// ─── Event block (timeline slot) ─────────────────────────────────────────────

function EventBlock({ ev, onClick }: { ev: ScheduleEvent; onClick: () => void }) {
    const c = EVENT_COLORS[ev.color]
    const durationMin = (ev.endHour - ev.startHour) * 60 + (ev.endMin - ev.startMin)
    const heightPx = Math.max(durationMin * 1.2, 56)
    return (
        <button
            type="button"
            className="sched-event-block"
            style={{ background: c.bg, borderLeft: `3px solid ${c.border}`, height: `${heightPx}px` }}
            onClick={onClick}
            aria-label={ev.title}
        >
            <p className="sched-event-title" style={{ color: c.text }}>{ev.title}</p>
            {ev.subtitle && <p className="sched-event-sub">{ev.subtitle}</p>}
            <p className="sched-event-time">
                <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />
                {fmtTime(ev.startHour, ev.startMin)} – {fmtTime(ev.endHour, ev.endMin)}
            </p>
            {ev.teacherName && (
                <p className="sched-event-teacher">{ev.teacherName}{ev.room ? ` · каб. ${ev.room}` : ''}</p>
            )}
            <span className="sched-event-badge" style={{ background: `${c.border}22`, color: c.border }}>
                {ev.createdBy === 'institution' ? 'Учреждение' : 'Учитель'}
            </span>
        </button>
    )
}

// ─── Kanban card component ────────────────────────────────────────────────────

function KanbanCardItem({
    card,
    onDragStart,
    onEdit,
    onDelete,
}: {
    card: KanbanCard
    onDragStart: (id: string) => void
    onEdit: (card: KanbanCard) => void
    onDelete: (id: string) => void
}) {
    const c = EVENT_COLORS[card.color]
    const pri = PRIORITY_LABELS[card.priority]
    const [menu, setMenu] = useState(false)
    return (
        <div
            className="kbcard"
            draggable
            onDragStart={() => onDragStart(card.id)}
            style={{ borderTop: `3px solid ${c.border}` }}
        >
            <div className="kbcard-top">
                <GripVertical size={13} className="kbcard-grip" />
                <div className="kbcard-tags">
                    {card.tags.map((t) => (
                        <span key={t} className="kbcard-tag" style={{ background: `${c.border}18`, color: c.border }}>{t}</span>
                    ))}
                </div>
                <div style={{ position: 'relative', marginLeft: 'auto' }}>
                    <button type="button" className="kbcard-menu-btn" onClick={() => setMenu((v) => !v)} aria-label="Меню">
                        <MoreHorizontal size={14} />
                    </button>
                    {menu && (
                        <div className="kbcard-menu-popup">
                            <button type="button" onClick={() => { onEdit(card); setMenu(false) }}><Edit2 size={12} /> Изменить</button>
                            <button type="button" className="danger" onClick={() => { onDelete(card.id); setMenu(false) }}><Trash2 size={12} /> Удалить</button>
                        </div>
                    )}
                </div>
            </div>

            <p className="kbcard-title">{card.title}</p>
            {card.description && <p className="kbcard-desc">{card.description}</p>}

            <div className="kbcard-footer">
                <span className="kbcard-priority" style={{ color: pri.color }}>
                    <Flag size={10} /> {pri.label}
                </span>
                {card.dueDate && (
                    <span className="kbcard-due">
                        <Clock size={10} /> {isoToDate(card.dueDate).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}
                    </span>
                )}
            </div>
        </div>
    )
}

// ─── Add/Edit task modal ──────────────────────────────────────────────────────

type TaskModalProps = {
    initial?: Partial<KanbanCard>
    onSave: (card: Omit<KanbanCard, 'id'>) => void
    onClose: () => void
}

const COLOR_OPTIONS: EventColor[] = ['green', 'blue', 'orange', 'purple', 'pink', 'red']

function TaskModal({ initial, onSave, onClose }: TaskModalProps) {
    const [title, setTitle] = useState(initial?.title ?? '')
    const [desc, setDesc] = useState(initial?.description ?? '')
    const [status, setStatus] = useState<KanbanStatus>(initial?.status ?? 'todo')
    const [priority, setPriority] = useState<KanbanCard['priority']>(initial?.priority ?? 'medium')
    const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
    const [color, setColor] = useState<EventColor>(initial?.color ?? 'blue')

    function addTag() {
        const v = tagInput.trim()
        if (v && !tags.includes(v)) setTags((p) => [...p, v])
        setTagInput('')
    }

    return (
        <div className="chat-modal-overlay" onClick={onClose}>
            <div className="chat-modal task-modal" onClick={(e) => e.stopPropagation()}>
                <div className="chat-modal-header">
                    <h3>{initial?.id ? 'Изменить задачу' : 'Новая задача'}</h3>
                    <button type="button" onClick={onClose} aria-label="Закрыть"><X size={18} /></button>
                </div>

                {/* Title */}
                <label className="chat-modal-label">
                    Название
                    <input className="chat-modal-input" value={title} onChange={(e) => setTitle(e.target.value)}
                        placeholder="Что нужно сделать?" aria-label="Название задачи" />
                </label>

                {/* Description */}
                <label className="chat-modal-label">
                    Описание
                    <textarea className="chat-modal-input inst-modal-textarea" value={desc}
                        onChange={(e) => setDesc(e.target.value)} rows={2}
                        placeholder="Подробности (необязательно)" aria-label="Описание" />
                </label>

                <div className="task-modal-row">
                    {/* Status */}
                    <label className="chat-modal-label" style={{ flex: 1 }}>
                        Статус
                        <select className="chat-modal-select" value={status}
                            onChange={(e) => setStatus(e.target.value as KanbanStatus)} aria-label="Статус">
                            {KANBAN_COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                    </label>

                    {/* Priority */}
                    <label className="chat-modal-label" style={{ flex: 1 }}>
                        Приоритет
                        <select className="chat-modal-select" value={priority}
                            onChange={(e) => setPriority(e.target.value as KanbanCard['priority'])} aria-label="Приоритет">
                            <option value="low">Низкий</option>
                            <option value="medium">Средний</option>
                            <option value="high">Высокий</option>
                        </select>
                    </label>
                </div>

                {/* Due date */}
                <label className="chat-modal-label">
                    Дедлайн
                    <input type="date" className="chat-modal-input" value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)} aria-label="Дедлайн" />
                </label>

                {/* Color */}
                <div className="chat-modal-label">
                    Цвет
                    <div className="task-color-row">
                        {COLOR_OPTIONS.map((cl) => (
                            <button key={cl} type="button" aria-label={`Цвет ${cl}`}
                                className={color === cl ? 'task-color-dot selected' : 'task-color-dot'}
                                style={{ background: EVENT_COLORS[cl].border }}
                                onClick={() => setColor(cl)}
                            />
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div className="chat-modal-label">
                    Теги
                    <div className="task-tag-input-row">
                        <input className="chat-modal-input" style={{ flex: 1 }} value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                            placeholder="Введите тег + Enter" aria-label="Добавить тег" />
                    </div>
                    {tags.length > 0 && (
                        <div className="task-tags-preview">
                            {tags.map((t) => (
                                <span key={t} className="kbcard-tag" style={{ background: `${EVENT_COLORS[color].border}18`, color: EVENT_COLORS[color].border }}>
                                    {t}
                                    <button type="button" onClick={() => setTags((p) => p.filter((x) => x !== t))} aria-label={`Удалить тег ${t}`}>
                                        <X size={9} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="chat-modal-footer">
                    <button type="button" className="chat-modal-cancel" onClick={onClose}>Отмена</button>
                    <button type="button" className="chat-modal-create" disabled={!title.trim()}
                        onClick={() => { if (title.trim()) { onSave({ title, description: desc, status, priority, dueDate: dueDate || undefined, tags, color }); onClose() } }}>
                        {initial?.id ? 'Сохранить' : 'Создать'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Event detail modal ───────────────────────────────────────────────────────

function EventDetail({ ev, onClose }: { ev: ScheduleEvent; onClose: () => void }) {
    const c = EVENT_COLORS[ev.color]
    return (
        <div className="chat-modal-overlay" onClick={onClose}>
            <div className="chat-modal" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
                <div className="chat-modal-header">
                    <h3 style={{ color: c.text }}>{ev.title}</h3>
                    <button type="button" onClick={onClose} aria-label="Закрыть"><X size={18} /></button>
                </div>
                {ev.subtitle && <p style={{ margin: 0, fontSize: 14, color: '#9099a8' }}>{ev.subtitle}</p>}
                <div className="event-detail-grid">
                    <span className="event-detail-icon"><Clock size={14} style={{ color: c.border }} /></span>
                    <span>{fmtTime(ev.startHour, ev.startMin)} – {fmtTime(ev.endHour, ev.endMin)}</span>
                    {ev.teacherName && <>
                        <span className="event-detail-icon"><AlignLeft size={14} style={{ color: c.border }} /></span>
                        <span>{ev.teacherName}</span>
                    </>}
                    {ev.room && <>
                        <span className="event-detail-icon"><Tag size={14} style={{ color: c.border }} /></span>
                        <span>Кабинет {ev.room}</span>
                    </>}
                    <span className="event-detail-icon"><Flag size={14} style={{ color: c.border }} /></span>
                    <span style={{ color: c.border, fontWeight: 700 }}>
                        {ev.createdBy === 'institution' ? 'Расписание учреждения' : 'Частный учитель'}
                    </span>
                </div>
            </div>
        </div>
    )
}

// ─── Mini monthly calendar (right panel) ─────────────────────────────────────

function MiniCalendar({
    viewDate,
    selectedDate,
    onSelect,
}: {
    viewDate: Date
    selectedDate: string
    onSelect: (iso: string) => void
}) {
    const [monthDate, setMonthDate] = useState(new Date(viewDate.getFullYear(), viewDate.getMonth(), 1))

    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)

    const today = todayStr()
    const selDate = isoToDate(selectedDate)

    return (
        <div className="mini-cal">
            <div className="mini-cal-header">
                <span className="mini-cal-month">{MONTHS_RU[month]} <span className="mini-cal-year">{year}</span></span>
                <div className="mini-cal-nav">
                    <button type="button" aria-label="Предыдущий месяц"
                        onClick={() => setMonthDate(new Date(year, month - 1, 1))}><ChevronLeft size={14} /></button>
                    <button type="button" aria-label="Следующий месяц"
                        onClick={() => setMonthDate(new Date(year, month + 1, 1))}><ChevronRight size={14} /></button>
                </div>
            </div>
            <div className="mini-cal-grid">
                {DAYS_RU.map((d) => <span key={d} className="mini-cal-dow">{d}</span>)}
                {cells.map((cell, i) => {
                    if (!cell) return <span key={`e${i}`} />
                    const iso = `${year}-${fmt2(month + 1)}-${fmt2(cell)}`
                    const isToday = iso === today
                    const isSel = selDate.getDate() === cell && selDate.getMonth() === month && selDate.getFullYear() === year
                    const hasEv = scheduleEvents.some((ev) => ev.date === iso)
                    return (
                        <button key={iso} type="button"
                            className={`mini-cal-day ${isToday ? 'today' : ''} ${isSel ? 'selected' : ''}`}
                            onClick={() => onSelect(iso)} aria-label={iso}>
                            {cell}
                            {hasEv && !isSel && <span className="mini-cal-dot" />}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// ─── SchedulePage ─────────────────────────────────────────────────────────────

type ViewMode = 'schedule' | 'kanban'
type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function SchedulePage({ language, onLanguageChange }: Props) {
    // ── State ──
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(todayStr())
    const [viewMode, setViewMode] = useState<ViewMode>('schedule')
    const [cards, setCards] = useState<KanbanCard[]>(initialKanbanCards)
    const [showTaskModal, setShowTaskModal] = useState(false)
    const [editingCard, setEditingCard] = useState<KanbanCard | undefined>()
    const [detailEvent, setDetailEvent] = useState<ScheduleEvent | null>(null)
    const [dragId, setDragId] = useState<string | null>(null)
    const dropRef = useRef<string | null>(null)

    // Day strip navigation
    const [stripOffset, setStripOffset] = useState(0)
    const STRIP_HALF = 7
    const stripDays = Array.from({ length: STRIP_HALF * 2 + 1 }, (_, i) => {
        const d = new Date(today)
        d.setDate(today.getDate() + (i - STRIP_HALF + stripOffset))
        return d
    })

    const selDate = isoToDate(selectedDate)
    const selEvents = scheduleEvents
        .filter((ev) => ev.date === selectedDate)
        .sort((a, b) => a.startHour * 60 + a.startMin - (b.startHour * 60 + b.startMin))

    // ── Kanban drag & drop ──
    function handleDragStart(id: string) { setDragId(id) }
    function handleDragOver(status: KanbanStatus) { dropRef.current = status }
    function handleDrop() {
        if (!dragId || !dropRef.current) return
        setCards((prev) => prev.map((c) => c.id === dragId ? { ...c, status: dropRef.current as KanbanStatus } : c))
        setDragId(null)
        dropRef.current = null
    }

    // ── Task CRUD ──
    function handleAddCard(data: Omit<KanbanCard, 'id'>) {
        setCards((prev) => [...prev, { ...data, id: `k${Date.now()}` }])
    }
    function handleEditCard(data: Omit<KanbanCard, 'id'>) {
        if (!editingCard) return
        setCards((prev) => prev.map((c) => c.id === editingCard.id ? { ...c, ...data } : c))
        setEditingCard(undefined)
    }
    function handleDeleteCard(id: string) {
        setCards((prev) => prev.filter((c) => c.id !== id))
    }

    // ── Timeline hours ──
    const HOURS = Array.from({ length: 13 }, (_, i) => i + 8)   // 08:00–20:00

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <CourseShellLayout language={language} onLanguageChange={onLanguageChange} title="Расписание" activePage="schedule">
            <div className="sched-page">

                {/* ══ CENTER PANEL ═══════════════════════════════════════════════════ */}
                <div className="sched-center">

                    {/* ─ View toggle ─ */}
                    <div className="sched-view-toggle">
                        <button type="button"
                            className={viewMode === 'schedule' ? 'sched-toggle-btn active' : 'sched-toggle-btn'}
                            onClick={() => setViewMode('schedule')}>
                            <Calendar size={15} /> Расписание
                        </button>
                        <button type="button"
                            className={viewMode === 'kanban' ? 'sched-toggle-btn active' : 'sched-toggle-btn'}
                            onClick={() => setViewMode('kanban')}>
                            <KanbanSquare size={15} /> Канбан
                        </button>
                    </div>

                    {/* ─ SCHEDULE VIEW ─ */}
                    {viewMode === 'schedule' && (
                        <div className="sched-card">
                            {/* Month + year nav */}
                            <div className="sched-month-header">
                                <div className="sched-month-label">
                                    <span className="sched-month-name">{MONTHS_RU[selDate.getMonth()]}</span>
                                    <span className="sched-month-year">{selDate.getFullYear()}</span>
                                </div>
                                <div className="sched-month-nav">
                                    <button type="button" aria-label="Назад" onClick={() => setStripOffset((v) => v - 7)}><ChevronLeft size={15} /></button>
                                    <button type="button" aria-label="Вперёд" onClick={() => setStripOffset((v) => v + 7)}><ChevronRight size={15} /></button>
                                </div>
                            </div>

                            {/* Month strip */}
                            <div className="sched-month-strip">
                                {MONTHS_SHORT.map((m, i) => {
                                    const isSel = selDate.getMonth() === i && selDate.getFullYear() === today.getFullYear()
                                    return (
                                        <button key={m} type="button"
                                            className={isSel ? 'sched-month-chip active' : 'sched-month-chip'}
                                            onClick={() => setSelectedDate(`${selDate.getFullYear()}-${fmt2(i + 1)}-${fmt2(selDate.getDate())}`)}>
                                            {m}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Day strip */}
                            <div className="sched-day-strip">
                                {stripDays.map((d) => {
                                    const iso = dateToIso(d)
                                    const isToday = iso === todayStr()
                                    const isSel = iso === selectedDate
                                    const hasEv = scheduleEvents.some((ev) => ev.date === iso)
                                    return (
                                        <button key={iso} type="button"
                                            className={`sched-day-cell ${isSel ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                            onClick={() => setSelectedDate(iso)}>
                                            <span className="sched-day-label">{DAYS_RU[d.getDay()]}</span>
                                            <span className="sched-day-num">{d.getDate()}</span>
                                            {hasEv && <span className="sched-day-dot" />}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Timeline */}
                            <div className="sched-timeline">
                                <div className="sched-timeline-grid">
                                    {HOURS.map((h) => {
                                        const hStr = `${fmt2(h)}:00`
                                        const eventsAtHour = selEvents.filter((ev) => ev.startHour === h)
                                        return (
                                            <div key={h} className="sched-timeline-row">
                                                <span className="sched-time-label">{hStr}</span>
                                                <div className="sched-timeline-slot">
                                                    {eventsAtHour.map((ev) => (
                                                        <EventBlock key={ev.id} ev={ev} onClick={() => setDetailEvent(ev)} />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                {selEvents.length === 0 && (
                                    <div className="sched-empty">Занятий нет. Свободный день! 🎉</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ─ KANBAN VIEW ─ */}
                    {viewMode === 'kanban' && (
                        <div className="kanban-board-wrap">
                            <div className="kanban-board">
                                {KANBAN_COLUMNS.map((col) => {
                                    const colCards = cards.filter((c) => c.status === col.id)
                                    return (
                                        <div key={col.id} className="kanban-col"
                                            onDragOver={(e) => { e.preventDefault(); handleDragOver(col.id) }}
                                            onDrop={handleDrop}>
                                            {/* Column header */}
                                            <div className="kanban-col-header" style={{ background: col.bg }}>
                                                <div className="kanban-col-title">
                                                    <span className="kanban-col-dot" style={{ background: col.color }} />
                                                    <span style={{ color: col.color, fontWeight: 700 }}>{col.label}</span>
                                                    <span className="kanban-col-count" style={{ background: `${col.color}22`, color: col.color }}>
                                                        {colCards.length}
                                                    </span>
                                                </div>
                                                <button type="button" className="kanban-add-card-btn"
                                                    style={{ color: col.color }}
                                                    aria-label={`Добавить в ${col.label}`}
                                                    onClick={() => { setEditingCard({ id: '', title: '', status: col.id, priority: 'medium', tags: [], color: 'blue' }); setShowTaskModal(true) }}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            {/* Cards */}
                                            <div className="kanban-col-cards">
                                                {colCards.map((card) => (
                                                    <KanbanCardItem
                                                        key={card.id}
                                                        card={card}
                                                        onDragStart={handleDragStart}
                                                        onEdit={(c) => { setEditingCard(c); setShowTaskModal(true) }}
                                                        onDelete={handleDeleteCard}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* ══ RIGHT PANEL ════════════════════════════════════════════════════ */}
                <aside className="sched-right">
                    {/* Date heading */}
                    <div className="sched-right-date">
                        <div>
                            <span className="sched-date-day">{selDate.getDate()} </span>
                            <span className="sched-date-month">{MONTHS_RU[selDate.getMonth()]}</span>
                            <p className="sched-date-weekday">{DAYS_FULL[selDate.getDay()]}</p>
                        </div>
                        <div className="sched-right-date-nav">
                            <button type="button" aria-label="Предыдущий день"
                                onClick={() => {
                                    const d = isoToDate(selectedDate)
                                    d.setDate(d.getDate() - 1)
                                    setSelectedDate(dateToIso(d))
                                }}>
                                <ChevronLeft size={15} />
                            </button>
                            <button type="button" aria-label="Следующий день"
                                onClick={() => {
                                    const d = isoToDate(selectedDate)
                                    d.setDate(d.getDate() + 1)
                                    setSelectedDate(dateToIso(d))
                                }}>
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>

                    {/* Mini calendar */}
                    <MiniCalendar viewDate={selDate} selectedDate={selectedDate} onSelect={setSelectedDate} />

                    {/* Add task button */}
                    <button type="button" className="sched-add-task-btn"
                        onClick={() => { setEditingCard(undefined); setShowTaskModal(true) }}>
                        <Plus size={16} /> Добавить задачу
                    </button>

                    {/* Course stats */}
                    <div className="sched-stats-row">
                        <div className="sched-stat-box">
                            <span className="sched-stat-num violet">08</span>
                            <span className="sched-stat-label">Курсов в работе</span>
                        </div>
                        <div className="sched-stat-sep" />
                        <div className="sched-stat-box">
                            <span className="sched-stat-num green">23</span>
                            <span className="sched-stat-label">Завершено</span>
                        </div>
                    </div>

                    {/* Reminders */}
                    <div className="sched-reminders">
                        <div className="sched-section-title">
                            <Bell size={14} /> Напоминания
                        </div>
                        <div className="sched-reminder-list">
                            {reminders.map((r) => (
                                <div key={r.id} className="sched-reminder-row">
                                    <div className="sched-reminder-icon" style={{ background: r.iconBg }}>
                                        <LayoutGrid size={13} color={r.iconColor} />
                                    </div>
                                    <div className="sched-reminder-info">
                                        <p className="sched-reminder-title">{r.title}</p>
                                        <p className="sched-reminder-time">{r.time}</p>
                                    </div>
                                    <button type="button" className="sched-reminder-more" aria-label="Ещё"><MoreHorizontal size={13} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Today's events count */}
                    {viewMode === 'schedule' && (
                        <div className="sched-day-count">
                            <span className="sched-day-count-num" style={{ color: '#6c8cf8' }}>{selEvents.length}</span>
                            <span className="sched-day-count-label">занятий сегодня</span>
                        </div>
                    )}
                    {viewMode === 'kanban' && (
                        <div className="sched-day-count" style={{ flexDirection: 'column', gap: 8 }}>
                            {KANBAN_COLUMNS.map((col) => (
                                <div key={col.id} className="sched-kb-stat">
                                    <span className="kanban-col-dot" style={{ background: col.color }} />
                                    <span style={{ fontSize: 12, color: '#657389', flex: 1 }}>{col.label}</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: col.color }}>
                                        {cards.filter((c) => c.status === col.id).length}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </aside>
            </div>

            {/* Modals */}
            {showTaskModal && (
                <TaskModal
                    initial={editingCard}
                    onClose={() => { setShowTaskModal(false); setEditingCard(undefined) }}
                    onSave={editingCard?.id ? handleEditCard : handleAddCard}
                />
            )}
            {detailEvent && <EventDetail ev={detailEvent} onClose={() => setDetailEvent(null)} />}
        </CourseShellLayout>
    )
}
