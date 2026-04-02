import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, X } from 'lucide-react'
import { TeacherShellLayout } from './TeacherShellLayout'
import type { Language } from '../i18n/translations'

/* ── Types ───────────────────────────────────────────────────────── */
interface Lesson {
    id: string
    subject: string
    classGroup: string
    room: string
    day: number       // 0=Mon … 4=Fri
    startSlot: number // index into TIME_SLOTS
    endSlot: number
    color: string
}

/* ── Constants ────────────────────────────────────────────────────── */
const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
const DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']
const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
]
const SUBJECT_COLORS: Record<string, string> = {
    'Математика': '#6366f1',
    'Физика': '#3b82f6',
    'Химия': '#0ea5e9',
    'Информатика': '#8b5cf6',
    'История': '#f59e0b',
    'Английский': '#10b981',
    'Биология': '#22c55e',
    'Литература': '#ec4899',
    'Другое': '#64748b',
}

/* ── Seed data ────────────────────────────────────────────────────── */
const INITIAL_LESSONS: Lesson[] = [
    { id: 'l1', subject: 'Математика', classGroup: '10А', room: '204', day: 0, startSlot: 0, endSlot: 1, color: '#6366f1' },
    { id: 'l2', subject: 'Математика', classGroup: '11Б', room: '204', day: 0, startSlot: 2, endSlot: 3, color: '#6366f1' },
    { id: 'l3', subject: 'Физика', classGroup: '10Б', room: '312', day: 0, startSlot: 4, endSlot: 5, color: '#3b82f6' },
    { id: 'l4', subject: 'Информатика', classGroup: '10А', room: 'Лаб2', day: 1, startSlot: 1, endSlot: 2, color: '#8b5cf6' },
    { id: 'l5', subject: 'Физика', classGroup: '11А', room: '312', day: 1, startSlot: 3, endSlot: 4, color: '#3b82f6' },
    { id: 'l6', subject: 'Математика', classGroup: '10Б', room: '204', day: 1, startSlot: 5, endSlot: 6, color: '#6366f1' },
    { id: 'l7', subject: 'История', classGroup: '11А', room: '110', day: 2, startSlot: 0, endSlot: 1, color: '#f59e0b' },
    { id: 'l8', subject: 'Информатика', classGroup: '11Б', room: 'Лаб2', day: 2, startSlot: 2, endSlot: 3, color: '#8b5cf6' },
    { id: 'l9', subject: 'Математика', classGroup: '11А', room: '204', day: 2, startSlot: 4, endSlot: 5, color: '#6366f1' },
    { id: 'l10', subject: 'Английский', classGroup: '10А', room: '215', day: 3, startSlot: 1, endSlot: 2, color: '#10b981' },
    { id: 'l11', subject: 'Физика', classGroup: '10А', room: '312', day: 3, startSlot: 3, endSlot: 4, color: '#3b82f6' },
    { id: 'l12', subject: 'История', classGroup: '10Б', room: '110', day: 3, startSlot: 5, endSlot: 6, color: '#f59e0b' },
    { id: 'l13', subject: 'Английский', classGroup: '11Б', room: '215', day: 4, startSlot: 0, endSlot: 1, color: '#10b981' },
    { id: 'l14', subject: 'Математика', classGroup: '10А', room: '204', day: 4, startSlot: 2, endSlot: 3, color: '#6366f1' },
    { id: 'l15', subject: 'Информатика', classGroup: '10Б', room: 'Лаб2', day: 4, startSlot: 4, endSlot: 5, color: '#8b5cf6' },
]

const SUBJECTS_LIST = Object.keys(SUBJECT_COLORS).filter(s => s !== 'Другое')
const CLASS_GROUPS = ['10А', '10Б', '11А', '11Б', '9А', '9Б']
const ROOMS = ['204', '205', '312', '110', '215', 'Лаб1', 'Лаб2', 'Спортзал']

