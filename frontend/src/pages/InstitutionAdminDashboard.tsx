import { useState, useEffect, useCallback } from 'react'
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
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [selected, setSelected] = useState<(Institution & { departments: Department[] }) | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // New institution form
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', description: '' })
  const [saving, setSaving] = useState(false)

  const loadInstitutions = useCallback(async () => {
    try {
      setLoading(true)
      const data = await institutionApi.list()
      setInstitutions(data)
      if (data[0]) {
        const full = await institutionApi.get(data[0].id)
        setSelected(full)
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

  const handleRemoveMember = async (memberId: string) => {
    if (!selected) return
    await institutionApi.removeMember(selected.id, memberId)
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

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
          </div>
          <div className="flex gap-2">
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
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                selected?.id === inst.id
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
            <StatCard label="Статус" value={selected.isActive ? 'Активно' : 'Неактивно'} />
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
                    <p className="font-semibold">{dept.name}</p>
                    {dept.classes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {dept.classes.map((cls) => (
                          <span
                            key={cls.id}
                            className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800"
                          >
                            {cls.name} ({cls.year})
                          </span>
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
            <SectionTitle>Участники</SectionTitle>
            {members.length === 0 ? (
              <p className="mt-3 text-sm text-[color:var(--ink-700)]">Участников нет</p>
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
                    {members.map((m) => (
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
