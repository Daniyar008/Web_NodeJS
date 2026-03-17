import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type BreadcrumbItem = { label: string; to?: string }

type Props = {
  title: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
}

export function PageHeader({ title, breadcrumbs = [], actions }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            {breadcrumbs.map((b, i) => (
              <span key={b.label} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {b.to ? (
                  <Link to={b.to} className="hover:text-primary transition">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-slate-600 font-medium">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>

      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}

// Кнопка экспорта
export function ExportButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1.5"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Экспорт
    </button>
  )
}

// Кнопка "Добавить"
export function AddButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-3.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primaryDark transition flex items-center gap-1.5"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      {label}
    </button>
  )
}

// Статус-бейдж
export function StatusBadge({
  status,
  activeLabel = 'Активен',
  inactiveLabel = 'Неактивен',
}: {
  status: 'active' | 'inactive' | boolean
  activeLabel?: string
  inactiveLabel?: string
}) {
  const isActive = status === 'active' || status === true
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
        isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      {isActive ? activeLabel : inactiveLabel}
    </span>
  )
}
