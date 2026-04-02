import { useState } from 'react'
import { Download, Search } from 'lucide-react'
import { TeacherShellLayout } from './TeacherShellLayout'
import type { Language } from '../i18n/translations'

/* ── Data ──────────────────────────────────────────────────────── */
const CLASSES = ['10А', '10Б', '11А', '11Б']
const SUBJECTS = ['Математика', 'Физика', 'Химия', 'Информатика', 'История', 'Английский']
const PERIODS = ['1 четверть', '2 четверть', '3 четверть', '4 четверть', 'Год']

interface Student {
    id: string
    name: string
    avatar: string
    color: string
    grades: Record<string, number | null>
}

const STUDENTS_DATA: Student[] = [
    {
        id: 's1', name: 'Алия Бекова', avatar: 'А', color: '#f59e0b',
        grades: { Математика: 5, Физика: 4, Химия: 4, Информатика: 5, История: 5, Английский: 4 }
    },
    {
        id: 's2', name: 'Данияр Сейткали', avatar: 'Д', color: '#3b82f6',
        grades: { Математика: 4, Физика: 5, Химия: 3, Информатика: 5, История: 4, Английский: 4 }
    },
    {
        id: 's3', name: 'Жанар Нурланова', avatar: 'Ж', color: '#10b981',
        grades: { Математика: 3, Физика: 3, Химия: 5, Информатика: 4, История: 5, Английский: 5 }
    },
    {
        id: 's4', name: 'Айдос Омаров', avatar: 'А', color: '#7c3aed',
        grades: { Математика: 5, Физика: 5, Химия: 4, Информатика: 5, История: 3, Английский: 3 }
    },
    {
        id: 's5', name: 'Малика Касымова', avatar: 'М', color: '#ef4444',
        grades: { Математика: 4, Физика: 3, Химия: 4, Информатика: 4, История: 4, Английский: 5 }
    },
    {
        id: 's6', name: 'Нурсат Ахметов', avatar: 'Н', color: '#ec4899',
        grades: { Математика: 2, Физика: 3, Химия: 3, Информатика: 3, История: 4, Английский: 3 }
    },
    {
        id: 's7', name: 'Сара Жаксыбекова', avatar: 'С', color: '#0ea5e9',
        grades: { Математика: 5, Физика: 4, Химия: 5, Информатика: 5, История: 5, Английский: 5 }
    },
    {
        id: 's8', name: 'Ерлан Тасбеков', avatar: 'Е', color: '#f97316',
        grades: { Математика: 3, Физика: 4, Химия: 3, Информатика: 4, История: 3, Английский: 4 }
    },
    {
        id: 's9', name: 'Гульнар Оразова', avatar: 'Г', color: '#84cc16',
        grades: { Математика: 4, Физика: 4, Химия: 4, Информатика: 3, История: 4, Английский: 4 }
    },
    {
        id: 's10', name: 'Бекзат Усенов', avatar: 'Б', color: '#06b6d4',
        grades: { Математика: 5, Физика: 5, Химия: 5, Информатика: 5, История: 5, Английский: 5 }
    },
]

function gradeClass(g: number | null): string {
    if (g === null) return ''
    if (g === 5) return 'tg-grade-5'
    if (g === 4) return 'tg-grade-4'
    if (g === 3) return 'tg-grade-3'
    return 'tg-grade-2'
}

function avg(grades: (number | null)[]): string {
    const valid = grades.filter(g => g !== null) as number[]
    if (!valid.length) return '—'
    return (valid.reduce((s, g) => s + g, 0) / valid.length).toFixed(1)
}

