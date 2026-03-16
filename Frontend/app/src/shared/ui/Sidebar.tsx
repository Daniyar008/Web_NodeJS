import { NavLink } from 'react-router-dom'

type NavItem = {
  to: string
  label: string
  group?: string
}

const items: NavItem[] = [
  { to: '/', label: 'Панель', group: 'Главное' },
  { to: '/classes', label: 'Классы', group: 'Академическое' },
  { to: '/class-room', label: 'Кабинеты', group: 'Академическое' },
  { to: '/class-routine', label: 'Расписание классов', group: 'Академическое' },
  { to: '/section', label: 'Секции', group: 'Академическое' },
  { to: '/subject', label: 'Предметы', group: 'Академическое' },
  { to: '/syllabus', label: 'Силлабус', group: 'Академическое' },
  { to: '/time-table', label: 'Расписание', group: 'Академическое' },
  { to: '/home-work', label: 'Домашние задания', group: 'Академическое' },
  { to: '/attendance-report', label: 'Отчёт по посещаемости', group: 'Отчёты' },
]

function groupBy<T, K extends string>(arr: T[], keyFn: (t: T) => K) {
  return arr.reduce<Record<K, T[]>>((acc, cur) => {
    const k = keyFn(cur)
    acc[k] ||= []
    acc[k].push(cur)
    return acc
  }, {} as Record<K, T[]>)
}

export function Sidebar() {
  const grouped = groupBy(items, (i) => (i.group ?? 'Другое') as string)
  const groups = Object.keys(grouped)

  return (
    <aside className="w-[260px] bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="h-16 flex items-center gap-3 px-5">
        <div className="h-9 w-9 rounded-xl bg-primary text-white grid place-items-center font-bold">
          P
        </div>
        <div className="font-semibold text-slate-900">PreSkool</div>
      </div>

      <div className="px-3 pb-4 overflow-auto">
        {groups.map((g) => (
          <div key={g} className="mt-4">
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              {g}
            </div>
            <div className="space-y-1">
              {grouped[g].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition',
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-slate-600 hover:bg-slate-100',
                    ].join(' ')
                  }
                  end={item.to === '/'}
                >
                  <span className="h-2 w-2 rounded-full bg-current opacity-30" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

