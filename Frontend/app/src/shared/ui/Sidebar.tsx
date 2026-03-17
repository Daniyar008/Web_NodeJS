import { NavLink } from 'react-router-dom'
import { useState } from 'react'

// ─── Icons ──────────────────────────────────────────────────
function Icon({ d, className = '' }: { d: string; className?: string }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

const ICONS: Record<string, string> = {
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  applications: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  students: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  teachers: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  parents: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  guardians: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  classes: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  classroom: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  routine: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  section: 'M4 6h16M4 12h16M4 18h7',
  subject: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  syllabus: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  timetable: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  homework: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  exams: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  fees: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
  chevron: 'M9 5l7 7-7 7',
}

// ─── Types ──────────────────────────────────────────────────
type NavItem = {
  to?: string
  label: string
  icon: keyof typeof ICONS
  children?: { to: string; label: string }[]
}

type NavGroup = {
  group: string
  items: NavItem[]
}

const NAV: NavGroup[] = [
  {
    group: 'Главное',
    items: [
      { to: '/', label: 'Панель (Админ)', icon: 'dashboard' },
      { to: '/student-dashboard', label: 'Панель (Ученик)', icon: 'dashboard' },
      { to: '/kanban', label: 'Задачи (Канбан)', icon: 'routine' },
      {
        label: 'Приложения',
        icon: 'applications',
        children: [{ to: '/applications', label: 'Список заявок' }],
      },
    ],
  },
  {
    group: 'Макет',
    items: [
      { to: '/layout/default', label: 'Стандартный', icon: 'dashboard' },
      { to: '/layout/mini', label: 'Мини', icon: 'dashboard' },
      { to: '/layout/rtl', label: 'RTL', icon: 'dashboard' },
      { to: '/layout/box', label: 'Бокс', icon: 'dashboard' },
    ],
  },
  {
    group: 'Люди',
    items: [
      {
        label: 'Ученики',
        icon: 'students',
        children: [{ to: '/students', label: 'Список учеников' }],
      },
      { to: '/parents', label: 'Родители', icon: 'parents' },
      { to: '/guardians', label: 'Опекуны', icon: 'guardians' },
      {
        label: 'Учителя',
        icon: 'teachers',
        children: [{ to: '/teachers', label: 'Список учителей' }],
      },
    ],
  },
  {
    group: 'Академическое',
    items: [
      {
        label: 'Классы',
        icon: 'classes',
        children: [{ to: '/classes', label: 'Список классов' }],
      },
      { to: '/class-room', label: 'Кабинеты', icon: 'classroom' },
      { to: '/class-routine', label: 'Расписание классов', icon: 'routine' },
      { to: '/section', label: 'Секции', icon: 'section' },
      { to: '/subject', label: 'Предметы', icon: 'subject' },
      { to: '/syllabus', label: 'Силлабус', icon: 'syllabus' },
      { to: '/time-table', label: 'Расписание', icon: 'timetable' },
      { to: '/home-work', label: 'Домашние задания', icon: 'homework' },
      { to: '/gradebook', label: 'Журнал оценок', icon: 'exams' },
      {
        label: 'Экзамены',
        icon: 'exams',
        children: [
          { to: '/exams', label: 'Список экзаменов' },
          { to: '/exam-schedule', label: 'Расписание экзаменов' },
        ],
      },
    ],
  },
  {
    group: 'Управление',
    items: [
      {
        label: 'Сбор оплаты',
        icon: 'fees',
        children: [{ to: '/fees-group', label: 'Группы оплаты' }],
      },
      {
        label: 'Персонал',
        icon: 'teachers',
        children: [{ to: '/staff', label: 'Список сотрудников' }],
      },
      { to: '/inventory', label: 'Инвентарь', icon: 'subject' },
      { to: '/library', label: 'Библиотека', icon: 'syllabus' },
    ],
  },
  {
    group: 'Отчеты',
    items: [
      { to: '/reports/attendance', label: 'Отчет по посещаемости', icon: 'routine' },
      { to: '/reports/class', label: 'Отчет по классу', icon: 'classes' },
      { to: '/reports/student', label: 'Отчет по ученику', icon: 'students' },
    ],
  },
]

// ─── Sub-menu item ───────────────────────────────────────────
function SidebarLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-2 pl-9 pr-3 py-1.5 rounded-xl text-xs transition',
          isActive
            ? 'bg-primary/10 text-primary font-semibold'
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50',
        ].join(' ')
      }
      end={to === '/'}
    >
      <span className="h-1 w-1 rounded-full bg-current opacity-50" />
      {label}
    </NavLink>
  )
}

// ─── Top-level nav item with optional accordion ──────────────
function SidebarItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)

  if (item.to) {
    return (
      <NavLink
        to={item.to}
        end={item.to === '/'}
        className={({ isActive }) =>
          [
            'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition',
            isActive
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
          ].join(' ')
        }
      >
        <Icon d={ICONS[item.icon]} />
        <span className="truncate flex-1">{item.label}</span>
      </NavLink>
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
      >
        <Icon d={ICONS[item.icon]} />
        <span className="truncate flex-1 text-left">{item.label}</span>
        <Icon
          d={ICONS.chevron}
          className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && item.children && (
        <div className="mt-0.5 space-y-0.5">
          {item.children.map((c) => (
            <SidebarLink key={c.to} to={c.to} label={c.label} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────
export function Sidebar() {
  return (
    <aside className="w-[260px] bg-white border-r border-slate-100 hidden md:flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100 flex-shrink-0">
        <div className="h-9 w-9 rounded-xl bg-primary text-white grid place-items-center font-bold text-base shadow-sm">
          P
        </div>
        <div>
          <div className="font-bold text-slate-900 text-sm">PreSkool</div>
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Система управления</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map((group) => (
          <div key={group.group}>
            <div className="px-2 mb-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              {group.group}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarItem key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 grid place-items-center text-primary font-bold text-sm flex-shrink-0">
            А
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-900 truncate">Администратор</div>
            <div className="text-[10px] text-slate-400 truncate tracking-tight">admin@preskool.edu</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
