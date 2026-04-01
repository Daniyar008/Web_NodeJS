import { useState } from 'react'
import { AlertTriangle, Brain, TrendingDown, TrendingUp } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

const MONTHLY = [
    { month: 'Окт', score: 4.1, attend: 91 },
    { month: 'Ноя', score: 4.2, attend: 92 },
    { month: 'Дек', score: 4.0, attend: 89 },
    { month: 'Янв', score: 4.3, attend: 93 },
    { month: 'Фев', score: 4.4, attend: 94 },
    { month: 'Мар', score: 4.32, attend: 93 },
]
const MAX_SCORE = 5
const MAX_ATTEND = 100

const TEACHERS = [
    { name: 'Алия Сейтказина', subject: 'Математика', avg: 4.8, plan: 96, attend: 98, trend: 'up' },
    { name: 'Руслан Байтенов', subject: 'Физика', avg: 4.7, plan: 93, attend: 96, trend: 'up' },
    { name: 'Горь Ким', subject: 'Химия', avg: 4.6, plan: 92, attend: 94, trend: 'up' },
    { name: 'Данияр Серик', subject: 'История', avg: 4.2, plan: 85, attend: 90, trend: 'neutral' },
    { name: 'Зарина Абуова', subject: 'Русский язык', avg: 3.9, plan: 78, attend: 88, trend: 'down' },
]

const CLASSES = [
    { name: '8А', avg: 4.4, quality: 72, attend: 95, students: 28 },
    { name: '8Б', avg: 4.1, quality: 64, attend: 91, students: 26 },
    { name: '9А', avg: 3.9, quality: 58, attend: 88, students: 25 },
    { name: '9Б', avg: 4.2, quality: 67, attend: 92, students: 27 },
    { name: '10А', avg: 4.5, quality: 76, attend: 96, students: 24 },
    { name: '11А', avg: 4.6, quality: 81, attend: 97, students: 22 },
]

const RISK_STUDENTS = [
    { name: 'Арман Беков', cls: '9А', reason: 'Падение среднего балла на 0.8 за 2 месяца', risk: 87 },
    { name: 'Мадина Жаксыбекова', cls: '8Б', reason: 'Пропуски 33% за месяц', risk: 82 },
    { name: 'Тимур Назаров', cls: '9Б', reason: 'Низкая активность на платформе', risk: 74 },
    { name: 'Адель Каупов', cls: '10А', reason: 'Три неудовлетворительных оценки подряд', risk: 69 },
]

