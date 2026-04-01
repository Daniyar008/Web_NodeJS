import { useState } from 'react'
import type { Language } from '../i18n/translations'
import { ParentShellLayout } from './ParentShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

// 0=absent 1=present 2=late 3=excused null=no school
type DayStatus = 0 | 1 | 2 | 3 | null

const APRIL: DayStatus[] = [
    null, 1, 1, 1, 1, 1, null, null, // 1–7
    1, 1, 0, 1, 1, null, null,       // 8–14
    1, 2, 1, 1, 1, null, null,       // 15–21
    1, 1, 1, 1, 3, null, null,       // 22–28
    1, 1,                             // 29–30
]

const STATUS_LABEL: Record<number, string> = { 0: 'Отсутствовал', 1: 'Присутствовал', 2: 'Опоздал', 3: 'По уважительной' }
const STATUS_CLASS: Record<number, string> = { 0: 'absent', 1: 'present', 2: 'late', 3: 'excused' }
const STATUS_EMOJI: Record<number, string> = { 0: '🔴', 1: '🟢', 2: '🟡', 3: '⚪' }

const STATS = [
    { period: 'Эта неделя', total: 25, present: 23, absent: 1, late: 1, pct: 92 },
    { period: 'Прошлая', total: 25, present: 24, absent: 0, late: 1, pct: 96 },
    { period: 'Этот месяц', total: 100, present: 92, absent: 4, late: 4, pct: 92 },
    { period: 'Четверть', total: 250, present: 235, absent: 10, late: 5, pct: 94 },
]

const ABSENCES = [
    { date: '10 апр', lesson: '2-й урок', subj: 'Химия', teacher: 'Г. Ким', reason: 'Без причины', comment: 'Материал нужно наверстать самостоятельно' },
    { date: '25 апр', lesson: 'Весь день', subj: 'Все уроки', teacher: '—', reason: 'Справка', comment: 'Болезнь' },
    { date: '16 апр', lesson: '1-й урок', subj: 'Матем.', teacher: 'А. Сейтказина', reason: 'Опоздание', comment: 'Опоздала на 5 минут' },
]

export function ParentAttendancePage({ language, onLanguageChange }: Props) {
    const [hoveredDay, setHoveredDay] = useState<number | null>(null)

    return (
        <ParentShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Посещаемость"
            subtitle="Календарь и детали пропусков"
            activePage="p-attendance"
        >
            {/* Legend */}
            <div className="pa-legend">
                {[1, 0, 2, 3].map((s) => (
                    <span key={s} className="pa-legend-item">
                        {STATUS_EMOJI[s]} {STATUS_LABEL[s]}
                    </span>
                ))}
            </div>

            <div className="pa-two-col">
                {/* Calendar heatmap */}
                <div className="pa-card">
                    <h3 className="pa-card-title">Апрель 2026</h3>
                    <div className="pa-weekdays">
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
                            <span key={d} className="pa-weekday">{d}</span>
                        ))}
                    </div>
                    <div className="pa-calendar">
                        {/* April 1 starts on Wednesday (offset 2) */}
                        {[0, 1].map((i) => <div key={`empty-${i}`} className="pa-cal-cell empty" />)}
                        {APRIL.map((status, i) => (
                            <div
                                key={i}
                                className={`pa-cal-cell ${status === null ? 'noschool' : STATUS_CLASS[status]}`}
                                onMouseEnter={() => setHoveredDay(i + 1)}
                                onMouseLeave={() => setHoveredDay(null)}
                                title={status !== null ? `${i + 1} апр — ${STATUS_LABEL[status]}` : undefined}
                            >
                                <span className="pa-cal-num">{i + 1}</span>
                                {hoveredDay === i + 1 && status !== null && (
                                    <div className="pa-tooltip">{STATUS_LABEL[status]}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats table */}
                <div className="pa-card">
                    <h3 className="pa-card-title">Статистика посещаемости</h3>
                    <div className="pa-stats-table-wrap">
                        <table className="pa-stats-table">
                            <thead>
                                <tr>
                                    <th>Период</th>
                                    <th>Всего</th>
                                    <th>Присут.</th>
                                    <th>Пропуск.</th>
                                    <th>Опозд.</th>
                                    <th>%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {STATS.map((s) => (
                                    <tr key={s.period}>
                                        <td>{s.period}</td>
                                        <td>{s.total}</td>
                                        <td className="pa-green">{s.present}</td>
                                        <td className={s.absent > 0 ? 'pa-red' : ''}>{s.absent}</td>
                                        <td className={s.late > 0 ? 'pa-yellow' : ''}>{s.late}</td>
                                        <td>
                                            <span className={`pa-pct-badge ${s.pct >= 95 ? 'hi' : s.pct >= 85 ? 'mid' : 'lo'}`}>
                                                {s.pct}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Progress bar */}
                    <div className="pa-pct-bar-wrap">
                        <div className="pa-pct-bar-track">
                            <div className="pa-pct-bar-fill" style={{ width: '93%' }} />
                        </div>
                        <span className="pa-pct-label">93% за месяц</span>
                    </div>
                </div>
            </div>

            {/* Absence detail */}
            <div className="pa-card">
                <h3 className="pa-card-title">Детали пропусков и опозданий</h3>
                <div className="pa-absences-table-wrap">
                    <table className="pa-absences-table">
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Урок</th>
                                <th>Предмет</th>
                                <th>Учитель</th>
                                <th>Причина</th>
                                <th>Комментарий</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ABSENCES.map((a, i) => (
                                <tr key={i}>
                                    <td>{a.date}</td>
                                    <td>{a.lesson}</td>
                                    <td>{a.subj}</td>
                                    <td>{a.teacher}</td>
                                    <td>
                                        <span className={`pa-reason-badge ${a.reason === 'Без причины' ? 'bad' : a.reason === 'Опоздание' ? 'late' : 'ok'}`}>
                                            {a.reason}
                                        </span>
                                    </td>
                                    <td className="pa-comment">{a.comment}</td>
                                    <td>
                                        {a.reason === 'Без причины' && (
                                            <button className="pa-clarify-btn">Уточнить</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ParentShellLayout>
    )
}
