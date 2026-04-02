import { useState } from 'react'
import { Check, X, Clock, Mail } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Application = {
    id: string
    name: string
    email: string
    phone: string
    appliedDate: string
    status: 'pending' | 'approved' | 'rejected'
}

const APPLICATIONS: Application[] = [
    { id: '1', name: 'Раиса Жанбаева', email: 'raisa@mail.kz', phone: '+7 700 123 4567', appliedDate: '2026-04-01', status: 'pending' },
    { id: '2', name: 'Кайрат Сулейменов', email: 'kairat@mail.kz', phone: '+7 700 234 5678', appliedDate: '2026-03-30', status: 'approved' },
    { id: '3', name: 'Светлана Морозова', email: 'sveta@mail.kz', phone: '+7 700 345 6789', appliedDate: '2026-03-28', status: 'rejected' },
    { id: '4', name: 'Данияр Нурмухамбетов', email: 'daniyar@mail.kz', phone: '+7 700 456 7890', appliedDate: '2026-03-25', status: 'pending' },
]

export function AdminissionsPage({ language, onLanguageChange }: { language: Language; onLanguageChange: (l: Language) => void }) {
    const [apps, setApps] = useState<Application[]>(APPLICATIONS)
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

    const visible = apps.filter(a => filter === 'all' || a.status === filter)

    return (
        <InstitutionShellLayout language={language} onLanguageChange={onLanguageChange} title="Заявки на поступление" activePage="i-settings">
            <div className="adm-root">
                <div className="adm-header">
                    <h1 className="adm-title">Управление заявками</h1>
                    <p className="adm-sub">Просмотрите и рассмотрите заявки абитуриентов</p>
                </div>

                <div className="adm-filters">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                        <button key={f} type="button" className={filter === f ? 'adm-filter active' : 'adm-filter'} onClick={() => setFilter(f)}>
                            {f === 'all' ? 'Все' : f === 'pending' ? 'На рассмотрении' : f === 'approved' ? 'Одобрены' : 'Отклонены'}
                        </button>
                    ))}
                </div>

                <div className="adm-table">
                    {visible.length === 0 ? (
                        <div className="adm-empty">
                            <Clock size={40} />
                            <p>Нет заявок</p>
                        </div>
                    ) : (
                        visible.map(a => (
                            <div key={a.id} className={`adm-item ${a.status}`}>
                                <div className="adm-item-main">
                                    <div>
                                        <h4 className="adm-item-name">{a.name}</h4>
                                        <div className="adm-item-contacts">
                                            <a href={`mailto:${a.email}`} className="adm-link">
                                                <Mail size={12} /> {a.email}
                                            </a>
                                            <span>{a.phone}</span>
                                        </div>
                                    </div>
                                    <span className="adm-item-date">{a.appliedDate}</span>
                                </div>
                                {a.status === 'pending' && (
                                    <div className="adm-item-actions">
                                        <button type="button" className="adm-btn approve" onClick={() => setApps(prev => prev.map(x => x.id === a.id ? { ...x, status: 'approved' } : x))}>
                                            <Check size={14} /> Одобрить
                                        </button>
                                        <button type="button" className="adm-btn reject" onClick={() => setApps(prev => prev.map(x => x.id === a.id ? { ...x, status: 'rejected' } : x))}>
                                            <X size={14} /> Отклонить
                                        </button>
                                    </div>
                                )}
                                {a.status !== 'pending' && (
                                    <div className="adm-status-badge" data-status={a.status}>
                                        {a.status === 'approved' ? '✓ Одобрена' : '✕ Отклонена'}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </InstitutionShellLayout>
    )
}
