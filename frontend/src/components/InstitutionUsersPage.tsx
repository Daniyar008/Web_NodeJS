import { useEffect, useMemo, useState } from 'react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

type InstitutionUser = {
    id: string
    name: string
    role: 'teacher' | 'student' | 'parent' | 'admin'
    group: string
    status: 'active' | 'archived'
    email: string
}

const INITIAL_USERS: InstitutionUser[] = [
    { id: 'u1', name: 'Алия Сейтказина', role: 'teacher', group: 'МО математики', status: 'active', email: 'aliya@school.kz' },
    { id: 'u2', name: 'Руслан Байтенов', role: 'teacher', group: 'МО физики', status: 'active', email: 'ruslan@school.kz' },
    { id: 'u3', name: 'Дамир Муханов', role: 'student', group: '8А', status: 'active', email: 'damir8a@edu.kz' },
    { id: 'u4', name: 'Сауле Муханова', role: 'parent', group: '8А', status: 'active', email: 'saule.parent@edu.kz' },
    { id: 'u5', name: 'Бекжан Нуртаев', role: 'student', group: '9Б', status: 'archived', email: 'bekzhan9b@edu.kz' },
]

const ROLE_LABELS = {
    teacher: 'Учитель',
    student: 'Ученик',
    parent: 'Родитель',
    admin: 'Администратор',
} as const

const USER_STORAGE_KEY = 'institution-users-v1'
const USER_PAGE_SIZE = 4