export function InstitutionAnalyticsPage({ language, onLanguageChange }: Props) {
    const [activeTab, setActiveTab] = useState<'teachers' | 'classes' | 'ai'>('teachers')

    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Аналитика"
            subtitle="Метрики по учителям, классам, предметам и AI-прогноз"
            activePage="i-analytics"
        >
            <div className="ia-root">

                {/* KPI row */}
                <div className="ia-kpi-row">
                    <div className="ia-kpi">
                        <TrendingUp size={18} className="ia-kpi-icon up" />
                        <span className="ia-kpi-val">4.32</span>
                        <span className="ia-kpi-label">Средний балл по школе</span>
                        <span className="ia-kpi-change up">+0.18 за 2 мес.</span>
                    </div>
                    <div className="ia-kpi">
                        <TrendingUp size={18} className="ia-kpi-icon up" />
                        <span className="ia-kpi-val">93%</span>
                        <span className="ia-kpi-label">Посещаемость</span>
                        <span className="ia-kpi-change up">+2.4% за месяц</span>
                    </div>
                    <div className="ia-kpi">
                        <TrendingUp size={18} className="ia-kpi-icon up" />
                        <span className="ia-kpi-val">67%</span>
                        <span className="ia-kpi-label">Процент качества</span>
                        <span className="ia-kpi-change up">+5% за квартал</span>
                    </div>
                    <div className="ia-kpi">
                        <AlertTriangle size={18} className="ia-kpi-icon warn" />
                        <span className="ia-kpi-val">18</span>
                        <span className="ia-kpi-label">Группа риска</span>
                        <span className="ia-kpi-change warn">Требуют внимания</span>
                    </div>
                </div>

                {/* Charts */}
                <div className="ia-charts-row">
                    <div className="ia-chart-card">
                        <h3 className="ia-chart-title">Средняя успеваемость по месяцам</h3>
                        <div className="ia-bar-chart">
                            {MONTHLY.map((m) => (
                                <div key={m.month} className="ia-bar-col">
                                    <span className="ia-bar-val">{m.score}</span>
                                    <div className="ia-bar" style={{ height: `${(m.score / MAX_SCORE) * 100}%` }} />
                                    <span className="ia-bar-lbl">{m.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="ia-chart-card">
                        <h3 className="ia-chart-title">Посещаемость (%)</h3>
                        <div className="ia-bar-chart">
                            {MONTHLY.map((m) => (
                                <div key={m.month} className="ia-bar-col">
                                    <span className="ia-bar-val">{m.attend}%</span>
                                    <div className="ia-bar green" style={{ height: `${(m.attend / MAX_ATTEND) * 100}%` }} />
                                    <span className="ia-bar-lbl">{m.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="ia-tabs">
                    {[['teachers', 'Учителя'], ['classes', 'Классы'], ['ai', 'AI-прогноз']].map(([k, l]) => (
                        <button
                            key={k}
                            type="button"
                            className={activeTab === k ? 'active' : ''}
                            onClick={() => setActiveTab(k as typeof activeTab)}
                        >{l}</button>
                    ))}
                </div>

                {/* Teachers tab */}
                {activeTab === 'teachers' && (
                    <div className="ia-table-wrap">
                        <table className="ia-table">
                            <thead>
                                <tr>
                                    <th>Учитель</th>
                                    <th>Предмет</th>
                                    <th>Ср. оценка</th>
                                    <th>Вып. плана</th>
                                    <th>Посещаемость</th>
                                    <th>Тренд</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TEACHERS.map((t) => (
                                    <tr key={t.name}>
                                        <td className="ia-teacher-name">{t.name}</td>
                                        <td>{t.subject}</td>
                                        <td>
                                            <span className={`ia-score ${t.avg >= 4.5 ? 'high' : t.avg >= 4.0 ? 'mid' : 'low'}`}>
                                                {t.avg}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="ia-prog-wrap">
                                                <div className="ia-prog-track">
                                                    <div className="ia-prog-fill" style={{ width: `${t.plan}%` }} />
                                                </div>
                                                <span>{t.plan}%</span>
                                            </div>
                                        </td>
                                        <td>{t.attend}%</td>
                                        <td>
                                            {t.trend === 'up'
                                                ? <TrendingUp size={14} style={{ color: '#22c55e' }} />
                                                : t.trend === 'down'
                                                    ? <TrendingDown size={14} style={{ color: '#ef4444' }} />
                                                    : <span style={{ color: '#9099a8' }}>—</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Classes tab */}
                {activeTab === 'classes' && (
                    <div className="ia-table-wrap">
                        <table className="ia-table">
                            <thead>
                                <tr>
                                    <th>Класс</th>
                                    <th>Учеников</th>
                                    <th>Ср. балл</th>
                                    <th>Проц. качества</th>
                                    <th>Посещаемость</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CLASSES.map((c) => (
                                    <tr key={c.name}>
                                        <td><strong>{c.name}</strong></td>
                                        <td>{c.students}</td>
                                        <td>
                                            <span className={`ia-score ${c.avg >= 4.4 ? 'high' : c.avg >= 4.0 ? 'mid' : 'low'}`}>
                                                {c.avg}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="ia-prog-wrap">
                                                <div className="ia-prog-track">
                                                    <div className="ia-prog-fill" style={{ width: `${c.quality}%` }} />
                                                </div>
                                                <span>{c.quality}%</span>
                                            </div>
                                        </td>
                                        <td>{c.attend}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* AI tab */}
                {activeTab === 'ai' && (
                    <div className="ia-ai-section">
                        <div className="ia-ai-header">
                            <Brain size={18} />
                            <span>AI выявил 18 учеников в группе риска — вероятность снижения успеваемости</span>
                        </div>
                        <div className="ia-table-wrap">
                            <table className="ia-table">
                                <thead>
                                    <tr>
                                        <th>Ученик</th>
                                        <th>Класс</th>
                                        <th>Причина</th>
                                        <th>Риск %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {RISK_STUDENTS.map((s) => (
                                        <tr key={s.name}>
                                            <td className="ia-teacher-name">{s.name}</td>
                                            <td>{s.cls}</td>
                                            <td>{s.reason}</td>
                                            <td>
                                                <span className={`ia-risk ${s.risk >= 80 ? 'high' : s.risk >= 70 ? 'mid' : 'low'}`}>
                                                    {s.risk}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </InstitutionShellLayout>
    )
}
