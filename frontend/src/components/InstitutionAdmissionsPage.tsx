import { useState } from 'react'
import { Users, CheckCircle, XCircle, Clock, Search, Filter, Download, Eye } from 'lucide-react'
import { InstitutionShellLayout } from './InstitutionShellLayout'
import type { Language } from '../i18n/translations'

type Props = { language: Language; onLanguageChange: (l: Language) => void }
type Status = 'pending' | 'accepted' | 'rejected'

interface Application {
    id: string
    name: string
    email: string
    grade: string
    program: string
    submittedAt: string
    status: Status
    docs: boolean
    score: number
}

const INITIAL: Application[] = [
    { id: 'a1', name: 'Айгерим Нурова', email: 'ai.nurova@gmail.com', grade: '9', program: 'Информационные технологии', submittedAt: '15 мар 2026', status: 'pending', docs: true, score: 87 },
    { id: 'a2', name: 'Бауыржан Серик', email: 'b.serik@mail.ru', grade: '8', program: 'Естественные науки', submittedAt: '14 мар 2026', status: 'pending', docs: true, score: 92 },
    { id: 'a3', name: 'Гүлнара Ашимова', email: 'g.ashimova@yandex.kz', grade: '10', program: 'Гуманитарные науки', submittedAt: '13 мар 2026', status: 'accepted', docs: true, score: 78 },
    { id: 'a4', name: 'Дамир Калиев', email: 'd.kaliev@gmail.com', grade: '7', program: 'Физика и математика', submittedAt: '12 мар 2026', status: 'rejected', docs: false, score: 55 },
    { id: 'a5', name: 'Эльмира Сатова', email: 'e.satova@mail.ru', grade: '9', program: 'Информационные технологии', submittedAt: '11 мар 2026', status: 'pending', docs: true, score: 81 },
    { id: 'a6', name: 'Жанат Омаров', email: 'zh.omarov@gmail.com', grade: '11', program: 'Физика и математика', submittedAt: '10 мар 2026', status: 'accepted', docs: true, score: 95 },
    { id: 'a7', name: 'Зарина Бекова', email: 'z.bekova@gmail.com', grade: '8', program: 'Естественные науки', submittedAt: '9 мар 2026', status: 'pending', docs: false, score: 70 },
    { id: 'a8', name: 'Ислам Дуйсеков', email: 'i.duys@mail.ru', grade: '10', program: 'Гуманитарные науки', submittedAt: '8 мар 2026', status: 'rejected', docs: true, score: 48 },
]

const STATUS_LABEL: Record<Status, string> = { pending: 'Ожидает', accepted: 'Принят', rejected: 'Отклонён' }
const STATUS_COLOR: Record<Status, string> = { pending: '#f59e0b', accepted: '#10b981', rejected: '#ef4444' }

