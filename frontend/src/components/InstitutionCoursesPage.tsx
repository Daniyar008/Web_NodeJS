import { useEffect, useMemo, useState } from 'react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

type CourseModerationItem = {
    id: string
    title: string
    author: string
    type: 'mandatory' | 'elective' | 'prep' | 'teacher-upskill'
    status: 'pending' | 'approved' | 'rejected'
}

const INITIAL_MODERATION: CourseModerationItem[] = [
    { id: 'c1', title: 'Алгебра: углубленный курс', author: 'А. Сейтказина', type: 'mandatory', status: 'pending' },
    { id: 'c2', title: 'Робототехника: старт', author: 'И. Тулегенов', type: 'elective', status: 'pending' },
    { id: 'c3', title: 'Подготовка к ЕНТ по физике', author: 'Р. Байтенов', type: 'prep', status: 'approved' },
]

const TYPE_LABEL = {
    mandatory: 'Обязательный',
    elective: 'Элективный',
    prep: 'Подготовительный',
    'teacher-upskill': 'Повышение квалификации',
} as const

const COURSES_STORAGE_KEY = 'institution-courses-v1'
const MODERATION_PAGE_SIZE = 3

export function InstitutionCoursesPage({ language, onLanguageChange }: Props) {
    const [moderation, setModeration] = useState<CourseModerationItem[]>(() => {
        try {
            const saved = localStorage.getItem(COURSES_STORAGE_KEY)
            if (!saved) return INITIAL_MODERATION
            return (JSON.parse(saved) as { moderation: CourseModerationItem[] }).moderation
        } catch {
            return INITIAL_MODERATION
        }
    })
    const [assignForm, setAssignForm] = useState({ className: '', course: '' })
    const [assignments, setAssignments] = useState<Array<{ id: string; className: string; course: string }>>(() => {
        try {
            const saved = localStorage.getItem(COURSES_STORAGE_KEY)
            if (!saved) return []
            return (JSON.parse(saved) as { assignments: Array<{ id: string; className: string; course: string }> }).assignments
        } catch {
            return []
        }
    })
    const [statusFilter, setStatusFilter] = useState<'all' | CourseModerationItem['status']>('all')
    const [page, setPage] = useState(1)
    const [assignModalOpen, setAssignModalOpen] = useState(false)

    useEffect(() => {
        localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify({ moderation, assignments }))
    }, [moderation, assignments])

    const pendingCount = useMemo(() => moderation.filter((m) => m.status === 'pending').length, [moderation])
    const filteredModeration = useMemo(
        () => moderation.filter((item) => statusFilter === 'all' || item.status === statusFilter),
        [moderation, statusFilter],
    )
    const totalPages = Math.max(1, Math.ceil(filteredModeration.length / MODERATION_PAGE_SIZE))
    const pagedModeration = filteredModeration.slice((page - 1) * MODERATION_PAGE_SIZE, page * MODERATION_PAGE_SIZE)

    useEffect(() => {
        setPage(1)
    }, [statusFilter])

    function setStatus(id: string, status: CourseModerationItem['status']) {
        setModeration((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
    }

    function assignCourse() {
        if (!assignForm.className.trim() || !assignForm.course.trim()) return
        setAssignments((prev) => [
            { id: `a${Date.now()}`, className: assignForm.className.trim(), course: assignForm.course.trim() },
            ...prev,
        ])
        setAssignForm({ className: '', course: '' })
    }

    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Курсы и контент"
            subtitle="Институциональные курсы, модерация и массовое назначение классам"
            activePage="i-courses"
        >
            <section className="inst-grid-3">
                <article className="inst-card"><p className="inst-card-label">Всего курсов</p><p className="inst-card-value">126</p><p className="inst-card-note">Из них 38 обязательных</p></article>
                <article className="inst-card"><p className="inst-card-label">На модерации</p><p className="inst-card-value">{pendingCount}</p><p className="inst-card-note">Ожидают решения методиста</p></article>
                <article className="inst-card"><p className="inst-card-label">Назначений классам</p><p className="inst-card-value">312</p><p className="inst-card-note">За текущий семестр</p></article>
            </section>

            <section className="inst-grid-2">
                <article className="inst-card tall">
                    <h3>Типы курсов</h3>
                    <ul className="inst-list">
                        <li>Обязательные (алгебра, физика, язык)</li>
                        <li>Элективные (робототехника, программирование)</li>
                        <li>Подготовительные (ЕНТ/ЕГЭ)</li>
                        <li>Повышение квалификации для учителей</li>
                    </ul>
                </article>

                <article className="inst-card tall">
                    <h3>Поток модерации</h3>
                    <div className="inst-toolbar compact">
                        <select className="inst-input inst-input-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | CourseModerationItem['status'])}>
                            <option value="all">Все статусы</option>
                            <option value="pending">На проверке</option>
                            <option value="approved">Одобренные</option>
                            <option value="rejected">Отклоненные</option>
                        </select>
                    </div>
                    <div className="inst-table-like">
                        {pagedModeration.map((item) => (
                            <div key={item.id} className="inst-row">
                                <strong>{item.title}</strong>
                                <span>Автор: {item.author}</span>
                                <span>{TYPE_LABEL[item.type]}</span>
                                <div className="inst-toolbar">
                                    <span className={item.status === 'approved' ? 'inst-chip ok' : item.status === 'rejected' ? 'inst-chip danger' : 'inst-chip'}>
                                        {item.status === 'pending' ? 'На проверке' : item.status === 'approved' ? 'Одобрен' : 'Отклонен'}
                                    </span>
                                    {item.status === 'pending' && (
                                        <>
                                            <button type="button" className="inst-btn ghost" onClick={() => setStatus(item.id, 'approved')}>Одобрить</button>
                                            <button type="button" className="inst-btn ghost" onClick={() => setStatus(item.id, 'rejected')}>Отклонить</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="inst-pagination">
                        <button type="button" className="inst-btn ghost" disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>Назад</button>
                        <span className="inst-card-note">Страница {page} из {totalPages}</span>
                        <button type="button" className="inst-btn ghost" disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>Вперед</button>
                    </div>
                </article>
            </section>

            <section className="inst-grid-2">
                <article className="inst-card">
                    <h3>Массовое назначение курса</h3>
                    <p className="inst-card-note">Назначай курс целым классам и группам через отдельную форму.</p>
                    <div className="inst-toolbar">
                        <button type="button" className="inst-btn" onClick={() => setAssignModalOpen(true)}>Новое назначение</button>
                        <span className="inst-chip">Назначений: {assignments.length}</span>
                    </div>
                </article>

                <article className="inst-card">
                    <h3>Последние назначения</h3>
                    <div className="inst-table-like">
                        {assignments.length === 0 && <p className="inst-card-note">Пока нет новых назначений</p>}
                        {assignments.map((a) => (
                            <div key={a.id} className="inst-row">
                                <strong>{a.course}</strong>
                                <span>Назначен: {a.className}</span>
                            </div>
                        ))}
                    </div>
                </article>
            </section>

            {assignModalOpen && (
                <div className="inst-modal-backdrop" onClick={() => setAssignModalOpen(false)}>
                    <div className="inst-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="inst-modal-head">
                            <h3>Назначить курс классу</h3>
                            <button type="button" className="inst-btn ghost" onClick={() => setAssignModalOpen(false)}>Закрыть</button>
                        </div>
                        <div className="inst-form-grid">
                            <input className="inst-input" placeholder="Класс / группа (напр. 8А)" value={assignForm.className} onChange={(e) => setAssignForm((p) => ({ ...p, className: e.target.value }))} />
                            <input className="inst-input" placeholder="Название курса" value={assignForm.course} onChange={(e) => setAssignForm((p) => ({ ...p, course: e.target.value }))} />
                        </div>
                        <div className="inst-toolbar end">
                            <button type="button" className="inst-btn ghost" onClick={() => setAssignModalOpen(false)}>Отмена</button>
                            <button type="button" className="inst-btn" onClick={() => { assignCourse(); setAssignModalOpen(false) }}>Назначить</button>
                        </div>
                    </div>
                </div>
            )}
        </InstitutionShellLayout>
    )
}
