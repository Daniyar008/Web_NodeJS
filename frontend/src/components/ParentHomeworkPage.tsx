import { useState } from 'react'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { ParentShellLayout } from './ParentShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

type HWStatus = 'done' | 'pending' | 'overdue' | 'in-progress'

const HW_LIST = [
    {
        id: 1, subj: 'Математика', teacher: 'А. Сейтказина', priority: 'high',
        text: 'Решить уравнения №5–8, стр. 45–46',
        due: 'Сегодня, 18:00', status: 'pending' as HWStatus,
        note: '⚠️ Контрольная завтра',
    },
    {
        id: 2, subj: 'Физика', teacher: 'Р. Байтенов', priority: 'normal',
        text: 'Прочитать §23, ответить на вопросы 1–4',
        due: 'Завтра, 14:00', status: 'done' as HWStatus,
        note: null,
    },
    {
        id: 3, subj: 'Русский язык', teacher: 'З. Абуова', priority: 'normal',
        text: 'Написать сочинение «Моя любимая книга» (~200 слов)',
        due: '20 апр (пятница)', status: 'in-progress' as HWStatus,
        note: null,
    },
    {
        id: 4, subj: 'Химия', teacher: 'Г. Ким', priority: 'normal',
        text: 'Составить отчёт по лабораторной работе №3',
        due: '18 апр', status: 'overdue' as HWStatus,
        note: '❗ Просрочено на 2 дня',
    },
    {
        id: 5, subj: 'История', teacher: 'Д. Серик', priority: 'low',
        text: 'Подготовить сообщение об индустриализации (5 мин)',
        due: '22 апр', status: 'pending' as HWStatus,
        note: null,
    },
    {
        id: 6, subj: 'Литература', teacher: 'З. Абуова', priority: 'normal',
        text: 'Дочитать главы 8–10 «Мастер и Маргарита»',
        due: '23 апр', status: 'done' as HWStatus,
        note: null,
    },
]

const STATUS_LABEL: Record<HWStatus, string> = {
    done: 'Выполнено', pending: 'Не выполнено', overdue: 'Просрочено', 'in-progress': 'В процессе',
}

export function ParentHomeworkPage({ language, onLanguageChange }: Props) {
    const [filter, setFilter] = useState<'all' | HWStatus>('all')
    const [expanded, setExpanded] = useState<number | null>(null)

    const visible = filter === 'all' ? HW_LIST : HW_LIST.filter((h) => h.status === filter)

    const counts = {
        done: HW_LIST.filter((h) => h.status === 'done').length,
        pending: HW_LIST.filter((h) => h.status === 'pending').length,
        overdue: HW_LIST.filter((h) => h.status === 'overdue').length,
        'in-progress': HW_LIST.filter((h) => h.status === 'in-progress').length,
    }

    return (
        <ParentShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Домашние задания"
            subtitle="Актуальные и просроченные задания Анны"
            activePage="p-homework"
        >
            {/* Summary chips */}
            <div className="phw-chips">
                <button
                    type="button"
                    className={`phw-chip all ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Все <span>{HW_LIST.length}</span>
                </button>
                <button
                    type="button"
                    className={`phw-chip done ${filter === 'done' ? 'active' : ''}`}
                    onClick={() => setFilter('done')}
                >
                    <CheckCircle size={13} /> Выполнено <span>{counts.done}</span>
                </button>
                <button
                    type="button"
                    className={`phw-chip pending ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    <Clock size={13} /> Ожидает <span>{counts.pending}</span>
                </button>
                <button
                    type="button"
                    className={`phw-chip overdue ${filter === 'overdue' ? 'active' : ''}`}
                    onClick={() => setFilter('overdue')}
                >
                    <AlertTriangle size={13} /> Просрочено <span>{counts.overdue}</span>
                </button>
                <button
                    type="button"
                    className={`phw-chip inprog ${filter === 'in-progress' ? 'active' : ''}`}
                    onClick={() => setFilter('in-progress')}
                >
                    В процессе <span>{counts['in-progress']}</span>
                </button>
            </div>

            {/* Homework cards */}
            <div className="phw-list">
                {visible.map((hw) => (
                    <div
                        key={hw.id}
                        className={`phw-card ${hw.status} ${hw.priority === 'high' ? 'high-priority' : ''}`}
                    >
                        <div
                            className="phw-card-head"
                            onClick={() => setExpanded(expanded === hw.id ? null : hw.id)}
                        >
                            <div className="phw-head-left">
                                <span className={`phw-status-dot ${hw.status}`} />
                                <div>
                                    <p className="phw-subj">📚 {hw.subj}</p>
                                    <p className="phw-teacher">{hw.teacher}</p>
                                </div>
                            </div>
                            <div className="phw-head-right">
                                <span className={`phw-status-badge ${hw.status}`}>
                                    {STATUS_LABEL[hw.status]}
                                </span>
                                <span className="phw-due">
                                    <Clock size={12} /> {hw.due}
                                </span>
                            </div>
                        </div>

                        <p className="phw-text">{hw.text}</p>

                        {hw.note && (
                            <p className="phw-note">{hw.note}</p>
                        )}

                        {expanded === hw.id && (
                            <div className="phw-detail">
                                <p className="phw-detail-label">Статус ребёнка:</p>
                                <p className="phw-detail-val">{STATUS_LABEL[hw.status]}</p>
                                {hw.status === 'done' && (
                                    <div className="phw-submission">
                                        <span>✅ Сдано вовремя</span>
                                        <button className="phw-view-btn">Посмотреть работу</button>
                                    </div>
                                )}
                                {hw.status === 'overdue' && (
                                    <div className="phw-remind">
                                        <button className="phw-remind-btn">
                                            <AlertTriangle size={13} /> Напомнить ребёнку
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </ParentShellLayout>
    )
}