function exportCSV(apps: Application[]) {
    const header = ['ID', 'Имя', 'Email', 'Класс', 'Программа', 'Дата подачи', 'Статус', 'Баллы']
    const rows = apps.map(a => [a.id, a.name, a.email, a.grade, a.program, a.submittedAt, STATUS_LABEL[a.status], a.score])
    const csv = '\uFEFF' + [header, ...rows].map(r => r.join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url; link.download = 'admissions.csv'; link.click()
    URL.revokeObjectURL(url)
}

export function InstitutionAdmissionsPage({ language, onLanguageChange }: Props) {
    const [apps, setApps] = useState<Application[]>(INITIAL)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all')
    const [selected, setSelected] = useState<Application | null>(null)

    function setStatus(id: string, status: Status) {
        setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
        if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
    }

    const visible = apps.filter(a => {
        const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase()) ||
            a.program.toLowerCase().includes(search.toLowerCase())
        const matchStatus = filterStatus === 'all' || a.status === filterStatus
        return matchSearch && matchStatus
    })

    const counts = { all: apps.length, pending: apps.filter(a => a.status === 'pending').length, accepted: apps.filter(a => a.status === 'accepted').length, rejected: apps.filter(a => a.status === 'rejected').length }

    return (
        <InstitutionShellLayout language={language} onLanguageChange={onLanguageChange} title="Приёмная комиссия" activePage="admissions">
            <div className="adm-page">
                {/* Header */}
                <div className="adm-header">
                    <div>
                        <h1 className="adm-title">Приёмная комиссия</h1>
                        <p className="adm-sub">Управляйте заявками на поступление</p>
                    </div>
                    <button type="button" className="adm-export-btn" onClick={() => exportCSV(visible)}>
                        <Download size={14} /> Экспорт CSV
                    </button>
                </div>

                {/* Stats */}
                <div className="adm-stats">
                    {([['all', 'Всего заявок', <Users size={16} />], ['pending', 'Ожидают', <Clock size={16} />], ['accepted', 'Приняты', <CheckCircle size={16} />], ['rejected', 'Отклонены', <XCircle size={16} />]] as const).map(([key, label, icon]) => (
                        <button key={key} type="button" className={`adm-stat-card ${filterStatus === key ? 'active' : ''}`} onClick={() => setFilterStatus(key as Status | 'all')}>
                            <div className="adm-stat-icon">{icon}</div>
                            <div>
                                <p className="adm-stat-val">{counts[key]}</p>
                                <p className="adm-stat-label">{label}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Filter bar */}
                <div className="adm-filter-bar">
                    <div className="adm-search-wrap">
                        <Search size={14} className="adm-search-icon" />
                        <input className="adm-search" placeholder="Поиск по имени, email, программе..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="adm-filter-tabs">
                        {(['all', 'pending', 'accepted', 'rejected'] as const).map(s => (
                            <button key={s} type="button" className={`adm-filter-tab ${filterStatus === s ? 'active' : ''}`} style={filterStatus === s && s !== 'all' ? { color: STATUS_COLOR[s], borderColor: STATUS_COLOR[s] } : {}} onClick={() => setFilterStatus(s)}>
                                <Filter size={11} />
                                {s === 'all' ? 'Все' : STATUS_LABEL[s]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="adm-table-wrap">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Программа</th>
                                <th>Класс</th>
                                <th>Документы</th>
                                <th>Баллы</th>
                                <th>Дата подачи</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map(a => (
                                <tr key={a.id} className={`adm-row ${a.status}`}>
                                    <td>
                                        <div className="adm-row-name">
                                            <div className="adm-row-avatar">{a.name[0]}</div>
                                            <div>
                                                <p className="adm-row-fullname">{a.name}</p>
                                                <p className="adm-row-email">{a.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="adm-prog-badge">{a.program}</span></td>
                                    <td>{a.grade} класс</td>
                                    <td>
                                        <span className={`adm-docs-badge ${a.docs ? 'ok' : 'missing'}`}>
                                            {a.docs ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                            {a.docs ? 'Есть' : 'Нет'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="adm-score" style={{ color: a.score >= 75 ? '#10b981' : a.score >= 60 ? '#f59e0b' : '#ef4444' }}>
                                            {a.score}/100
                                        </span>
                                    </td>
                                    <td className="adm-date">{a.submittedAt}</td>
                                    <td>
                                        <span className="adm-status-badge" style={{ color: STATUS_COLOR[a.status], background: `${STATUS_COLOR[a.status]}18`, border: `1px solid ${STATUS_COLOR[a.status]}30` }}>
                                            {STATUS_LABEL[a.status]}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="adm-actions">
                                            <button type="button" title="Просмотр" className="adm-action-btn view" onClick={() => setSelected(a)}>
                                                <Eye size={13} />
                                            </button>
                                            <button type="button" title="Принять" className="adm-action-btn accept" onClick={() => setStatus(a.id, 'accepted')} disabled={a.status === 'accepted'}>
                                                <CheckCircle size={13} />
                                            </button>
                                            <button type="button" title="Отклонить" className="adm-action-btn reject" onClick={() => setStatus(a.id, 'rejected')} disabled={a.status === 'rejected'}>
                                                <XCircle size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visible.length === 0 && (
                        <div className="adm-empty"><Users size={32} color="#475569" /><p>Заявки не найдены</p></div>
                    )}
                </div>
            </div>

            {/* Detail modal */}
            {selected && (
                <div className="adm-modal-overlay" onClick={() => setSelected(null)}>
                    <div className="adm-modal" onClick={e => e.stopPropagation()}>
                        <div className="adm-modal-head" style={{ borderBottom: `2px solid ${STATUS_COLOR[selected.status]}` }}>
                            <div className="adm-modal-avatar">{selected.name[0]}</div>
                            <div>
                                <h3 className="adm-modal-name">{selected.name}</h3>
                                <p className="adm-modal-email">{selected.email}</p>
                            </div>
                            <span className="adm-status-badge large" style={{ color: STATUS_COLOR[selected.status], background: `${STATUS_COLOR[selected.status]}18` }}>
                                {STATUS_LABEL[selected.status]}
                            </span>
                        </div>
                        <div className="adm-modal-body">
                            <div className="adm-modal-field"><span>Программа</span><strong>{selected.program}</strong></div>
                            <div className="adm-modal-field"><span>Класс</span><strong>{selected.grade}</strong></div>
                            <div className="adm-modal-field"><span>Вступительный балл</span><strong>{selected.score}/100</strong></div>
                            <div className="adm-modal-field"><span>Документы</span><strong>{selected.docs ? '✅ Все загружены' : '❌ Не загружены'}</strong></div>
                            <div className="adm-modal-field"><span>Дата подачи</span><strong>{selected.submittedAt}</strong></div>
                        </div>
                        <div className="adm-modal-footer">
                            <button type="button" className="adm-btn accept-btn" onClick={() => setStatus(selected.id, 'accepted')}>
                                <CheckCircle size={14} /> Принять
                            </button>
                            <button type="button" className="adm-btn reject-btn" onClick={() => setStatus(selected.id, 'rejected')}>
                                <XCircle size={14} /> Отклонить
                            </button>
                            <button type="button" className="adm-btn close-btn" onClick={() => setSelected(null)}>Закрыть</button>
                        </div>
                    </div>
                </div>
            )}
        </InstitutionShellLayout>
    )
}
