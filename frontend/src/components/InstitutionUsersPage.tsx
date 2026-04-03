import { useEffect, useMemo, useState } from 'react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'
import { institution as instApi, type InstitutionMember } from '../lib/api'

type Props = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

type InstitutionUser = {
    id: string
    memberId: string
    name: string
    role: 'teacher' | 'student' | 'parent' | 'admin'
    group: string
    status: 'active'
    email: string
}

const ROLE_LABELS = {
    teacher: 'Учитель',
    student: 'Ученик',
    parent: 'Родитель',
    admin: 'Администратор',
} as const

const ROLE_MAP: Record<string, InstitutionUser['role']> = {
    TEACHER: 'teacher', STUDENT: 'student', PARENT: 'parent', ADMIN: 'admin', INSTITUTION_ADMIN: 'admin',
}

function memberToUser(m: InstitutionMember): InstitutionUser {
    return {
        id: m.user.id,
        memberId: m.id,
        name: `${m.user.firstName} ${m.user.lastName}`.trim() || m.user.email,
        role: ROLE_MAP[m.role] ?? 'student',
        group: m.class?.name ?? '—',
        status: 'active',
        email: m.user.email,
    }
}

const USER_PAGE_SIZE = 10

export function InstitutionUsersPage({ language, onLanguageChange }: Props) {
    const [instId, setInstId] = useState<string | null>(null)
    const [users, setUsers] = useState<InstitutionUser[]>([])
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState<'all' | InstitutionUser['role']>('all')
    const [page, setPage] = useState(1)

    useEffect(() => {
        instApi.list().then(list => {
            if (list.length === 0) return
            setInstId(list[0].id)
            return instApi.members(list[0].id)
        }).then((members?: InstitutionMember[]) => {
            if (members) setUsers(members.map(memberToUser))
        }).catch(() => {})
    }, [])

    async function removeMember(memberId: string) {
        if (!instId) return
        try {
            await instApi.removeMember(instId, memberId)
            setUsers(prev => prev.filter(u => u.memberId !== memberId))
        } catch { /* ignore */ }
    }

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
                    <p className="inst-card-note">Участники учреждения загружаются из базы данных.</p>
                    <div className="inst-toolbar">
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
                            <div key={u.memberId} className="inst-row">
                                <strong>{u.name}</strong>
                                <span>{ROLE_LABELS[u.role]} · {u.group}</span>
                                <span>{u.email}</span>
                                <div className="inst-toolbar">
                                    <span className="inst-chip ok">Активен</span>
                                    <button type="button" className="inst-btn ghost" style={{ color: '#ef4444' }} onClick={() => removeMember(u.memberId)}>Удалить</button>
                                </div>
                            </div>
                        ))}
                        {pagedUsers.length === 0 && <p style={{ color: '#9ca3af', fontSize: 13 }}>Нет участников</p>}
                    </div>
                    <div className="inst-pagination">
                        <button type="button" className="inst-btn ghost" disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>Назад</button>
                        <span className="inst-card-note">Страница {page} из {totalPages}</span>
                        <button type="button" className="inst-btn ghost" disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>Вперед</button>
                    </div>
                </article>
            </section>

        </InstitutionShellLayout>
    )
}
