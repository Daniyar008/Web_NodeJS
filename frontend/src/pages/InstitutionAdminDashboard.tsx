import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { institutionApi, type Institution, type Department, type Member } from '../features/institution/institutionApi.ts'

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
    return (
        <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">{label}</p>
            <p className="heading-font mt-1 text-3xl font-bold text-[color:var(--brand)]">{value}</p>
            {sub && <p className="mt-1 text-xs text-[color:var(--ink-700)]">{sub}</p>}
        </div>
    )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="heading-font text-xl font-bold text-[color:var(--ink-900)]">{children}</h2>
}

export function InstitutionAdminDashboard() {
    const navigate = useNavigate()
    const memberRoleOptions = ['STUDENT', 'TEACHER', 'PARENT', 'INSTITUTION_ADMIN']
    const [institutions, setInstitutions] = useState<Institution[]>([])
    const [selected, setSelected] = useState<(Institution & { departments: Department[] }) | null>(null)
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // New institution form
    const [showCreate, setShowCreate] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [showDepartmentForm, setShowDepartmentForm] = useState(false)
    const [showClassForm, setShowClassForm] = useState(false)
    const [showMemberForm, setShowMemberForm] = useState(false)
    const [form, setForm] = useState({ name: '', slug: '', description: '' })
    const [editForm, setEditForm] = useState({ name: '', description: '' })
    const [departmentName, setDepartmentName] = useState('')
    const [classForm, setClassForm] = useState({ name: '', year: '1', departmentId: '' })
    const [memberForm, setMemberForm] = useState({ userId: '', role: 'STUDENT', classId: '' })
    const [saving, setSaving] = useState(false)
    const [memberSearch, setMemberSearch] = useState('')
    const [memberRole, setMemberRole] = useState('ALL')

    const loadInstitutions = useCallback(async () => {
        try {
            setLoading(true)
            const data = await institutionApi.list()
            setInstitutions(data)
            if (data[0]) {
                const full = await institutionApi.get(data[0].id)
                setSelected(full)
                setEditForm({ name: full.name, description: full.description ?? '' })
                setClassForm((prev) => ({ ...prev, departmentId: full.departments[0]?.id ?? '' }))
                setMemberForm((prev) => ({ ...prev, classId: full.departments[0]?.classes[0]?.id ?? '' }))
                const mems = await institutionApi.listMembers(data[0].id)
                setMembers(mems)
            }
        } catch {
            setError('Не удалось загрузить учреждения')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { void loadInstitutions() }, [loadInstitutions])

    const selectInstitution = async (inst: Institution) => {
        try {
            const full = await institutionApi.get(inst.id)
            setSelected(full)
            setEditForm({ name: full.name, description: full.description ?? '' })
            setClassForm((prev) => ({ ...prev, departmentId: full.departments[0]?.id ?? '' }))
            setMemberForm((prev) => ({ ...prev, classId: full.departments[0]?.classes[0]?.id ?? '' }))
            const mems = await institutionApi.listMembers(inst.id)
            setMembers(mems)
        } catch {
            setError('Не удалось загрузить данные учреждения')
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await institutionApi.create(form)
            setForm({ name: '', slug: '', description: '' })
            setShowCreate(false)
            await loadInstitutions()
        } catch {
            setError('Ошибка при создании учреждения')
        } finally {
            setSaving(false)
        }
    }

    const handleUpdateInstitution = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selected) return
        setSaving(true)
        try {
            await institutionApi.update(selected.id, {
                name: editForm.name,
                description: editForm.description,
            })
            await selectInstitution(selected)
            const list = await institutionApi.list()
            setInstitutions(list)
            setShowEdit(false)
        } catch {
            setError('Ошибка при обновлении учреждения')
        } finally {
            setSaving(false)
        }
    }

    const handleCreateDepartment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selected || !departmentName.trim()) return
        setSaving(true)
        try {
            await institutionApi.createDepartment(selected.id, departmentName.trim())
            await selectInstitution(selected)
            setDepartmentName('')
            setShowDepartmentForm(false)
        } catch {
            setError('Не удалось создать отделение')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteDepartment = async (deptId: string) => {
        if (!selected) return
        try {
            await institutionApi.deleteDepartment(selected.id, deptId)
            await selectInstitution(selected)
        } catch {
            setError('Не удалось удалить отделение')
        }
    }

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selected || !classForm.name.trim() || !classForm.departmentId) return
        setSaving(true)
        try {
            await institutionApi.createClass(selected.id, {
                name: classForm.name.trim(),
                year: Number.parseInt(classForm.year, 10),
                departmentId: classForm.departmentId,
            })
            await selectInstitution(selected)
            setClassForm((prev) => ({ ...prev, name: '', year: '1' }))
            setShowClassForm(false)
        } catch {
            setError('Не удалось создать класс')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteClass = async (classId: string) => {
        if (!selected) return
        try {
            await institutionApi.deleteClass(selected.id, classId)
            await selectInstitution(selected)
        } catch {
            setError('Не удалось удалить класс')
        }
    }

    const handleRemoveMember = async (memberId: string) => {
        if (!selected) return
        try {
            await institutionApi.removeMember(selected.id, memberId)
            setMembers((prev) => prev.filter((m) => m.id !== memberId))
        } catch {
            setError('Не удалось удалить участника')
        }
    }

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selected || !memberForm.userId.trim()) return
        if (memberForm.role === 'STUDENT' && !memberForm.classId) {
            setError('Для ученика нужно выбрать класс')
            return
        }
        setSaving(true)
        setError(null)
        try {
            await institutionApi.addMember(selected.id, {
                userId: memberForm.userId.trim(),
                role: memberForm.role,
                classId: memberForm.role === 'STUDENT' ? memberForm.classId : undefined,
            })
            const [updatedInstitution, updatedMembers] = await Promise.all([
                institutionApi.get(selected.id),
                institutionApi.listMembers(selected.id),
            ])
            setSelected(updatedInstitution)
            setMembers(updatedMembers)
            setMemberForm((prev) => ({
                ...prev,
                userId: '',
                classId: updatedInstitution.departments[0]?.classes[0]?.id ?? prev.classId,
            }))
            setShowMemberForm(false)
        } catch {
            setError('Не удалось добавить участника. Проверьте userId и права доступа.')
        } finally {
            setSaving(false)
        }
    }

    const flatClasses = useMemo(() => {
        if (!selected) return []
        return selected.departments.flatMap((department) =>
            department.classes.map((cls) => ({
                ...cls,
                departmentName: department.name,
            })),
        )
    }, [selected])

    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            const searchableText = `${member.user.firstName} ${member.user.lastName} ${member.user.email} ${member.class?.name ?? ''}`.toLowerCase()
            const matchesSearch = searchableText.includes(memberSearch.toLowerCase())
            const matchesRole = memberRole === 'ALL' || member.role === memberRole
            return matchesSearch && matchesRole
        })
    }, [members, memberRole, memberSearch])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--brand)] border-t-transparent" />
            </div>
        )
    }

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="reveal rounded-3xl border border-[color:var(--line)] bg-white/85 p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">
                            Управление учреждением
                        </p>
                        <h1 className="heading-font mt-1 text-3xl font-bold sm:text-4xl">
                            {selected ? selected.name : 'Нет учреждений'}
                        </h1>
                        {selected?.description && (
                            <p className="mt-2 max-w-2xl text-sm text-[color:var(--ink-700)]">{selected.description}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {selected && (
                            <button
                                onClick={() => setShowEdit((v) => !v)}
                                className="rounded-xl border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
                            >
                                {showEdit ? 'Скрыть редактирование' : 'Редактировать'}
                            </button>
                        )}
                        <button
                            onClick={() => setShowCreate((v) => !v)}
                            className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                        >
                            {showCreate ? 'Отмена' : '+ Создать учреждение'}
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="rounded-xl border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
                        >
                            На главную
                        </button>
                    </div>
                </div>

                {/* Create form */}
                {showCreate && (
                    <form onSubmit={(e) => { void handleCreate(e) }} className="mt-6 grid gap-3 sm:grid-cols-3">
                        <input
                            required
                            placeholder="Название"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                        />
                        <input
                            required
                            placeholder="slug (латиница и дефис)"
                            value={form.slug}
                            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                            className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                        />
                        <input
                            placeholder="Описание (необязательно)"
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                        />
                        <button
                            type="submit"
                            disabled={saving}
                            className="col-span-full rounded-xl bg-[color:var(--brand)] py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 sm:col-span-1"
                        >
                            {saving ? 'Создание…' : 'Создать'}
                        </button>
                    </form>
                )}

                {showEdit && selected && (
                    <form onSubmit={(e) => { void handleUpdateInstitution(e) }} className="mt-4 grid gap-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--soft)]/30 p-4 sm:grid-cols-2">
                        <input
                            required
                            placeholder="Название учреждения"
                            value={editForm.name}
                            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                            className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                        />
                        <input
                            placeholder="Описание"
                            value={editForm.description}
                            onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                            className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                        />
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 sm:col-span-1"
                        >
                            {saving ? 'Сохранение…' : 'Сохранить изменения'}
                        </button>
                    </form>
                )}
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            {/* Institution switcher */}
            {institutions.length > 1 && (
                <div className="flex flex-wrap gap-2">
                    {institutions.map((inst) => (
                        <button
                            key={inst.id}
                            onClick={() => { void selectInstitution(inst) }}
                            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${selected?.id === inst.id
                                ? 'bg-[color:var(--brand)] text-white'
                                : 'border border-[color:var(--line)] bg-white hover:bg-gray-50'
                                }`}
                        >
                            {inst.name}
                        </button>
                    ))}
                </div>
            )}

            {selected && (
                <>
                    {/* Stats */}
                    <div className="card-grid">
                        <StatCard label="Отделений" value={selected._count?.departments ?? selected.departments.length} />
                        <StatCard label="Участников" value={selected._count?.memberships ?? members.length} />
                        <StatCard label="Участников (загружено)" value={members.length} sub="сотрудники и ученики" />
                        <StatCard label="Найдено по фильтру" value={filteredMembers.length} sub="поиск и роль" />
                        <StatCard label="Статус" value={selected.isActive ? 'Активно' : 'Неактивно'} />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <SectionTitle>Новые отделения</SectionTitle>
                                <button
                                    onClick={() => setShowDepartmentForm((v) => !v)}
                                    className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-xs font-semibold transition hover:bg-gray-50"
                                >
                                    {showDepartmentForm ? 'Скрыть' : '+ Отделение'}
                                </button>
                            </div>
                            {showDepartmentForm && (
                                <form onSubmit={(e) => { void handleCreateDepartment(e) }} className="mt-4 flex gap-2">
                                    <input
                                        value={departmentName}
                                        onChange={(e) => setDepartmentName(e.target.value)}
                                        placeholder="Например: МО математики"
                                        className="flex-1 rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                                    />
                                    <button type="submit" disabled={saving} className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                                        Добавить
                                    </button>
                                </form>
                            )}
                        </div>

                        <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <SectionTitle>Новые классы</SectionTitle>
                                <button
                                    onClick={() => setShowClassForm((v) => !v)}
                                    className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-xs font-semibold transition hover:bg-gray-50"
                                >
                                    {showClassForm ? 'Скрыть' : '+ Класс'}
                                </button>
                            </div>
                            {showClassForm && (
                                <form onSubmit={(e) => { void handleCreateClass(e) }} className="mt-4 grid gap-2 sm:grid-cols-3">
                                    <input
                                        value={classForm.name}
                                        onChange={(e) => setClassForm((prev) => ({ ...prev, name: e.target.value }))}
                                        placeholder="Например: 8А"
                                        className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                                    />
                                    <input
                                        value={classForm.year}
                                        type="number"
                                        min={1}
                                        max={12}
                                        onChange={(e) => setClassForm((prev) => ({ ...prev, year: e.target.value }))}
                                        placeholder="Год"
                                        className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                                    />
                                    <select
                                        aria-label="Выбор отделения для нового класса"
                                        value={classForm.departmentId}
                                        onChange={(e) => setClassForm((prev) => ({ ...prev, departmentId: e.target.value }))}
                                        className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                                    >
                                        {selected.departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                    <button type="submit" disabled={saving} className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-1">
                                        Создать класс
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Departments tree */}
                    <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-6 shadow-sm">
                        <SectionTitle>Структура учреждения</SectionTitle>
                        {selected.departments.length === 0 ? (
                            <p className="mt-3 text-sm text-[color:var(--ink-700)]">Нет отделений. Добавьте через API или настройки.</p>
                        ) : (
                            <ul className="mt-4 space-y-3">
                                {selected.departments.map((dept) => (
                                    <li key={dept.id} className="rounded-xl border border-[color:var(--line)] p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="font-semibold">{dept.name}</p>
                                            <button
                                                onClick={() => { void handleDeleteDepartment(dept.id) }}
                                                className="text-xs font-semibold text-red-600 hover:underline"
                                            >
                                                Удалить отделение
                                            </button>
                                        </div>
                                        {dept.classes.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {dept.classes.map((cls) => (
                                                    <div key={cls.id} className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800">
                                                        <span>{cls.name} ({cls.year})</span>
                                                        <button
                                                            onClick={() => { void handleDeleteClass(cls.id) }}
                                                            className="text-emerald-900/80 transition hover:text-red-600"
                                                        >
                                                            x
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Members table */}
                    <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-6 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <SectionTitle>Участники</SectionTitle>
                            <button
                                onClick={() => setShowMemberForm((v) => !v)}
                                className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-xs font-semibold transition hover:bg-gray-50"
                            >
                                {showMemberForm ? 'Скрыть форму' : '+ Подключить участника'}
                            </button>
                        </div>
                        {showMemberForm && (
                            <form onSubmit={(e) => { void handleAddMember(e) }} className="mt-4 grid gap-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--soft)]/30 p-4 lg:grid-cols-[1.4fr,220px,1fr,auto]">
                                <div className="space-y-1">
                                    <input
                                        required
                                        value={memberForm.userId}
                                        onChange={(e) => setMemberForm((prev) => ({ ...prev, userId: e.target.value }))}
                                        placeholder="userId пользователя"
                                        className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                                    />
                                    <p className="text-xs text-[color:var(--ink-700)]">
                                        Используйте внутренний ID пользователя из auth/backend. Для учеников ниже назначается класс.
                                    </p>
                                </div>
                                <select
                                    aria-label="Роль нового участника"
                                    value={memberForm.role}
                                    onChange={(e) => setMemberForm((prev) => ({
                                        ...prev,
                                        role: e.target.value,
                                        classId: e.target.value === 'STUDENT' ? (prev.classId || flatClasses[0]?.id || '') : '',
                                    }))}
                                    className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                                >
                                    {memberRoleOptions.map((roleOption) => (
                                        <option key={roleOption} value={roleOption}>{roleOption}</option>
                                    ))}
                                </select>
                                <select
                                    aria-label="Класс для нового участника"
                                    value={memberForm.classId}
                                    onChange={(e) => setMemberForm((prev) => ({ ...prev, classId: e.target.value }))}
                                    disabled={memberForm.role !== 'STUDENT' || flatClasses.length === 0}
                                    className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)] disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    <option value="">{flatClasses.length === 0 ? 'Нет доступных классов' : 'Выберите класс'}</option>
                                    {flatClasses.map((cls) => (
                                        <option key={cls.id} value={cls.id}>{cls.departmentName} • {cls.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
                                >
                                    {saving ? 'Подключение…' : 'Добавить'}
                                </button>
                            </form>
                        )}
                        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr,220px]">
                            <input
                                value={memberSearch}
                                onChange={(e) => setMemberSearch(e.target.value)}
                                placeholder="Поиск по имени, email, классу"
                                className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                            />
                            <select
                                aria-label="Фильтр участников по роли"
                                value={memberRole}
                                onChange={(e) => setMemberRole(e.target.value)}
                                className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
                            >
                                <option value="ALL">Все роли</option>
                                {Array.from(new Set(members.map((member) => member.role))).map((role) => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        {members.length === 0 ? (
                            <p className="mt-3 text-sm text-[color:var(--ink-700)]">Участников нет</p>
                        ) : filteredMembers.length === 0 ? (
                            <p className="mt-3 text-sm text-[color:var(--ink-700)]">По текущему фильтру совпадений нет.</p>
                        ) : (
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[color:var(--line)] text-left text-xs text-[color:var(--ink-700)]">
                                            <th className="pb-2 pr-4 font-semibold">Имя</th>
                                            <th className="pb-2 pr-4 font-semibold">Email</th>
                                            <th className="pb-2 pr-4 font-semibold">Роль</th>
                                            <th className="pb-2 pr-4 font-semibold">Класс</th>
                                            <th className="pb-2 font-semibold" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMembers.map((m) => (
                                            <tr key={m.id} className="border-b border-[color:var(--line)] last:border-0">
                                                <td className="py-2 pr-4">{m.user.firstName} {m.user.lastName}</td>
                                                <td className="py-2 pr-4 text-[color:var(--ink-700)]">{m.user.email}</td>
                                                <td className="py-2 pr-4">
                                                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">
                                                        {m.role}
                                                    </span>
                                                </td>
                                                <td className="py-2 pr-4 text-[color:var(--ink-700)]">{m.class?.name ?? '—'}</td>
                                                <td className="py-2 text-right">
                                                    <button
                                                        onClick={() => { void handleRemoveMember(m.id) }}
                                                        className="text-xs text-red-600 hover:underline"
                                                    >
                                                        Удалить
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    )
}
