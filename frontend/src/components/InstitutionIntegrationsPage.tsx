import { useState } from 'react'
import { ToggleLeft, ToggleRight, Download, ExternalLink, RefreshCw, Zap } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

type Integration = { key: string; name: string; desc: string; plan: string | null }

const INTEGRATIONS: Integration[] = [
    { key: 'zoom',     name: 'Zoom',            desc: 'Видеоконференции для собраний и уроков',        plan: null    },
    { key: 'gdrive',   name: 'Google Drive',    desc: 'Хранение учебных материалов в облаке',          plan: null    },
    { key: 'stripe',   name: 'Stripe',          desc: 'Приём платежей за подписку и курсы',            plan: null    },
    { key: 'telegram', name: 'Telegram-бот',    desc: 'Push-уведомления через Telegram',               plan: null    },
    { key: 'gosuslugi',name: 'Госуслуги',       desc: 'Синхронизация контингента обучающихся',         plan: 'corp'  },
    { key: 'elibrary', name: 'Э-библиотека',    desc: 'Доступ к республиканской электронной библиотеке', plan: 'pro' },
]

const REPORTS = [
    { id: 'grades',   label: 'Успеваемость',   formats: ['Excel','PDF','CSV'] },
    { id: 'attend',   label: 'Посещаемость',   formats: ['Excel','PDF'] },
    { id: 'workload', label: 'Нагрузка учителей', formats: ['Excel'] },
    { id: 'finance',  label: 'Финансы',        formats: ['Excel','CSV','JSON'] },
]

export function InstitutionIntegrationsPage({ language, onLanguageChange }: Props) {
    const [enabled, setEnabled] = useState<Record<string, boolean>>({
        zoom: true, gdrive: true, stripe: true, telegram: false, gosuslugi: false, elibrary: false,
    })
    const [activeReport, setActiveReport] = useState('grades')
    const [period, setPeriod] = useState('quarter')
    const [autoExport, setAutoExport] = useState(false)

    const toggle = (key: string) => setEnabled((prev) => ({ ...prev, [key]: !prev[key] }))

    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Интеграции и экспорт"
            subtitle="Подключение внешних сервисов и формирование отчётов"
            activePage="i-integrations"
        >
            <div className="ii-root">

                {/* ── Integrations ──────────────────────────────── */}
                <h2 className="ii-section-title"><Zap size={16}/> Подключённые сервисы</h2>
                <div className="ii-integrations-grid">
                    {INTEGRATIONS.map((intg) => {
                        const isOn = enabled[intg.key]
                        const locked = intg.plan !== null
                        return (
                            <div key={intg.key} className={`ii-intg-card ${isOn ? 'on' : 'off'} ${locked ? 'locked' : ''}`}>
                                <div className="ii-intg-header">
                                    <span className="ii-intg-name">{intg.name}</span>
                                    {locked
                                        ? <span className="ii-plan-badge">{intg.plan === 'corp' ? 'Корп.' : 'Pro+'}</span>
                                        : (
                                            <button className="ii-toggle-btn" onClick={() => toggle(intg.key)}>
                                                {isOn
                                                    ? <ToggleRight size={22} style={{ color: '#7c3aed' }}/>
                                                    : <ToggleLeft  size={22} style={{ color: '#9099a8' }}/>}
                                            </button>
                                        )}
                                </div>
                                <p className="ii-intg-desc">{intg.desc}</p>
                                {isOn && !locked && (
                                    <div className="ii-intg-actions">
                                        <button className="ii-action-link"><RefreshCw size={11}/> Переподключить</button>
                                        <button className="ii-action-link"><ExternalLink size={11}/> Настройки</button>
                                    </div>
                                )}
                                {locked && (
                                    <p className="ii-locked-note">Требуется тариф «{intg.plan === 'corp' ? 'Корпоративный' : 'Профессиональный+'}»</p>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* ── Reports export ────────────────────────────── */}
                <h2 className="ii-section-title"><Download size={16}/> Экспорт отчётов</h2>
                <div className="ii-export-card">
                    <div className="ii-report-tabs">
                        {REPORTS.map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                className={activeReport === r.id ? 'active' : ''}
                                onClick={() => setActiveReport(r.id)}
                            >{r.label}</button>
                        ))}
                    </div>

                    <div className="ii-export-controls">
                        <div className="ii-export-field">
                            <label>Период</label>
                            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                                <option value="week">Неделя</option>
                                <option value="month">Месяц</option>
                                <option value="quarter">Четверть</option>
                                <option value="semester">Семестр</option>
                                <option value="year">Учебный год</option>
                            </select>
                        </div>

                        <div className="ii-export-formats">
                            {REPORTS.find((r) => r.id === activeReport)?.formats.map((fmt) => (
                                <button key={fmt} className="ii-fmt-btn">
                                    <Download size={12}/> {fmt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="ii-auto-export-row">
                        <span>Автоматический экспорт каждую неделю</span>
                        <button className="ii-toggle-btn" onClick={() => setAutoExport(!autoExport)}>
                            {autoExport
                                ? <ToggleRight size={22} style={{ color: '#7c3aed' }}/>
                                : <ToggleLeft  size={22} style={{ color: '#9099a8' }}/>}
                        </button>
                    </div>
                </div>
            </div>
        </InstitutionShellLayout>
    )
}