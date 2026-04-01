import type { Language } from '../i18n/translations'
import { TeacherShellLayout } from './TeacherShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

const TOP_STATS = [
    { label: 'Просмотров курсов', value: '12 480', change: '+18%', up: true },
    { label: 'Новых записей', value: '247', change: '+12%', up: true },
    { label: 'Завершаемость', value: '64%', change: '+5%', up: true },
    { label: 'Доход', value: '52 000 ₸', change: '+19%', up: true },
]

// Monthly enrollment data (last 6 months)
const MONTHLY = [
    { month: 'Окт', value: 28 },
    { month: 'Ноя', value: 42 },
    { month: 'Дек', value: 35 },
    { month: 'Янв', value: 51 },
    { month: 'Фев', value: 67 },
    { month: 'Мар', value: 82 },
]
const MAX_VAL = Math.max(...MONTHLY.map((m) => m.value))

// Completion rate per course (last 6 months)
const COMPLETION = [
    { month: 'Окт', value: 55 },
    { month: 'Ноя', value: 58 },
    { month: 'Дек', value: 52 },
    { month: 'Янв', value: 60 },
    { month: 'Фев', value: 63 },
    { month: 'Мар', value: 70 },
]

const COURSE_PERF = [
    { title: 'Figma Basic to Advance', views: 4200, enrollments: 98, completion: 72, rating: 4.9, revenue: '24 500 ₸' },
    { title: 'Graphic Design Pro', views: 3100, enrollments: 74, completion: 58, rating: 4.7, revenue: '15 800 ₸' },
    { title: 'UI/UX Masterclass', views: 3800, enrollments: 56, completion: 81, rating: 4.8, revenue: '9 200 ₸' },
    { title: 'Illustration Camp', views: 1380, enrollments: 19, completion: 44, rating: 4.6, revenue: '2 500 ₸' },
]

export function TeacherAnalyticsPage({ language, onLanguageChange }: Props) {
    return (
        <TeacherShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Аналитика"
            activePage="t-analytics"
        >
            <div className="ta-root">

                {/* ── Top stats ─────────────────────────────────────────────────── */}
                <div className="ta-stats-row">
                    {TOP_STATS.map((s) => (
                        <div key={s.label} className="ta-stat-card">
                            <span className="ta-stat-value">{s.value}</span>
                            <span className="ta-stat-label">{s.label}</span>
                            <span className={`ta-stat-change ${s.up ? 'up' : 'down'}`}>{s.change} за месяц</span>
                        </div>
                    ))}
                </div>

                {/* ── Charts row ────────────────────────────────────────────────── */}
                <div className="ta-charts-row">

                    {/* Enrollments bar chart */}
                    <div className="ta-chart-card">
                        <h3 className="ta-chart-title">Записи на курсы — последние 6 месяцев</h3>
                        <div className="ta-bar-chart">
                            {MONTHLY.map((m) => (
                                <div key={m.month} className="ta-bar-col">
                                    <span className="ta-bar-value">{m.value}</span>
                                    <div
                                        className="ta-bar"
                                        style={{ height: `${(m.value / MAX_VAL) * 100}%` }}
                                        title={`${m.month}: ${m.value}`}
                                    />
                                    <span className="ta-bar-label">{m.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Completion line chart (represented as area bars) */}
                    <div className="ta-chart-card">
                        <h3 className="ta-chart-title">Завершаемость (%) — последние 6 месяцев</h3>
                        <div className="ta-line-chart">
                            {COMPLETION.map((m, i) => (
                                <div key={m.month} className="ta-line-col">
                                    <span className="ta-bar-value">{m.value}%</span>
                                    <div
                                        className="ta-line-bar"
                                        style={{ height: `${m.value}%` }}
                                    />
                                    <span className="ta-bar-label">{m.month}</span>
                                    {i < COMPLETION.length - 1 && (
                                        <div
                                            className="ta-line-connector"
                                            style={{
                                                bottom: `calc(${m.value}% + 2px)`,
                                                right: '-50%',
                                                height: `${Math.abs(COMPLETION[i + 1].value - m.value)}%`,
                                                transform: COMPLETION[i + 1].value > m.value ? 'skewY(-15deg)' : 'skewY(15deg)',
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Course performance table ───────────────────────────────────── */}
                <div className="ta-section">
                    <h3 className="ta-section-title">Эффективность курсов</h3>
                    <div className="ta-table-wrap">
                        <table className="ta-table">
                            <thead>
                                <tr>
                                    <th>Курс</th>
                                    <th>Просмотры</th>
                                    <th>Записей</th>
                                    <th>Завершаемость</th>
                                    <th>Рейтинг</th>
                                    <th>Доход</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COURSE_PERF.map((c) => (
                                    <tr key={c.title}>
                                        <td className="ta-course-name">{c.title}</td>
                                        <td>{c.views.toLocaleString()}</td>
                                        <td>{c.enrollments}</td>
                                        <td>
                                            <div className="ta-progress-wrap">
                                                <div className="ta-progress-track">
                                                    <div className="ta-progress-fill" style={{ width: `${c.completion}%` }} />
                                                </div>
                                                <span>{c.completion}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="ta-rating">★ {c.rating}</span>
                                        </td>
                                        <td className="ta-revenue">{c.revenue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </TeacherShellLayout>
    )
}
