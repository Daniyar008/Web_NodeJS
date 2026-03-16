import { useMemo, useState } from 'react'
import { IconDots } from '../../ui/icons'

type ClassRow = {
  id: string
  className: string
  section: string
  students: number
  subjects: number
  status: 'Активен' | 'Неактивен'
}

const seed: ClassRow[] = [
  { id: 'C138038', className: 'I', section: 'A', students: 30, subjects: 3, status: 'Активен' },
  { id: 'C138037', className: 'I', section: 'B', students: 25, subjects: 3, status: 'Активен' },
  { id: 'C138036', className: 'II', section: 'A', students: 40, subjects: 3, status: 'Активен' },
  { id: 'C138035', className: 'II', section: 'B', students: 35, subjects: 3, status: 'Активен' },
  { id: 'C138034', className: 'II', section: 'C', students: 25, subjects: 3, status: 'Неактивен' },
  { id: 'C138033', className: 'III', section: 'A', students: 30, subjects: 3, status: 'Активен' },
  { id: 'C138032', className: 'III', section: 'B', students: 25, subjects: 5, status: 'Активен' },
  { id: 'C138031', className: 'IV', section: 'A', students: 20, subjects: 5, status: 'Активен' },
  { id: 'C138030', className: 'IV', section: 'B', students: 30, subjects: 5, status: 'Неактивен' },
  { id: 'C138029', className: 'V', section: 'A', students: 35, subjects: 5, status: 'Активен' },
]

function Badge({ status }: { status: ClassRow['status'] }) {
  const cls =
    status === 'Активен'
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-rose-50 text-rose-700'
  return <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${cls}`}>{status}</span>
}

export function ClassListPage() {
  const [q, setQ] = useState('')
  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase()
    if (!qq) return seed
    return seed.filter((r) =>
      [r.id, r.className, r.section, r.status].some((v) => String(v).toLowerCase().includes(qq))
    )
  }, [q])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500">Панель / Академическое / Классы</div>
          <h2 className="text-xl font-semibold text-slate-900">Классы</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:bg-slate-50">
            Экспорт
          </button>
          <button className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primaryDark">
            Добавить класс
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="text-sm font-semibold text-slate-900">Список классов</div>
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-10 w-[260px] max-w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
              placeholder="Поиск"
            />
          </div>
        </div>

        <div className="overflow-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-bg text-slate-500 text-xs">
              <tr className="border-t border-slate-200">
                <th className="py-3 px-4 text-left font-semibold">ID</th>
                <th className="py-3 px-4 text-left font-semibold">Класс</th>
                <th className="py-3 px-4 text-left font-semibold">Секция</th>
                <th className="py-3 px-4 text-left font-semibold">Кол-во учеников</th>
                <th className="py-3 px-4 text-left font-semibold">Кол-во предметов</th>
                <th className="py-3 px-4 text-left font-semibold">Статус</th>
                <th className="py-3 px-4 text-right font-semibold">Действие</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-primary font-semibold">{r.id}</td>
                  <td className="py-3 px-4">{r.className}</td>
                  <td className="py-3 px-4">{r.section}</td>
                  <td className="py-3 px-4">{r.students}</td>
                  <td className="py-3 px-4">{String(r.subjects).padStart(2, '0')}</td>
                  <td className="py-3 px-4">
                    <Badge status={r.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className="h-9 w-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 inline-grid place-items-center text-slate-600"
                      aria-label="Действия"
                      title="Действия"
                    >
                      <IconDots />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td className="py-10 px-4 text-center text-slate-500" colSpan={7}>
                    Нет данных для отображения
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>Показано записей: {rows.length}</div>
          <div className="flex items-center gap-2">
            <button className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Назад</button>
            <button className="h-8 px-3 rounded-lg bg-primary text-white">1</button>
            <button className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">2</button>
            <button className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Вперёд</button>
          </div>
        </div>
      </div>
    </div>
  )
}

