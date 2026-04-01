import { useState } from 'react'
import { Calendar, ShieldCheck, CheckCircle, Settings } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

type Role = { key: string; label: string }
type Feature = { key: string; label: string }

const ROLES: Role[] = [
    { key: 'director',   label: 'Директор' },
    { key: 'deputy',     label: 'Завуч' },
    { key: 'methodhead', label: 'Рук. МО' },
    { key: 'metodist',   label: 'Методист' },
    { key: 'hradmin',    label: 'HR-Администратор' },
]
const FEATURES: Feature[] = [
    { key: 'finances',  label: 'Финансы' },
    { key: 'grades',    label: 'Оценки' },
    { key: 'schedules', label: 'Расписание' },
    { key: 'chats',     label: 'Чаты' },
    { key: 'reports',   label: 'Отчёты' },
    { key: 'users',     label: 'Пользователи' },
]

const DEFAULT_ACCESS: Record<string, Record<string, boolean>> = {
    director:   { finances: true,  grades: true,  schedules: true,  chats: true,  reports: true,  users: true  },
    deputy:     { finances: false, grades: true,  schedules: true,  chats: true,  reports: true,  users: true  },
    methodhead: { finances: false, grades: true,  schedules: true,  chats: false, reports: true,  users: false },
    metodist:   { finances: false, grades: false, schedules: true,  chats: false, reports: true,  users: false },
    hradmin:    { finances: false, grades: false, schedules: false, chats: false, reports: false, users: true  },
}

export function InstitutionSettingsPage({ language, onLanguageChange }: Props) {
    const [grading, setGrading] = useState<'5' | '10' | '100'>('5')
    const [access, setAccess] = useState(DEFAULT_ACCESS)
    const [requireApproval, setRequireApproval] = useState(true)
    const [chatMod, setChatMod] = useState(true)

    const toggleAccess = (role: string, feature: string) => {
        setAccess((prev) => ({
            ...prev,
            [role]: { ...prev[role], [feature]: !prev[role][feature] },
        }))
    }

    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Настройки учреждения"
            subtitle="Учебный календарь, оценивание, права доступа и модерация"
            activePage="i-settings"
        >
            <div className="is-root">

                {/* ── Academic calendar ─────────────────────────── */}
                <h2 className="is-section-title"><Calendar size={16}/> Учебный календарь</h2>
                <div className="is-card">
                    <div className="is-calendar-grid">
                        {[1, 2, 3, 4].map((q) => (
                            <div key={q} className="is-quarter">
                                <p className="is-quarter-label">{q}-я четверть</p>
                                <div className="is-date-row">
                                    <input type="date" className="is-date-input" defaultValue={q === 1 ? '2025-09-01' : q === 2 ? '2025-11-04' : q === 3 ? '2026-01-12' : '2026-03-30'}/>
                                    <span>—</span>
                                    <input type="date" className="is-date-input" defaultValue={q === 1 ? '2025-10-31' : q === 2 ? '2025-12-27' : q === 3 ? '2026-03-27' : '2026-05-25'}/>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="is-calendar-extra">
                        <div className="is-field">
                            <label>Каникулы (осенние)</label>
                            <input type="text" className="is-input" defaultValue="01.11 — 09.11.2025"/>
                        </div>
                        <div className="is-field">
                            <label>Экзаменационная сессия</label>
                            <input type="text" className="is-input" defaultValue="26.05 — 06.06.2026"/>
                        </div>
                    </div>
                </div>

                {/* ── Grading system ────────────────────────────── */}
                <h2 className="is-section-title"><CheckCircle size={16}/> Система оценивания</h2>
                <div className="is-card">
                    <div className="is-radio-group">
                        {([['5', '5-балльная шкала'], ['10', '10-балльная шкала'], ['100', '100-балльная шкала']] as const).map(([val, label]) => (
                            <label key={val} className="is-radio-label">
                                <input type="radio" name="grading" value={val} checked={grading === val} onChange={() => setGrading(val)}/>
                                {label}
                            </label>
                        ))}
                    </div>
                    <div className="is-thresholds">
                        <p className="is-thresh-title">Пороги качества:</p>
                        {grading === '5' && (
                            <div className="is-thresh-row">
                                <span className="is-grade a">«5»</span><span>= отлично</span>
                                <span className="is-grade b">«4»</span><span>= хорошо</span>
                                <span className="is-grade c">«3»</span><span>= удовл.</span>
                                <span className="is-grade d">«2»</span><span>= неудовл.</span>
                            </div>
                        )}
                        {grading === '10' && (
                            <div className="is-thresh-row">
                                <span className="is-grade a">9–10</span><span>= отлично</span>
                                <span className="is-grade b">7–8</span><span>= хорошо</span>
                                <span className="is-grade c">5–6</span><span>= удовл.</span>
                                <span className="is-grade d">1–4</span><span>= неудовл.</span>
                            </div>
                        )}
                        {grading === '100' && (
                            <div className="is-thresh-row">
                                <span className="is-grade a">85–100</span><span>= отлично</span>
                                <span className="is-grade b">70–84</span><span>= хорошо</span>
                                <span className="is-grade c">50–69</span><span>= удовл.</span>
                                <span className="is-grade d">0–49</span><span>= неудовл.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Access rights matrix ─────────────────────── */}
                <h2 className="is-section-title"><ShieldCheck size={16}/> Права доступа (RBAC)</h2>
                <div className="is-card">
                    <div className="is-matrix-wrap">
                        <table className="is-matrix">
                            <thead>
                                <tr>
                                    <th>Роль</th>
                                    {FEATURES.map((f) => <th key={f.key}>{f.label}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {ROLES.map((role) => (
                                    <tr key={role.key}>
                                        <td className="is-role-label">{role.label}</td>
                                        {FEATURES.map((feat) => (
                                            <td key={feat.key} className="is-matrix-cell">
                                                <input
                                                    type="checkbox"
                                                    checked={access[role.key][feat.key]}
                                                    onChange={() => toggleAccess(role.key, feat.key)}
                                                    className="is-checkbox"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Moderation toggles ────────────────────────── */}
                <h2 className="is-section-title"><Settings size={16}/> Модерация и согласования</h2>
                <div className="is-card">
                    <div className="is-toggle-row">
                        <div className="is-toggle-info">
                            <p className="is-toggle-label">Обязательное согласование курсов директором</p>
                            <p className="is-toggle-sub">Перед публикацией курс проходит проверку</p>
                        </div>
                        <button
                            className={`is-pill-toggle ${requireApproval ? 'on' : ''}`}
                            onClick={() => setRequireApproval(!requireApproval)}
                        >
                            <span className="is-pill-knob"/>
                        </button>
                    </div>
                    <div className="is-toggle-row">
                        <div className="is-toggle-info">
                            <p className="is-toggle-label">Модерация чатов по жалобам</p>
                            <p className="is-toggle-sub">Сообщения, получившие жалобы, блокируются на проверку</p>
                        </div>
                        <button
                            className={`is-pill-toggle ${chatMod ? 'on' : ''}`}
                            onClick={() => setChatMod(!chatMod)}
                        >
                            <span className="is-pill-knob"/>
                        </button>
                    </div>
                </div>

                <div className="is-save-row">
                    <button className="is-save-btn">Сохранить настройки</button>
                </div>
            </div>
        </InstitutionShellLayout>
    )
}