/* ── Helper ───────────────────────────────────────────────────────── */
function getWeekRange(offset: number) {
    const now = new Date()
    const mon = new Date(now)
    mon.setDate(now.getDate() - ((now.getDay() + 6) % 7) + offset * 7)
    const fri = new Date(mon)
    fri.setDate(mon.getDate() + 4)
    const fmt = (d: Date) => `${d.getDate()} ${['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'][d.getMonth()]}`
    return `${fmt(mon)} — ${fmt(fri)}`
}

function getTodayIndex() {
    const d = new Date().getDay()
    return d === 0 ? 4 : Math.min(d - 1, 4) // Sun → Fri, clamp to 0-4
}

/* ── Default form ─────────────────────────────────────────────────── */
const DEFAULT_FORM = { subject: 'Математика', classGroup: '10А', room: '204', day: 0, startSlot: 0, endSlot: 1 }

/* ══════════════════════════════════════════════════════════════════ */
export function TeacherSchedulePage({
    language,
    onLanguageChange,
}: {
    language: Language
    onLanguageChange: (l: Language) => void
}) {
    const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS)
    const [weekOffset, setWeekOffset] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [editLesson, setEditLesson] = useState<Lesson | null>(null)
    const [form, setForm] = useState({ ...DEFAULT_FORM })
    const [detailLesson, setDetailLesson] = useState<Lesson | null>(null)
    const todayIdx = getTodayIndex()

    /* Upcoming — next 5 slots from now */
    const upcoming = [...lessons]
        .sort((a, b) => a.day !== b.day ? a.day - b.day : a.startSlot - b.startSlot)
        .filter(l => l.day > todayIdx || (l.day === todayIdx))
        .slice(0, 6)

    /* Open "add" modal */
    function openAdd() {
        setEditLesson(null)
        setForm({ ...DEFAULT_FORM })
        setModalOpen(true)
    }

    /* Open "edit" modal */
    function openEdit(lesson: Lesson, e: React.MouseEvent) {
        e.stopPropagation()
        setEditLesson(lesson)
        setForm({ subject: lesson.subject, classGroup: lesson.classGroup, room: lesson.room, day: lesson.day, startSlot: lesson.startSlot, endSlot: lesson.endSlot })
        setModalOpen(true)
        setDetailLesson(null)
    }

    /* Save lesson */
    function saveLesson() {
        const color = SUBJECT_COLORS[form.subject] ?? '#64748b'
        if (editLesson) {
            setLessons(prev => prev.map(l => l.id === editLesson.id ? { ...l, ...form, color } : l))
        } else {
            setLessons(prev => [...prev, { id: `l${Date.now()}`, ...form, color }])
        }
        setModalOpen(false)
    }

    /* Delete lesson */
    function deleteLesson(id: string) {
        setLessons(prev => prev.filter(l => l.id !== id))
        setDetailLesson(null)
    }

    const SLOT_H = 72 // px per slot

    return (
        <TeacherShellLayout activePage="t-schedule" title="Расписание" language={language} onLanguageChange={onLanguageChange}>
            <div className="tsch-page">

                {/* ── Toolbar ─────────────────────────────────────── */}
                <div className="tsch-toolbar">
                    <div className="tsch-toolbar-left">
                        <h1 className="tsch-title">Расписание</h1>
                        <div className="tsch-week-nav">
                            <button className="tsch-nav-btn" onClick={() => setWeekOffset(o => o - 1)}><ChevronLeft size={16} /></button>
                            <span className="tsch-week-label">
                                {weekOffset === 0 ? 'Текущая неделя' : weekOffset === 1 ? 'Следующая неделя' : weekOffset === -1 ? 'Прошлая неделя' : getWeekRange(weekOffset)}
                                <span className="tsch-week-dates"> · {getWeekRange(weekOffset)}</span>
                            </span>
                            <button className="tsch-nav-btn" onClick={() => setWeekOffset(o => o + 1)}><ChevronRight size={16} /></button>
                        </div>
                    </div>
                    <button className="tsch-add-btn" onClick={openAdd}>
                        <Plus size={16} /> Добавить урок
                    </button>
                </div>

                <div className="tsch-body">
                    {/* ── Sidebar ───────────────────────────────────── */}
                    <aside className="tsch-sidebar">
                        <p className="tsch-sidebar-heading">Ближайшие уроки</p>
                        <ul className="tsch-upcoming-list">
                            {upcoming.map(l => (
                                <li className="tsch-upcoming-item" key={l.id} style={{ borderLeftColor: l.color }}>
                                    <span className="tsch-upcoming-subject">{l.subject}</span>
                                    <div className="tsch-upcoming-meta">
                                        <span><Clock size={11} />{TIME_SLOTS[l.startSlot]}</span>
                                        <span><Users size={11} />{l.classGroup}</span>
                                        <span><MapPin size={11} />{l.room}</span>
                                    </div>
                                    <span className="tsch-upcoming-day">{DAYS_SHORT[l.day]}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Legend */}
                        <p className="tsch-sidebar-heading" style={{ marginTop: 24 }}>Предметы</p>
                        <ul className="tsch-legend">
                            {Object.entries(SUBJECT_COLORS).filter(([k]) => k !== 'Другое').map(([subj, c]) => (
                                <li key={subj} className="tsch-legend-item">
                                    <span className="tsch-legend-dot" style={{ background: c }} />
                                    {subj}
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* ── Calendar Grid ─────────────────────────────── */}
                    <div className="tsch-calendar">
                        {/* Header row */}
                        <div className="tsch-cal-header">
                            <div className="tsch-time-col-head" />
                            {DAYS.map((d, i) => (
                                <div className={`tsch-day-head ${weekOffset === 0 && i === todayIdx ? 'today' : ''}`} key={d}>
                                    <span className="tsch-day-abbr">{DAYS_SHORT[i]}</span>
                                    <span className="tsch-day-full">{d}</span>
                                </div>
                            ))}
                        </div>

                        {/* Grid body */}
                        <div className="tsch-cal-body">
                            {/* Time labels */}
                            <div className="tsch-time-col">
                                {TIME_SLOTS.map(t => (
                                    <div className="tsch-time-slot" key={t} style={{ height: SLOT_H }}>{t}</div>
                                ))}
                            </div>

                            {/* Day columns */}
                            {DAYS.map((_d, dayIdx) => (
                                <div
                                    className={`tsch-day-col ${weekOffset === 0 && dayIdx === todayIdx ? 'today' : ''}`}
                                    key={dayIdx}
                                    style={{ '--slot-h': `${SLOT_H}px` } as React.CSSProperties}
                                >
                                    {/* Slot dividers */}
                                    {TIME_SLOTS.map((_t, si) => (
                                        <div className="tsch-slot-row" key={si} style={{ height: SLOT_H }} />
                                    ))}

                                    {/* Lesson blocks */}
                                    {lessons.filter(l => l.day === dayIdx).map(l => (
                                        <div
                                            key={l.id}
                                            className="tsch-lesson-block"
                                            style={{
                                                top: l.startSlot * SLOT_H + 4,
                                                height: (l.endSlot - l.startSlot) * SLOT_H - 8,
                                                background: l.color + '22',
                                                borderLeft: `3px solid ${l.color}`,
                                            }}
                                            onClick={() => setDetailLesson(l)}
                                        >
                                            <span className="tsch-lb-subject">{l.subject}</span>
                                            <div className="tsch-lb-meta">
                                                <span><Users size={10} />{l.classGroup}</span>
                                                <span><MapPin size={10} />{l.room}</span>
                                            </div>
                                            <span className="tsch-lb-time">{TIME_SLOTS[l.startSlot]}–{TIME_SLOTS[l.endSlot]}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Detail popup ──────────────────────────────────── */}
                {detailLesson && (
                    <div className="tsch-overlay" onClick={() => setDetailLesson(null)}>
                        <div className="tsch-detail-popup" onClick={e => e.stopPropagation()}>
                            <div className="tsch-detail-header" style={{ background: detailLesson.color }}>
                                <span className="tsch-detail-title">{detailLesson.subject}</span>
                                <button className="tsch-close-btn" onClick={() => setDetailLesson(null)}><X size={16} /></button>
                            </div>
                            <div className="tsch-detail-body">
                                <div className="tsch-detail-row"><Clock size={14} /> {TIME_SLOTS[detailLesson.startSlot]} – {TIME_SLOTS[detailLesson.endSlot]}</div>
                                <div className="tsch-detail-row"><Users size={14} /> Класс: <strong>{detailLesson.classGroup}</strong></div>
                                <div className="tsch-detail-row"><MapPin size={14} /> Кабинет: <strong>{detailLesson.room}</strong></div>
                                <div className="tsch-detail-row">
                                    📅 День: <strong>{DAYS[detailLesson.day]}</strong>
                                </div>
                            </div>
                            <div className="tsch-detail-actions">
                                <button className="tsch-edit-btn" onClick={e => openEdit(detailLesson, e)}>Редактировать</button>
                                <button className="tsch-del-btn" onClick={() => deleteLesson(detailLesson.id)}>Удалить</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Add / Edit modal ──────────────────────────────── */}
                {modalOpen && (
                    <div className="tsch-overlay" onClick={() => setModalOpen(false)}>
                        <div className="tsch-modal" onClick={e => e.stopPropagation()}>
                            <div className="tsch-modal-header">
                                <span>{editLesson ? 'Редактировать урок' : 'Новый урок'}</span>
                                <button className="tsch-close-btn" onClick={() => setModalOpen(false)}><X size={16} /></button>
                            </div>
                            <div className="tsch-modal-body">
                                <label className="tsch-label">Предмет
                                    <select className="tsch-select" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                                        {SUBJECTS_LIST.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </label>
                                <label className="tsch-label">Класс
                                    <select className="tsch-select" value={form.classGroup} onChange={e => setForm(f => ({ ...f, classGroup: e.target.value }))}>
                                        {CLASS_GROUPS.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </label>
                                <label className="tsch-label">Кабинет
                                    <select className="tsch-select" value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))}>
                                        {ROOMS.map(r => <option key={r}>{r}</option>)}
                                    </select>
                                </label>
                                <div className="tsch-form-row">
                                    <label className="tsch-label">День
                                        <select className="tsch-select" value={form.day} onChange={e => setForm(f => ({ ...f, day: +e.target.value }))}>
                                            {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                                        </select>
                                    </label>
                                    <label className="tsch-label">Начало
                                        <select className="tsch-select" value={form.startSlot} onChange={e => setForm(f => ({ ...f, startSlot: +e.target.value }))}>
                                            {TIME_SLOTS.slice(0, -1).map((t, i) => <option key={t} value={i}>{t}</option>)}
                                        </select>
                                    </label>
                                    <label className="tsch-label">Конец
                                        <select className="tsch-select" value={form.endSlot} onChange={e => setForm(f => ({ ...f, endSlot: +e.target.value }))}>
                                            {TIME_SLOTS.slice(1).map((t, i) => <option key={t} value={i + 1}>{t}</option>)}
                                        </select>
                                    </label>
                                </div>
                            </div>
                            <div className="tsch-modal-footer">
                                <button className="tsch-cancel-btn" onClick={() => setModalOpen(false)}>Отмена</button>
                                <button className="tsch-save-btn" onClick={saveLesson}>{editLesson ? 'Сохранить' : 'Добавить'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TeacherShellLayout>
    )
}
