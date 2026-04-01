import { useState } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { ParentShellLayout } from './ParentShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

const SUBJECTS = ['Математика', 'Физика', 'Химия', 'История', 'Русский язык', 'Литература']

type GradeEntry = { day: number; grade: number; type: string; comment?: string }

const MATH_GRADES: GradeEntry[] = [
    { day: 1, grade: 5, type: 'КР', comment: 'Отлично решила контрольную' },
    { day: 3, grade: 4, type: 'СР' },
    { day: 5, grade: 5, type: 'Уст' },
    { day: 8, grade: 4, type: 'ДЗ' },
    { day: 10, grade: 5, type: 'КР', comment: 'Превосходная работа!' },
    { day: 12, grade: 4, type: 'ДЗ' },
    { day: 15, grade: 5, type: 'Уст' },
    { day: 17, grade: 5, type: 'СР' },
    { day: 19, grade: 3, type: 'ДЗ', comment: 'Допущены ошибки в уравнениях' },
    { day: 22, grade: 5, type: 'КР', comment: 'Отличная подготовка' },
    { day: 24, grade: 4, type: 'ДЗ' },
]

const MONTHLY_AVG = [
    { month: 'Сен', avg: 4.5 },
    { month: 'Окт', avg: 4.6 },
    { month: 'Ноя', avg: 4.7 },
    { month: 'Дек', avg: 4.4 },
    { month: 'Янв', avg: 4.5 },
    { month: 'Фев', avg: 4.8 },
    { month: 'Мар', avg: 4.8 },
]

const MAX_AVG = 5

const SUBJECT_STATS = [
    { subj: 'Математика', avg: 4.8, count: 23, dist: [12, 8, 3, 0], trend: 'up', change: '+0.3', teacher: 'А. Сейтказина' },
    { subj: 'Физика', avg: 4.2, count: 18, dist: [6, 9, 3, 0], trend: 'down', change: '−0.2', teacher: 'Р. Байтенов' },
    { subj: 'Химия', avg: 4.6, count: 19, dist: [11, 7, 1, 0], trend: 'up', change: '+0.1', teacher: 'Г. Ким' },
    { subj: 'История', avg: 4.2, count: 16, dist: [5, 9, 2, 0], trend: 'flat', change: '0', teacher: 'Д. Серик' },
    { subj: 'Русский язык', avg: 3.9, count: 20, dist: [4, 8, 7, 1], trend: 'down', change: '−0.4', teacher: 'З. Абуова' },
    { subj: 'Литература', avg: 4.5, count: 14, dist: [8, 5, 1, 0], trend: 'flat', change: '0', teacher: 'З. Абуова' },
]

const TYPE_LABEL: Record<string, string> = {
    КР: 'Контрольная', СР: 'Самостоятельная', ДЗ: 'Домашняя', Уст: 'Устный ответ',
}
const TYPE_CSS: Record<string, string> = {
    КР: 'cr', СР: 'sr', ДЗ: 'hw', Уст: 'oral',
}

const DAYS_IN_MONTH = Array.from({ length: 30 }, (_, i) => i + 1)
// April 2026 starts on Wednesday → offset 2 (Mon=0)
const APRIL_OFFSET = 2

