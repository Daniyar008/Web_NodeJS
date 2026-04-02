import { useMemo, useState } from 'react'
import { MessageCircle, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Language } from '../i18n/translations'
import { TeacherShellLayout } from './TeacherShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

type Student = {
    id: string
    initials: string
    name: string
    email: string
    course: string
    progress: number
    grade: string
    lastActive: string
    status: 'active' | 'inactive'
}

const STUDENTS: Student[] = [
    { id: 's1', initials: 'АТ', name: 'Аиша Тулегенова', email: 'aisha.t@mail.kz', course: 'Figma Basic', progress: 88, grade: 'A', lastActive: 'Сегодня', status: 'active' },
    { id: 's2', initials: 'НА', name: 'Нурсултан Ахметов', email: 'nursultan@gmail.com', course: 'Figma Advanced', progress: 42, grade: 'B+', lastActive: 'Вчера', status: 'active' },
    { id: 's3', initials: 'ДС', name: 'Диана Сейткали', email: 'diana.s@edu.kz', course: 'UI/UX Masterclass', progress: 95, grade: 'A+', lastActive: 'Сегодня', status: 'active' },
    { id: 's4', initials: 'МБ', name: 'Марат Берденов', email: 'marat.b@mail.kz', course: 'Graphic Design', progress: 31, grade: 'C', lastActive: '3 дня назад', status: 'inactive' },
    { id: 's5', initials: 'ЗК', name: 'Зарина Кенжебаева', email: 'zarina.k@kz.edu', course: 'Figma Basic', progress: 67, grade: 'B', lastActive: '2 дня назад', status: 'active' },
    { id: 's6', initials: 'АС', name: 'Алибек Сейтов', email: 'alibek.s@gmail.com', course: 'Illustration', progress: 55, grade: 'B-', lastActive: 'Вчера', status: 'active' },
    { id: 's7', initials: 'РМ', name: 'Руслан Муратов', email: 'ruslan.m@edu.kz', course: 'Graphic Design', progress: 12, grade: 'D', lastActive: '7 дней назад', status: 'inactive' },
    { id: 's8', initials: 'СБ', name: 'Салтанат Бекова', email: 'saltanat@mail.kz', course: 'UI/UX Masterclass', progress: 78, grade: 'A-', lastActive: 'Сегодня', status: 'active' },
    { id: 's9', initials: 'КА', name: 'Камила Абдрахманова', email: 'kamila.a@kz.edu', course: 'Figma Advanced', progress: 61, grade: 'B+', lastActive: 'Вчера', status: 'active' },
    { id: 's10', initials: 'ТЕ', name: 'Тимур Ержанов', email: 'timur.e@gmail.com', course: 'Illustration', progress: 90, grade: 'A', lastActive: 'Сегодня', status: 'active' },
]

const COURSES = ['Все курсы', 'Figma Basic', 'Figma Advanced', 'UI/UX Masterclass', 'Graphic Design', 'Illustration']

const GRADE_COLOR: Record<string, string> = {
    'A+': '#22c55e', 'A': '#22c55e', 'A-': '#4ade80',
    'B+': '#3b82f6', 'B': '#3b82f6', 'B-': '#60a5fa',
    'C': '#f59e0b', 'D': '#ef4444',
}

export function TeacherStudentsPage({ language, onLanguageChange }: Props) {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [courseFilter, setCourseFilter] = useState('Все курсы')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
    const [sortBy, setSortBy] = useState<'name' | 'progress' | 'grade'>('name')

    const visible = useMemo(() => {
        let list = STUDENTS
        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter(
                (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q),
            )
        }
        if (courseFilter !== 'Все курсы') {
            list = list.filter((s) => s.course === courseFilter)
        }
        if (statusFilter !== 'all') {
            list = list.filter((s) => s.status === statusFilter)
        }
        if (sortBy === 'progress') list = [...list].sort((a, b) => b.progress - a.progress)
        if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
        if (sortBy === 'grade') list = [...list].sort((a, b) => a.grade.localeCompare(b.grade))
        return list
    }, [search, courseFilter, statusFilter, sortBy])

    return (
        <TeacherShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Ученики"
            activePage="t-students"
        >
            <div className="ts-root">

                {/* ── Toolbar ───────────────────────────────────────────────────── */}
                <div className="ts-toolbar">
                    <div className="ts-search-wrap">
                        <Search size={14} className="ts-search-icon" />
                        <input
                            className="ts-search"
                            placeholder="Поиск по имени или email…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="ts-select"
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.target.value)}
                        aria-label="Filter by course"
                    >
                        {COURSES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <select
                        className="ts-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        aria-label="Filter by status"
                    >
                        <option value="all">Все статусы</option>
                        <option value="active">Активные</option>
                        <option value="inactive">Неактивные</option>
                    </select>
                    <select
                        className="ts-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        aria-label="Sort students"
                    >
                        <option value="name">По имени</option>
                        <option value="progress">По прогрессу</option>
                        <option value="grade">По оценке</option>
                    </select>
                </div>

                {/* ── Summary chips ─────────────────────────────────────────────── */}
                <div className="ts-chips">
                    <span className="ts-chip">Всего: {STUDENTS.length}</span>
                    <span className="ts-chip active">Активных: {STUDENTS.filter((s) => s.status === 'active').length}</span>
                    <span className="ts-chip inactive">Неактивных: {STUDENTS.filter((s) => s.status === 'inactive').length}</span>
                </div>

                {/* ── Table ─────────────────────────────────────────────────────── */}
                <div className="ts-table-wrap">
                    <table className="ts-table">
                        <thead>
                            <tr>
                                <th>Ученик</th>
                                <th>Курс</th>
                                <th>Прогресс</th>
                                <th>Оценка</th>
                                <th>Последняя активность</th>
                                <th>Статус</th>
                                <th>Чат</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((s) => (
                                <tr key={s.id}>
                                    <td>
                                        <div className="ts-student-cell">
                                            <div className="ts-avatar">{s.initials}</div>
                                            <div className="ts-student-info">
                                                <span className="ts-student-name">{s.name}</span>
                                                <span className="ts-student-email">{s.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="ts-course-badge">{s.course}</span></td>
                                    <td>
                                        <div className="ts-progress-wrap">
                                            <div className="ts-progress-track">
                                                <div
                                                    className="ts-progress-fill"
                                                    style={{ width: `${s.progress}%` }}
                                                />
                                            </div>
                                            <span className="ts-progress-pct">{s.progress}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            className="ts-grade"
                                            style={{ color: GRADE_COLOR[s.grade] ?? '#9099a8' }}
                                        >
                                            {s.grade}
                                        </span>
                                    </td>
                                    <td className="ts-last-active">{s.lastActive}</td>
                                    <td>
                                        <span className={`ts-status-badge ${s.status}`}>
                                            {s.status === 'active' ? 'Активен' : 'Неактивен'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="ts-chat-btn"
                                            onClick={() => navigate('/teacher/chat')}
                                            title="Написать"
                                        >
                                            <MessageCircle size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visible.length === 0 && (
                        <div className="ts-empty">Нет учеников по выбранным фильтрам</div>
                    )}
                </div>
            </div>
        </TeacherShellLayout>
    )
}