export function InstitutionUsersPage({ language, onLanguageChange }: Props) {
    const [users, setUsers] = useState<InstitutionUser[]>(() => {
        try {
            const saved = localStorage.getItem(USER_STORAGE_KEY)
            if (!saved) return INITIAL_USERS
            return JSON.parse(saved) as InstitutionUser[]
        } catch {
            return INITIAL_USERS
        }
    })
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState<'all' | InstitutionUser['role']>('all')
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'teacher' as InstitutionUser['role'], group: '' })
    const [page, setPage] = useState(1)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    useEffect(() => {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users))
    }, [users])

    const roleCards = useMemo(() => {
        const active = users.filter((item) => item.status === 'active')
        return [
            { role: 'Администраторы учреждения', count: active.filter((item) => item.role === 'admin').length, rights: 'Полный доступ' },
            { role: 'Учителя', count: active.filter((item) => item.role === 'teacher').length, rights: 'Курсы, журнал, оценивание' },
            { role: 'Ученики', count: active.filter((item) => item.role === 'student').length, rights: 'Курсы, задания, турниры' },
            { role: 'Родители', count: active.filter((item) => item.role === 'parent').length, rights: 'Мониторинг успеваемости детей' },
        ]
    }, [users])

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const roleOk = roleFilter === 'all' || u.role === roleFilter
            const searchOk = `${u.name} ${u.group} ${u.email}`.toLowerCase().includes(search.toLowerCase())
            return roleOk && searchOk
        })
    }, [users, roleFilter, search])

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USER_PAGE_SIZE))
    const pagedUsers = filteredUsers.slice((page - 1) * USER_PAGE_SIZE, page * USER_PAGE_SIZE)

    useEffect(() => {
        setPage(1)
    }, [search, roleFilter])

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages])

    function openCreateModal() {
        setEditingId(null)
        setNewUser({ name: '', email: '', role: 'teacher', group: '' })
        setModalOpen(true)
    }

    function openEditModal(user: InstitutionUser) {
        setEditingId(user.id)
        setNewUser({ name: user.name, email: user.email, role: user.role, group: user.group })
        setModalOpen(true)
    }

    function upsertUser() {
        if (!newUser.name.trim() || !newUser.email.trim() || !newUser.group.trim()) return
        if (editingId) {
            setUsers((prev) => prev.map((item) => (item.id === editingId
                ? { ...item, name: newUser.name.trim(), email: newUser.email.trim(), role: newUser.role, group: newUser.group.trim() }
                : item)))
        } else {
            const id = `u${Date.now()}`
            setUsers((prev) => [
                {
                    id,
                    name: newUser.name.trim(),
                    email: newUser.email.trim(),
                    role: newUser.role,
                    group: newUser.group.trim(),
                    status: 'active',
                },
                ...prev,
            ])
        }
        setNewUser({ name: '', email: '', role: 'teacher', group: '' })
        setEditingId(null)
        setModalOpen(false)
    }

    function toggleArchive(id: string) {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'archived' : 'active' } : u)))
    }

    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Пользователи и роли"
            subtitle="Импорт, архивация, доступы и кадровые операции"
            activePage="i-users"
        >
            <section className="inst-grid-2">
                <article className="inst-card tall">
                    <h3>Ролевая модель</h3>
                    <div className="inst-table-like">
                        {roleCards.map((r) => (
                            <div key={r.role} className="inst-row">
                                <strong>{r.role}</strong>
                                <span>{r.count} активных</span>
                                <span>{r.rights}</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="inst-card tall">
                    <h3>Операции</h3>
                    <ul className="inst-list">
                        <li>Массовый импорт Excel/CSV: учителя, ученики, родители</li>
                        <li>Саморегистрация с подтверждением администратором</li>
                        <li>Назначение должностей и прав RBAC</li>
                        <li>Архивация уволенных/выбывших без потери истории</li>
                        <li>Восстановление аккаунтов из архива в 1 клик</li>
                    </ul>
                </article>
            </section>

            <section className="inst-grid-2">
                <article className="inst-card">
                    <h3>Управление пользователями</h3>
                    <p className="inst-card-note">Добавляй сотрудников, учеников и родителей через модальную форму, а также редактируй уже существующие записи.</p>
                    <div className="inst-toolbar">
                        <button type="button" className="inst-btn" onClick={openCreateModal}>Новый пользователь</button>
                        <span className="inst-chip">Всего записей: {users.length}</span>
                    </div>
                </article>

                <article className="inst-card">
                    <h3>Фильтры</h3>
                    <div className="inst-form-grid">
                        <input className="inst-input" placeholder="Поиск по ФИО, email, группе" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <select className="inst-input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as 'all' | InstitutionUser['role'])}>
                            <option value="all">Все роли</option>
                            <option value="teacher">Учителя</option>
                            <option value="student">Ученики</option>
                            <option value="parent">Родители</option>
                            <option value="admin">Администраторы</option>
                        </select>
                    </div>
                    <p className="inst-card-note">Найдено пользователей: {filteredUsers.length}</p>
                </article>
            </section>

            <section className="inst-grid-1">
                <article className="inst-card">
                    <h3>Список пользователей</h3>
                    <div className="inst-table-like">
                        {pagedUsers.map((u) => (
                            <div key={u.id} className="inst-row">
                                <strong>{u.name}</strong>
                                <span>{ROLE_LABELS[u.role]} · {u.group}</span>
                                <span>{u.email}</span>
                                <div className="inst-toolbar">
                                    <span className={u.status === 'active' ? 'inst-chip ok' : 'inst-chip'}>{u.status === 'active' ? 'Активен' : 'В архиве'}</span>
                                    <button type="button" className="inst-btn ghost" onClick={() => openEditModal(u)}>Редактировать</button>
                                    <button type="button" className="inst-btn ghost" onClick={() => toggleArchive(u.id)}>
                                        {u.status === 'active' ? 'Архивировать' : 'Восстановить'}
                                    </button>
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

            {modalOpen && (
                <div className="inst-modal-backdrop" onClick={() => setModalOpen(false)}>
                    <div className="inst-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="inst-modal-head">
                            <h3>{editingId ? 'Редактировать пользователя' : 'Добавить пользователя'}</h3>
                            <button type="button" className="inst-btn ghost" onClick={() => setModalOpen(false)}>Закрыть</button>
                        </div>
                        <div className="inst-form-grid">
                            <input className="inst-input" placeholder="ФИО" value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} />
                            <input className="inst-input" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} />
                            <select className="inst-input" value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value as InstitutionUser['role'] }))}>
                                <option value="teacher">Учитель</option>
                                <option value="student">Ученик</option>
                                <option value="parent">Родитель</option>
                                <option value="admin">Администратор</option>
                            </select>
                            <input className="inst-input" placeholder="Класс / подразделение" value={newUser.group} onChange={(e) => setNewUser((p) => ({ ...p, group: e.target.value }))} />
                        </div>
                        <div className="inst-toolbar end">
                            <button type="button" className="inst-btn ghost" onClick={() => setModalOpen(false)}>Отмена</button>
                            <button type="button" className="inst-btn" onClick={upsertUser}>{editingId ? 'Сохранить' : 'Добавить'}</button>
                        </div>
                    </div>
                </div>
            )}
        </InstitutionShellLayout>
    )
}