export function ParentGradesPage({ language, onLanguageChange }: Props) {
    const [activeSubj, setActiveSubj] = useState('Математика')
    const selected = SUBJECT_STATS.find((s) => s.subj === activeSubj)!
    const maxDist = Math.max(...selected.dist, 1)

    return (
        <ParentShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Успеваемость"
            subtitle="Журнал оценок и аналитика по предметам"
            activePage="p-grades"
        >
            {/* ── Subject tabs ── */}
            <div className="pg-tabs">
                {SUBJECTS.map((s) => (
                    <button
                        key={s}
                        type="button"
                        className={`pg-tab${activeSubj === s ? ' active' : ''}`}
                        onClick={() => setActiveSubj(s)}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* ── Subject summary card ── */}
            <div className="pg-summary-card">
                <div className="pg-summary-left">
                    <h2 className="pg-summary-name">{activeSubj}</h2>
                    <p className="pg-summary-meta">
                        {selected.count} оценок за год&nbsp;·&nbsp;Учитель: {selected.teacher}
                    </p>
                </div>
                <div className="pg-summary-right">
                    <span className={`pg-avg-badge ${selected.avg >= 4.5 ? 'hi' : selected.avg >= 4.0 ? 'mid' : 'lo'}`}>
                        {selected.avg}
                    </span>
                    <span className={`pg-trend-badge ${selected.trend}`}>
                        {selected.trend === 'up' && <TrendingUp size={13} />}
                        {selected.trend === 'down' && <TrendingDown size={13} />}
                        {selected.change}
                    </span>
                </div>
            </div>

            {/* ── Calendar + Distribution ── */}
            <div className="pg-two-col">

                {/* Grade calendar */}
                <div className="pg-card">
                    <h3 className="pg-card-title">Журнал оценок — апрель 2026</h3>

                    {/* Weekday headers */}
                    <div className="pg-cal-weekdays">
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
                            <span key={d} className="pg-cal-wd">{d}</span>
                        ))}
                    </div>

                    <div className="pg-calendar">
                        {/* offset empty cells */}
                        {Array.from({ length: APRIL_OFFSET }).map((_, i) => (
                            <div key={`e${i}`} className="pg-cal-day empty" />
                        ))}
                        {DAYS_IN_MONTH.map((d) => {
                            const entry = MATH_GRADES.find((g) => g.day === d)
                            return (
                                <div
                                    key={d}
                                    className={`pg-cal-day${entry ? ` g${entry.grade}` : ''}`}
                                    title={entry?.comment ?? undefined}
                                >
                                    <span className="pg-day-num">{d}</span>
                                    {entry && (
                                        <>
                                            <span className="pg-day-grade">{entry.grade}</span>
                                            <span className="pg-day-type">{entry.type}</span>
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Distribution + trend */}
                <div className="pg-right-col">

                    <div className="pg-card">
                        <h3 className="pg-card-title">Распределение оценок</h3>
                        <div className="pg-dist-list">
                            {[5, 4, 3, 2].map((g, i) => (
                                <div key={g} className="pg-dist-row">
                                    <span className={`pg-dist-label g${g}`}>{g}</span>
                                    <div className="pg-dist-bar-wrap">
                                        <div
                                            className={`pg-dist-fill g${g}`}
                                            style={{ width: `${(selected.dist[i] / maxDist) * 100}%` }}
                                        />
                                    </div>
                                    <span className="pg-dist-count">{selected.dist[i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pg-card">
                        <h3 className="pg-card-title">Динамика по месяцам</h3>
                        <div className="pg-bars">
                            {MONTHLY_AVG.map((m) => (
                                <div key={m.month} className="pg-bar-col">
                                    <span className="pg-bar-val">{m.avg}</span>
                                    <div
                                        className="pg-bar"
                                        style={{ height: `${(m.avg / MAX_AVG) * 100}%` }}
                                    />
                                    <span className="pg-bar-lbl">{m.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Type legend ── */}
            <div className="pg-type-chips">
                {Object.entries(TYPE_LABEL).map(([abbr, label]) => (
                    <span key={abbr} className={`pg-type-chip ${TYPE_CSS[abbr]}`}>
                        <strong>{abbr}</strong> — {label}
                    </span>
                ))}
            </div>

            {/* ── Detailed journal ── */}
            <div className="pg-card">
                <h3 className="pg-card-title">Детальный журнал</h3>
                <div className="pg-journal-wrap">
                    <table className="pg-journal">
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Тип работы</th>
                                <th>Оценка</th>
                                <th>Комментарий учителя</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MATH_GRADES.map((e, i) => (
                                <tr key={i}>
                                    <td className="pg-journal-date">{e.day} апр. 2026</td>
                                    <td>
                                        <span className={`pg-type-chip ${TYPE_CSS[e.type]}`}>
                                            {TYPE_LABEL[e.type]}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`pg-grade-badge g${e.grade}`}>{e.grade}</span>
                                    </td>
                                    <td className="pg-journal-comment">{e.comment ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── AI forecast ── */}
            <div className="pg-forecast">
                <span className="pg-forecast-emoji">🤖</span>
                <div>
                    <p className="pg-forecast-label">AI-прогноз итоговой оценки</p>
                    <p className="pg-forecast-text">
                        По текущей динамике Анна получит <strong>5</strong> за четверть по {activeSubj.toLowerCase()}.
                        Для подтверждения нужно сдать следующую контрольную не ниже «4».
                    </p>
                </div>
            </div>
        </ParentShellLayout>
    )
}