/* ── Component ─────────────────────────────────────────────────── */
type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function TeacherGradesPage({ language, onLanguageChange }: Props) {
    const [activeClass, setActiveClass] = useState('10А')
    const [activeSubject, setActiveSubject] = useState('Все предметы')
    const [activePeriod, setActivePeriod] = useState('3 четверть')
    const [search, setSearch] = useState('')
    const [grades, setGrades] = useState<Record<string, Record<string, number | null>>>(
        Object.fromEntries(STUDENTS_DATA.map(s => [s.id, { ...s.grades }]))
    )

    const visibleSubjects = activeSubject === 'Все предметы' ? SUBJECTS : [activeSubject]

    const filtered = STUDENTS_DATA.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    )

    const updateGrade = (studentId: string, subject: string, val: string) => {
        const n = val === '' ? null : Math.min(5, Math.max(1, parseInt(val, 10)))
        setGrades(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], [subject]: isNaN(n as number) ? null : n },
        }))
    }

    // Summary stats
    const allGradesFlat = STUDENTS_DATA.flatMap(s =>
        Object.values(grades[s.id] ?? {}).filter(g => g !== null)
    ) as number[]
    const classAvg = allGradesFlat.length
        ? (allGradesFlat.reduce((a, b) => a + b, 0) / allGradesFlat.length).toFixed(1)
        : '—'
    const countFives = allGradesFlat.filter(g => g === 5).length
    const countTwos = allGradesFlat.filter(g => g === 2).length

    return (
        <TeacherShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Журнал оценок"
            activePage="t-grades"
        >
            <div className="tg-page">

                {/* Toolbar */}
                <div className="tg-toolbar">
                    <h2 className="tg-toolbar-title">Журнал оценок</h2>
                    <select className="tg-select" value={activeClass} onChange={e => setActiveClass(e.target.value)}>
                        {CLASSES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <select className="tg-select" value={activeSubject} onChange={e => setActiveSubject(e.target.value)}>
                        <option>Все предметы</option>
                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <select className="tg-select" value={activePeriod} onChange={e => setActivePeriod(e.target.value)}>
                        {PERIODS.map(p => <option key={p}>{p}</option>)}
                    </select>
                    <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
                        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 32, paddingRight: 10, paddingTop: 9, paddingBottom: 9, border: '1.5px solid #e8eaf0', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#1f2937' }}
                            placeholder="Поиск ученика..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button type="button" className="tg-btn secondary" style={{ gap: 6, display: 'flex', alignItems: 'center' }}>
                        <Download size={14} /> Экспорт
                    </button>
                    <button type="button" className="tg-btn">Сохранить</button>
                </div>

                {/* Summary */}
                <div className="tg-summary-row">
                    <div className="tg-sum-card">
                        <div className="tg-sum-val">{filtered.length}</div>
                        <div className="tg-sum-label">Учеников</div>
                        <span className="tg-sum-dot" style={{ background: '#3b82f6' }} />
                    </div>
                    <div className="tg-sum-card">
                        <div className="tg-sum-val">{classAvg}</div>
                        <div className="tg-sum-label">Средний балл</div>
                        <span className="tg-sum-dot" style={{ background: '#22c55e' }} />
                    </div>
                    <div className="tg-sum-card">
                        <div className="tg-sum-val">{countFives}</div>
                        <div className="tg-sum-label">Отличных оценок</div>
                        <span className="tg-sum-dot" style={{ background: '#22c55e' }} />
                    </div>
                    <div className="tg-sum-card">
                        <div className="tg-sum-val" style={{ color: countTwos > 0 ? '#ef4444' : '#1f2937' }}>{countTwos}</div>
                        <div className="tg-sum-label">Неудовлетворительных</div>
                        <span className="tg-sum-dot" style={{ background: countTwos > 0 ? '#ef4444' : '#e5e7eb' }} />
                    </div>
                </div>

                {/* Grade table */}
                <div className="tg-table-wrap">
                    <table className="tg-table">
                        <thead>
                            <tr>
                                <th style={{ minWidth: 200 }}>Ученик</th>
                                {visibleSubjects.map(s => (
                                    <th key={s} style={{ minWidth: 120 }}>{s}</th>
                                ))}
                                <th>Средний</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(student => {
                                const sGrades = grades[student.id] ?? {}
                                const subjectGrades = visibleSubjects.map(s => sGrades[s] ?? null)
                                return (
                                    <tr key={student.id}>
                                        <td>
                                            <div className="tg-name-cell">
                                                <div
                                                    className="tg-avatar"
                                                    style={{ background: student.color }}
                                                >
                                                    {student.avatar}
                                                </div>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>
                                                    {student.name}
                                                </span>
                                            </div>
                                        </td>
                                        {visibleSubjects.map(s => {
                                            const g = sGrades[s] ?? null
                                            return (
                                                <td key={s}>
                                                    <input
                                                        className="tg-grade-input"
                                                        type="number"
                                                        min="1"
                                                        max="5"
                                                        value={g ?? ''}
                                                        onChange={e => updateGrade(student.id, s, e.target.value)}
                                                        placeholder="—"
                                                    />
                                                </td>
                                            )
                                        })}
                                        <td>
                                            <span className={`tg-grade-badge ${gradeClass(parseFloat(avg(subjectGrades)) >= 4.5 ? 5 : parseFloat(avg(subjectGrades)) >= 3.5 ? 4 : parseFloat(avg(subjectGrades)) >= 2.5 ? 3 : 2)}`}>
                                                {avg(subjectGrades)}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
                    Введите баллы от 1 до 5 · Изменения сохраняются локально
                </p>
            </div>
        </TeacherShellLayout>
    )
}
